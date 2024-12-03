import { NotFound } from "@/components/not-found";
import { PUB_TOKEN_DECIMALS } from "@/constants";
import {
  canVote as canVoteQueryOptions,
  proposalDetail,
  proposalList,
  voted as votedQueryOptions,
} from "@/plugins/snapshot-voting/services/proposals/query-options";
import { useUserLockedTokens } from "@/plugins/voting-escrow/hooks/useUserLockedTokens";
import { formatHexString } from "@/utils/evm";
import { formatterUtils, NumberFormat, type IBreadcrumbsLink } from "@aragon/ods";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { BodySection, CardResources, HeaderProposal, ProposalVoting, type ITransformedStage } from "../components";
import { MainSection } from "../components/layout/mainSection";
import { ProposalDetailsSkeletonLoader } from "../components/proposalDetailsSkeleton/proposalDetailsSkeleton";
import { useCastVote } from "../hooks/useCastVote";
import { proposalKeys } from "../services/proposals";
import { ProposalStatus } from "../services/snapshot/domain";

export const PENDING_PROPOSAL_POLLING_INTERVAL = 1000; // 1 sec
export const ACTIVE_PROPOSAL_POLLING_INTERVAL = 1000 * 60 * 5; // 5 mins

export interface IProposalDetailsPageParams {
  proposalId: string;
}

