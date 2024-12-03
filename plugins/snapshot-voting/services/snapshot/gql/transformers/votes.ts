import { type IProposalVote } from "../../domain";
import { type SnapshotVoteQueryData } from "../types";

export function parseVotesData(data: SnapshotVoteQueryData[]): IProposalVote[] {
  return data.map((vote) => {
    return {
      id: vote.id,
      address: vote.voter,
      vote: vote.proposal.choices[Number(vote.choice) - 1],
      amount: vote.vp,
      timestamp: new Date(Number(vote.created) * 1000).toISOString(),
      reason: vote.reason,
    };
  });
}
