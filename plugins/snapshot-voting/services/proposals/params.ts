import { type IFetchPaginatedParams } from "@/utils/types";
import { type Address } from "viem";

export interface IFetchProposalParams {
  proposalId: string;
}

export interface IFetchProposalListParams extends IFetchPaginatedParams {
  cached?: boolean;
}

export interface IFetchVotesParams extends IFetchPaginatedParams {
  proposalId: string;
}

export interface IFetchVotedParams {
  proposalId: string;
  address: Address;
}

export interface IFetchVotingPowerParams {
  proposalId: string;
  address: Address;
}