export default function ProposalDetails({ proposalId }: IProposalDetailsPageParams) {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  // fetch proposal details
  const {
    data: proposal,
    isLoading: proposalLoading,
    refetch: refetchProposal,
    isSuccess: isProposalSuccess,
    fetchStatus: proposalFetchStatus,
    isRefetching: isRefetchingProposal,
    error,
  } = useQuery({
    ...proposalDetail({ proposalId }),
    refetchInterval: (query) =>
      query.state.data?.status === ProposalStatus.ACTIVE ? ACTIVE_PROPOSAL_POLLING_INTERVAL : false,
  });

  /*************************************************
   *         Proposal Details Read Queries         *
   *************************************************/

  // check if user can vote on the proposal
  const { data: userCanVote } = useQuery(canVoteQueryOptions({ address: address!, proposalId }));

  // check if user has voted on the proposal
  const { data: userHasVoted } = useQuery({
    ...votedQueryOptions({ address: address!, proposalId }),
    select: (data) => data.hasVoted,
  });

  // fetch user's locked tokens at proposal creation block
  const { data: lockedVp } = useUserLockedTokens({
    account: address,
    blockNumber: proposal?.snapshotBlock ? BigInt(Number(proposal?.snapshotBlock)) : undefined,
  });

  /*************************************************
   *              Query Invalidators               *
   *************************************************/
  // invalidates all the queries related to the proposal details
  const invalidateProposalDetailQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: proposalKeys?.proposal({ proposalId }),
      refetchType: "active",
    });

    queryClient.invalidateQueries({
      queryKey: proposalList().queryKey,
      refetchType: "all",
    });
  }, [proposalId, queryClient]);

  // invalidates the queries checking if connected address can cast a vote
  const inValidateVotingEligibilityQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: canVoteQueryOptions({
        address: address!,
        proposalId,
      }).queryKey,
      refetchType: "all",
    });
  }, [address, proposalId, queryClient]);

  /*************************************************
   *         Proposal Details Write Queries        *
   *************************************************/

  const { castVote, isConfirming: isVoting } = useCastVote(proposal?.id, invalidateProposalDetailQueries);

  /*************************************************
   *           Synchronization Effects             *
   *************************************************/
  /**
   * Given the nature of stages needing to advance from "Pending" to "Active" or
   * "Active" to a resolution state, we need to poll the proposal status to determine
   * when to refetch the proposal data.
   *
   * When a proposal is pending, we poll to check if the current stage has started
   * by comparing the stage start date with the current datetime.
   *
   * When a proposal is active, we poll to check if the current stage has ended
   * by comparing the stage end date with the current datetime.
   *
   * When the proposal is no longer in an active state or pending state,
   * we clear the polling interval.
   */
  useEffect(() => {
    if (!proposal) return;

    const interval = setInterval(() => {
      const {
        details: { startDate, endDate },
        status: proposalStatus,
      } = proposal;

      const now = dayjs();

      // proposal no longer pending or active, clear the polling interval
      if (proposal.status !== ProposalStatus.PENDING && proposal?.status !== ProposalStatus.ACTIVE) {
        clearInterval(interval);
        return;
      }

      // when current stage is pending but should start
      if (
        proposalStatus === ProposalStatus.PENDING &&
        startDate &&
        dayjs(startDate).isBefore(now) &&
        !isRefetchingProposal
      ) {
        // cancelling shouldn't be needed, but adding to avoid infinite looping
        queryClient.cancelQueries({ queryKey: proposalDetail({ proposalId }).queryKey });
        refetchProposal();
      }

      // when current stage is active but should end, refetch
      if (
        proposalStatus === ProposalStatus.ACTIVE &&
        endDate &&
        dayjs(endDate).isBefore(now) &&
        !isRefetchingProposal
      ) {
        queryClient.cancelQueries({ queryKey: proposalDetail({ proposalId }).queryKey });
        refetchProposal();
      }
    }, PENDING_PROPOSAL_POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [isRefetchingProposal, proposal, proposalId, queryClient, refetchProposal]);

  // Once a proposal has been fetched, invalidate the voting eligibility queries
  // so that we get the latest data since the eligibility may have changed
  useEffect(() => {
    if (isProposalSuccess && proposalFetchStatus === "idle") {
      inValidateVotingEligibilityQueries();
    }
  }, [inValidateVotingEligibilityQueries, isProposalSuccess, proposalFetchStatus]);

  /**************************************************
   *            Callbacks and Handlers              *
   **************************************************/

  const getVoteLabel = useCallback(() => {
    if (isVoting) {
      return "Submitting vote…";
    } else if (userHasVoted) {
      return "Change vote";
    } else if (!isConnected) {
      return "Connect to vote";
    } else {
      return "Vote";
    }
  }, [isConnected, isVoting, userHasVoted]);

  const getVoteAlert = useCallback(() => {
    if (isConnected && userCanVote === false) {
      return !!lockedVp && lockedVp > 0n
        ? `Connected account had ${formatterUtils.formatNumber(formatUnits(lockedVp, PUB_TOKEN_DECIMALS), { format: NumberFormat.TOKEN_AMOUNT_SHORT })} tokens in the warmup period but no voting power when the proposal was created`
        : "Connected wallet did not have voting power when the proposal was created";
    }
  }, [isConnected, lockedVp, userCanVote]);

  const stages = useMemo(() => {
    if (proposal == null) {
      return [];
    }

    const now = dayjs();
    const stageOngoing = !!proposal?.details?.endDate && dayjs(proposal.details.endDate).isAfter(now);
    const cta = stageOngoing
      ? {
          isLoading: isVoting,
          disabled: !isConnected || !userCanVote,
          onClick: (choice: number, reason: string) => {
            castVote(choice, reason);
          },
          label: getVoteLabel(),
          alert: getVoteAlert(),
        }
      : undefined;

    return [
      {
        id: "Community Voting",
        title: "Community Voting",
        status: proposal?.status,
        proposalId: proposal?.id,
        providerId: proposal?.id,
        result: proposal?.result,
        details: proposal?.details,
        cta,
      } as ITransformedStage,
    ];
  }, [castVote, getVoteAlert, getVoteLabel, isConnected, isVoting, proposal, userCanVote]);

  const breadcrumbs: IBreadcrumbsLink[] = [{ label: "Proposals", href: "#/" }, { label: formatHexString(proposalId) }];

  /**************************************************
   *                     Render                     *
   **************************************************/
  if (error) {
    if (error.message === "Proposal not found") {
      return <NotFound title={error.message} message={"We couldn't find a proposal matching the given id."} />;
    }
    return (
      <NotFound title="Oh no! Something went wrong" message={"An unexpected error occurred. Please try again later."} />
    );
  }

  if (proposalLoading) {
    return <ProposalDetailsSkeletonLoader breadcrumbs={breadcrumbs} />;
  }

  if (proposal) {
    return (
      <>
        <HeaderProposal breadcrumbs={breadcrumbs} proposal={proposal} />
        <MainSection className="md:px-16 md:pb-20 md:pt-10">
          <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
            {/* Proposal */}
            <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
              {proposal.body && <BodySection body={proposal.body} />}
              <ProposalVoting stages={stages} />
            </div>

            {/* Additional Information */}
            <div className="flex flex-col gap-y-6 md:w-[33%]">
              <CardResources resources={proposal.resources} title="Resources" />
            </div>
          </div>
        </MainSection>
      </>
    );
  }
}
