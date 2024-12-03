import { type IVotesDataListVariant } from "@/plugins/snapshot-voting/components/proposalVoting/votesDataList/votesDataListItemStructure";
import { PUB_TOKEN_SYMBOL } from "@/constants";
import { formatterUtils, NumberFormat } from "@aragon/ods";
import { type IProposalVote } from "@/plugins/snapshot-voting/services/snapshot/domain";
import { mapProposalChoice } from "@/plugins/snapshot-voting/services/snapshot/utils";

export function toProposalVotes(data: IProposalVote[]) {
  return data.map((vote) => {
    return {
      id: vote.id,
      address: vote.address,
      votingPower: `${formatterUtils.formatNumber(vote.amount, { format: NumberFormat.TOKEN_AMOUNT_SHORT })} ${PUB_TOKEN_SYMBOL}`,
      choice: mapProposalChoice(vote.vote) as IVotesDataListVariant,
      justification: vote.reason,
    };
  });
}
