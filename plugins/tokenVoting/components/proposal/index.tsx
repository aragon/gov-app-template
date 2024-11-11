import Link from "next/link";
import { Card, ProposalStatus, ProposalDataListItemStructure } from "@aragon/gov-ui-kit";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposal } from "../../hooks/useProposal";
import { useProposalStatus } from "../../hooks/useProposalVariantStatus";
import { useToken } from "../../hooks/useToken";
import { useAccount } from "wagmi";
import { formatEther, formatUnits, parseUnits } from "viem";
import { PUB_TOKEN_SYMBOL } from "@/constants";
import { useProposalVoteList } from "../../hooks/useProposalVoteList";
import { VotingBreakdown } from "@/components/proposalVoting";
import {
  BreakdownMajorityVotingResult,
  IBreakdownMajorityVotingResult,
} from "@/components/proposalVoting/votingBreakdown/majorityVotingResult";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_METADATA_SUMMARY = "(The metadata of the proposal is not available)";

type ProposalInputs = {
  proposalIndex: number;
};

export default function ProposalCard(props: ProposalInputs) {
  const { address } = useAccount();
  const { proposal, status: proposalFetchStatus } = useProposal(props.proposalIndex);
  const votes = useProposalVoteList(props.proposalIndex, proposal);
  const { symbol: tokenSymbol } = useToken();
  const proposalStatus = useProposalStatus(proposal!);
  const showLoading = getShowProposalLoading(proposal, proposalFetchStatus);

  const hasVoted = votes?.some((vote) => vote.voter === address);
  const totalVotes =
    (proposal?.tally.yes || BigInt(0)) + (proposal?.tally.no || BigInt(0)) + (proposal?.tally.abstain || BigInt(0));

  if (!proposal && showLoading) {
    return (
      <section className="mb-4 w-full">
        <Card className="p-4">
          <span className="xs:px-10 px-4 py-5 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading proposal..." />
          </span>
        </Card>
      </section>
    );
  } else if (!proposal?.title && !proposal?.summary) {
    // We have the proposal but no metadata yet
    return (
      <Link href={`#/community-voting/proposals/${props.proposalIndex}`} className="mb-4 w-full">
        <Card className="p-4">
          <span className="xs:px-10 px-4 py-5 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading metadata..." />
          </span>
        </Card>
      </Link>
    );
  } else if (proposalFetchStatus.metadataReady && !proposal?.title) {
    return (
      <Link href={`#/community-voting/proposals/${props.proposalIndex}`} className="mb-4 w-full">
        <Card className="p-4">
          <div className="xl:4/5 overflow-hidden text-ellipsis text-nowrap pr-4 md:w-7/12 lg:w-3/4">
            <h4 className="mb-1 line-clamp-1 text-lg text-neutral-300">
              {Number(props.proposalIndex) + 1} - {DEFAULT_PROPOSAL_METADATA_TITLE}
            </h4>
            <p className="line-clamp-3 text-base text-neutral-300">{DEFAULT_PROPOSAL_METADATA_SUMMARY}</p>
          </div>
        </Card>
      </Link>
    );
  }

  const votingResults: IBreakdownMajorityVotingResult["votingScores"] = [
    {
      option: "Yes",
      voteAmount: formatEther(proposal.tally.yes) + " " + (tokenSymbol || PUB_TOKEN_SYMBOL),
      votePercentage: Number(((proposal?.tally.yes || BigInt(0)) * BigInt(10_000)) / (totalVotes || BigInt(1))) / 100,
      tokenSymbol: PUB_TOKEN_SYMBOL,
    },
    {
      option: "No",
      voteAmount: formatEther(proposal.tally.no) + " " + (tokenSymbol || PUB_TOKEN_SYMBOL),
      votePercentage: Number(((proposal?.tally.no || BigInt(0)) * BigInt(10_000)) / (totalVotes || BigInt(1))) / 100,
      tokenSymbol: PUB_TOKEN_SYMBOL,
    },
    {
      option: "Abstain",
      voteAmount: formatEther(proposal.tally.abstain) + " " + (tokenSymbol || PUB_TOKEN_SYMBOL),
      votePercentage:
        Number(((proposal?.tally.abstain || BigInt(0)) * BigInt(10_000)) / (totalVotes || BigInt(1))) / 100,
      tokenSymbol: PUB_TOKEN_SYMBOL,
    },
  ];

  return (
    <ProposalDataListItemStructure
      title={proposal.title}
      summary={proposal.summary}
      href={`#/community-voting/proposals/${props.proposalIndex}`}
      voted={hasVoted}
      date={
        [ProposalStatus.ACTIVE, ProposalStatus.ACCEPTED].includes(proposalStatus!) && proposal.parameters.endDate
          ? Number(proposal.parameters.endDate) * 1000
          : undefined
      }
      publisher={{ address: proposal.creator }}
      status={proposalStatus!}
      // @ts-expect-error intentionally passing unspecified type to prevent a score graph
      //  being displayed
      type={"customMajorityVoting"}
      className="custom-proposal-card-wrapper hover:border-primary-400"
    >
      {proposal?.active && (
        <BreakdownMajorityVotingResult status={proposalStatus} cta={undefined} votingScores={votingResults} />
      )}
    </ProposalDataListItemStructure>
  );
}

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposal>["proposal"],
  status: ReturnType<typeof useProposal>["status"]
) {
  if (!proposal || status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
