import { PUB_CHAIN } from "@/constants";
import { type SnapshotProposalQueryData } from "../types";
import { type IProposal, type VotingScores } from "../../domain";
import { computeProposalStatus, mapProposalChoice } from "../../utils";

export function parseProposalQueryData(proposal: SnapshotProposalQueryData): IProposal {
  // get resources
  const resources = [
    {
      name: "Snapshot",
      link: proposal.link,
    },
  ];

  if (proposal.discussion?.startsWith("http")) {
    resources.push({
      name: "Discussion",
      link: proposal.discussion,
    });
  }

  // get creator
  const publisher = [
    {
      link: `${PUB_CHAIN.blockExplorers?.default.url}/address/${proposal.author}`,
      address: proposal.author,
    },
  ];

  const choices = proposal.choices.map((c) => mapProposalChoice(c));
  const scores: VotingScores[] = proposal.scores.map((s, index) => ({
    choice: choices[index],
    votes: s,
    percentage: (s / proposal.scores_total) * 100,
  }));

  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.body,
    body: proposal.body,
    resources,
    status: computeProposalStatus(proposal.state, scores),
    createdAt: new Date(proposal.created * 1000).toISOString(),
    startDate: new Date(proposal.start * 1000).toISOString(),
    endDate: new Date(proposal.end * 1000).toISOString(),
    publisher,
    snapshotBlock: proposal.snapshot,
    choices,
    quorum: proposal.quorum,
    scores,
    totalVotes: proposal.votes,
  };
}
