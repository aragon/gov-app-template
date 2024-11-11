import { Address } from "viem";
import { IProposalResource, RawAction } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export enum VotingMode {
  Standard,
  EarlyExecution,
  VoteReplacement,
}

export type ProposalParameters = {
  supportThreshold: number;
  startDate: bigint;
  endDate: bigint;
  snapshotEpoch: bigint;
  minVotingPower: bigint;
};

export type Tally = {
  abstain: bigint;
  yes: bigint;
  no: bigint;
};

export type Proposal = {
  active: boolean;
  executed: boolean;
  parameters: ProposalParameters;
  tally: Tally;
  actions: RawAction[];
  allowFailureMap: bigint;
  creator: string;
  title: string;
  summary: string;
  description: string;
  resources: IProposalResource[];
};

export type VoteCastEvent = {
  voter?: Address;
  proposalId?: bigint;
  voteOption?: number;
  votingPower?: bigint;
};
