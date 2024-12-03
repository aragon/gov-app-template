import { type IFetchPaginatedParams } from "@/utils/types";

export interface IFetchVotesParams extends IFetchPaginatedParams {
  proposalId: string;
  space: string;
  voter?: string;
}

export type IFetchVotedParams = { proposalId: string; voter: string; space: string };

export type IFetchVotingPowerParams = { proposalId: string; voter: string; space: string };
