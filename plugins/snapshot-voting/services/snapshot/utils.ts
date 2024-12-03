import { ProposalStatus, type VotingScores } from "./domain";

export const computeProposalStatus = (proposalState: string, scores: VotingScores[]): ProposalStatus => {
  switch (proposalState) {
    case "active":
      return ProposalStatus.ACTIVE;
    case "closed":
      return computeProposalResult(scores);
    case "pending":
      return ProposalStatus.PENDING;
    default:
      return ProposalStatus.PENDING;
  }
};

export function mapProposalChoice(choice: string): string {
  switch (choice.toLowerCase()) {
    case "accept":
    case "yes":
    case "approve":
    case "for":
    case "yay":
      return "approve";
    case "reject":
    case "no":
    case "deny":
    case "against":
    case "nay":
    case "veto":
      return "reject";
    default:
      return choice;
  }
}

function computeProposalResult(votingData: VotingScores[]): ProposalStatus {
  let approvals = 0;
  let rejections = 0;

  // Loop through the array to count votes for 'approve' and 'reject'
  for (const vote of votingData) {
    const choice = vote.choice;
    if (choice === "approve") {
      approvals += vote.votes;
    } else if (choice === "reject") {
      rejections += vote.votes;
    }
  }

  // Determine the result based on the counts
  // update with proper calculation
  return rejections > approvals ? ProposalStatus.REJECTED : ProposalStatus.ACCEPTED;
}
