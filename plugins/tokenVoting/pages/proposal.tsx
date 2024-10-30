import { useProposal } from "../hooks/useProposal";
import ProposalHeader from "../components/proposal/header";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVoting } from "../hooks/useProposalVoting";
import { useProposalExecute } from "../hooks/useProposalExecute";
import { BodySection } from "@/components/proposal/proposalBodySection";
import { IBreakdownMajorityVotingResult, ProposalVoting } from "@/components/proposalVoting";
import type { ITransformedStage, IVote } from "@/utils/types";
import { ProposalStages } from "@/utils/types";
import { useProposalStatus } from "../hooks/useProposalVariantStatus";
import dayjs from "dayjs";
import { ProposalActions } from "@/components/proposalActions/proposalActions";
import { CardResources } from "@/components/proposal/cardResources";
import { formatEther } from "viem";
import { useToken } from "../hooks/useToken";
import { Button, DialogContent, DialogFooter, DialogHeader, DialogRoot, ProposalStatus } from "@aragon/ods";
import { useCanVote } from "../hooks/useCanVote";
import { useState } from "react";
import { PUB_TOKEN_SYMBOL } from "@/constants";
import { useProposalVoteList } from "../hooks/useProposalVoteList";

const ABSTAIN_VALUE = 1;
const VOTE_YES_VALUE = 2;
const VOTE_NO_VALUE = 3;

export default function ProposalDetail({ index: proposalIdx }: { index: number }) {
  const { voteProposal, isConfirming: isConfirmingVote } = useProposalVoting(proposalIdx);
  const { proposal, status: proposalFetchStatus } = useProposal(proposalIdx);
  const canVote = useCanVote(proposalIdx);
  const votes = useProposalVoteList(proposalIdx, proposal);
  const { symbol: tokenSymbol } = useToken();
  const [showVotingModal, setShowVotingModal] = useState(false);
  const { executeProposal, canExecute, isConfirming: isConfirmingExecution } = useProposalExecute(proposalIdx);
  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const proposalStatus = useProposalStatus(proposal!);

  const startDate = dayjs(Number(proposal?.parameters.startDate) * 1000).toString();
  const endDate = dayjs(Number(proposal?.parameters.endDate) * 1000).toString();
  const totalVotes =
    (proposal?.tally.yes || BigInt(0)) + (proposal?.tally.no || BigInt(0)) + (proposal?.tally.abstain || BigInt(0));

  let cta: IBreakdownMajorityVotingResult["cta"];
  if (proposal?.executed) {
    cta = {
      disabled: true,
      label: "Executed",
    };
  } else if (proposalStatus === ProposalStatus.ACCEPTED) {
    cta = {
      disabled: !canExecute || !proposal?.actions.length,
      isLoading: isConfirmingExecution,
      label: proposal?.actions.length ? "Execute" : "No actions to execute",
      onClick: executeProposal,
    };
  } else if (proposalStatus === ProposalStatus.ACTIVE) {
    cta = {
      disabled: !canVote,
      isLoading: isConfirmingVote,
      label: "Vote",
      onClick: (option?: number) => (option ? onVote(option) : null),
    };
  }

  const onVote = (voteOption: number | null) => {
    switch (voteOption) {
      case 1:
        return voteProposal(VOTE_YES_VALUE, true);
      case 2:
        return voteProposal(VOTE_NO_VALUE, true);
      case 3:
        return voteProposal(ABSTAIN_VALUE, true);
    }
  };

  const proposalStage: ITransformedStage[] = [
    {
      id: "1",
      type: ProposalStages.TOKEN_VOTING,
      variant: "majorityVoting",
      title: "Community voting",
      status: proposalStatus!,
      disabled: false,
      proposalId: proposalIdx.toString(),
      providerId: "1",
      result: {
        cta,
        votingScores: [
          {
            option: "Yes",
            voteAmount: formatEther(proposal?.tally.yes || BigInt(0)),
            votePercentage:
              Number(((proposal?.tally.yes || BigInt(0)) * BigInt(10_000)) / (totalVotes || BigInt(1))) / 100,
            tokenSymbol: tokenSymbol || PUB_TOKEN_SYMBOL,
          },
          {
            option: "No",
            voteAmount: formatEther(proposal?.tally.no || BigInt(0)),
            votePercentage:
              Number(((proposal?.tally.no || BigInt(0)) * BigInt(10_000)) / (totalVotes || BigInt(1))) / 100,
            tokenSymbol: tokenSymbol || PUB_TOKEN_SYMBOL,
          },
          {
            option: "Abstain",
            voteAmount: formatEther(proposal?.tally.abstain || BigInt(0)),
            votePercentage:
              Number(((proposal?.tally.abstain || BigInt(0)) * BigInt(10_000)) / (totalVotes || BigInt(1))) / 100,
            tokenSymbol: tokenSymbol || PUB_TOKEN_SYMBOL,
          },
        ],
        proposalId: proposalIdx.toString(),
      },
      details: {
        censusTimestamp: Number(proposal?.parameters.snapshotBlock || 0) || 0,
        startDate,
        endDate,
        strategy: "Community voting",
        options: "Vote",
      },
      votes: votes.map(
        ({ voter, voteOption: opt }) =>
          ({
            address: voter,
            variant: opt === ABSTAIN_VALUE ? "abstain" : opt === VOTE_YES_VALUE ? "yes" : "no",
          }) as IVote
      ),
    },
  ];

  if (!proposal || showProposalLoading) {
    return (
      <section className="justify-left items-left flex w-screen min-w-full max-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className="flex w-screen min-w-full max-w-full flex-col items-center">
      <ProposalHeader proposalIdx={proposalIdx} proposal={proposal} />

      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-16 md:pb-20 md:pt-10">
        <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
          <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
            <BodySection body={proposal.description || "No description was provided"} />
            <ProposalVoting
              stages={proposalStage}
              description="Proposals approved by the community become executable when the support ratio is above the threshold and the minimum participation is met."
            />
            <ProposalActions actions={proposal.actions} />
          </div>
          <div className="flex flex-col gap-y-6 md:w-[33%]">
            <CardResources resources={proposal.resources} title="Resources" />
          </div>
        </div>
      </div>
      <VoteOptionDialog show={showVotingModal} onClose={onVote} />
    </section>
  );
}

export const VoteOptionDialog: React.FC<{ show: boolean; onClose: (voteOption: number | null) => void }> = (props) => {
  const { show, onClose } = props;

  const dismiss = () => {
    onClose(null);
  };

  if (!show) {
    return <></>;
  }

  return (
    <DialogRoot open={show} containerClassName="!max-w-[420px]">
      <DialogHeader title="Select a vote option" onCloseClick={() => dismiss()} onBackClick={() => dismiss()} />
      <DialogContent className="flex flex-col gap-y-4 md:gap-y-6">
        <div className="">
          <Button variant="primary" size="lg" onClick={() => onClose(VOTE_YES_VALUE)}>
            Vote yes
          </Button>
          <Button variant="primary" size="lg" onClick={() => onClose(VOTE_NO_VALUE)}>
            Vote no
          </Button>
          <Button variant="primary" size="lg" onClick={() => onClose(ABSTAIN_VALUE)}>
            Abstain
          </Button>
          <Button variant="secondary" size="lg" onClick={() => dismiss()}>
            Cancel
          </Button>
        </div>
      </DialogContent>
      <DialogFooter />
    </DialogRoot>
  );
};

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposal>["proposal"],
  status: ReturnType<typeof useProposal>["status"]
) {
  if (!proposal && status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
