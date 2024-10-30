import type { Address } from "viem";
import type { IProposalResource, RawAction } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export type OptimisticProposalResultType = readonly [
  boolean,
  boolean,
  boolean,
  OptimisticProposalParameters,
  bigint,
  readonly RawAction[],
  bigint,
];

export type OptimisticProposalParameters = {
  snapshotEpoch: bigint;
  minVetoVotingPower: bigint;
  startDate: bigint;
  endDate: bigint;
};

export type OptimisticProposal = {
  index: number;
  active: boolean;
  executed: boolean;
  parameters: OptimisticProposalParameters;
  vetoTally: bigint;
  actions: RawAction[];
  allowFailureMap: bigint;
  creator: string;
  title: string;
  summary: string;
  description: string;
  resources: IProposalResource[];
};

export type VoteCastResponse = {
  args: VetoCastEvent[];
};

export type VetoCastEvent = {
  voter: Address;
  proposalId: bigint;
  votingPower: bigint;
};
