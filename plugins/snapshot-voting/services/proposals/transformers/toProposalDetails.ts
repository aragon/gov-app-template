import { PUB_TOKEN_SYMBOL } from "@/constants";
import { type IBreakdownMajorityVotingResult, type IVotingStageDetails } from "@/plugins/snapshot-voting/components";
import { type IProposal } from "@/plugins/snapshot-voting/services/snapshot/domain";
import { capitalizeFirstLetter } from "@/utils/case";
import { formatterUtils, NumberFormat } from "@aragon/ods";
import dayjs from "dayjs";
import { getSimpleRelativeTimeFromDate } from "@/utils/dates";
import { mapProposalChoice } from "@/plugins/snapshot-voting/services/snapshot/utils";

export type ProposalDetail = IProposal & {
  result: IBreakdownMajorityVotingResult;
  details: IVotingStageDetails;
};

/**
 * Transforms a proposal object into a more detailed structure, including formatted dates. It adds formatted
 * creation and end dates to the proposal details, applying relative time formatting where appropriate.
 *
 * @param proposal - The proposal object to be transformed.
 * @returns the transformed proposal object.
 */
export async function toProposalDetails(proposal: IProposal | null): Promise<ProposalDetail | undefined> {
  if (!proposal) return;

  // parse dates
  const parsedEndDate = dayjs(proposal.endDate);
  const parsedStartDate = dayjs(proposal.startDate);
  const parsedCreatedAt = dayjs(proposal.createdAt);

  const createdAt = parsedCreatedAt.format("MMMM D, YYYY") ?? "";
  const endDate = getSimpleRelativeTimeFromDate(parsedEndDate) ?? "";

  const details = {
    startDate: parsedStartDate.format("MMMM D, YYYY h:mm A") ?? "",
    endDate: parsedEndDate.format("MMMM D, YYYY h:mm A") ?? "",
    strategy: "1 Token → 1 Vote",
    censusBlock: Number(proposal.snapshotBlock),
    options: formatChoices(proposal.choices),
  };

  return {
    ...proposal,
    createdAt,
    endDate,
    startDate: parsedStartDate.format(),
    details,
    result: mapResults(proposal),
  };
}

function mapResults(proposal: IProposal): IBreakdownMajorityVotingResult {
  if (proposal.scores.length > 0) {
    return {
      proposalId: proposal.id,
      votingScores: proposal.scores.map((s) => ({
        option: mapProposalChoice(s.choice),
        voteAmount:
          formatterUtils.formatNumber(s.votes.toString(), {
            format: NumberFormat.TOKEN_AMOUNT_SHORT,
          }) ?? "0",
        votePercentage: Number((s.percentage ?? 0).toFixed(2)),
        tokenSymbol: PUB_TOKEN_SYMBOL,
      })),
    };
  } else {
    return {
      proposalId: proposal.id,
      votingScores: proposal.choices.map((c) => ({
        option: mapProposalChoice(c),
        voteAmount: "0",
        votePercentage: 0,
        tokenSymbol: PUB_TOKEN_SYMBOL,
      })),
    };
  }
}

/**
 * Formats an array of voting choices into a readable string.
 * @param choices - The array of voting choices.
 * @returns the formatted string of choices.
 */
function formatChoices(choices: string[]) {
  const parsedChoices = choices.map((choice) => capitalizeFirstLetter(mapProposalChoice(choice)));
  return parsedChoices.length > 1
    ? `${parsedChoices.slice(0, -1).join(", ")} or ${parsedChoices[parsedChoices.length - 1]}`
    : parsedChoices[0] || "";
}
