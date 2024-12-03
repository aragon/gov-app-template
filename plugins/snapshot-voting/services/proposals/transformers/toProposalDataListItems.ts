import { PUB_TOKEN_SYMBOL } from "@/constants";
import { ProposalStatus, type IProposal } from "@/plugins/snapshot-voting/services/snapshot/domain";
import { mapProposalChoice } from "@/plugins/snapshot-voting/services/snapshot/utils";
import {
  formatterUtils,
  NumberFormat,
  type IApprovalThresholdResult,
  type IMajorityVotingResult,
  type IProposalDataListItemStructureProps,
} from "@aragon/ods";
import { sanitize } from "dompurify";

type ProposalListItem = IProposalDataListItemStructureProps & { id: string };

export function toProposalDataListItems(proposals: IProposal[]): ProposalListItem[] {
  return proposals.map((proposal) => {
    // stage result
    let result: IMajorityVotingResult | IApprovalThresholdResult | undefined;
    if (proposal.totalVotes > 0) {
      const winningOption = proposal.scores.sort((a, b) => b.votes - a.votes)[0];

      result = {
        option: mapProposalChoice(winningOption?.choice ?? ""),
        voteAmount: `${formatterUtils.formatNumber(winningOption?.votes?.toString() ?? 0, { format: NumberFormat.TOKEN_AMOUNT_SHORT })} ${PUB_TOKEN_SYMBOL}`,
        votePercentage: Number((winningOption?.percentage ?? 0).toFixed(2)),
      } as IMajorityVotingResult;
    }

    return {
      id: proposal.id,
      date: getRelativeDate(
        proposal.status,
        new Date(proposal.startDate).toISOString(),
        new Date(proposal.endDate).toISOString()
      ),
      type: "majorityVoting",
      publisher: proposal.publisher,
      status: proposal.status,
      summary: sanitize(proposal.description.substring(0, 200)),
      title: proposal.title,
      result,
    };
  }) as Array<ProposalListItem>;
}

function getRelativeDate(status: ProposalStatus, startDate?: string, endDate?: string): string | undefined {
  switch (status) {
    case ProposalStatus.PENDING:
      return startDate;
    case ProposalStatus.REJECTED:
    case ProposalStatus.EXECUTED:
    case ProposalStatus.EXPIRED:
    case ProposalStatus.ACTIVE:
    case ProposalStatus.ACCEPTED:
      return endDate;
    default:
      return;
  }
}
