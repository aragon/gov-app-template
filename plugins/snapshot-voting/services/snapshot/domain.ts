import { type IPublisher } from "@aragon/ods";
import { type IResource } from "@/utils/types";
import { type Address } from "viem";

export enum ProposalStatus {
  ACTIVE = "ACTIVE",
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export interface IProposal {
  id: string;
  title: string;
  description: string;
  body?: string;
  resources: IResource[];
  status: ProposalStatus;
  createdAt: string;
  startDate: string;
  endDate: string;
  publisher: IPublisher[];
  snapshotBlock: string;
  choices: string[];
  quorum: number;
  scores: VotingScores[];
  totalVotes: number;
}

export interface IProposalVote {
  id: string;
  address: string;
  vote: string;
  amount: string;
  timestamp: string;
  reason?: string;
}

export interface IVoted {
  address: Address;
  hasVoted: boolean;
  vote: IProposalVote;
}

export interface ICanVote {
  address: Address;
  canVote: boolean;
  vp: number;
}

export interface IVotingPower {
  address: Address;
  vp: number;
}

export type VotingScores = {
  choice: string;
  votes: number;
  percentage: number;
};
