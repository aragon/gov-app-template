import { type Address } from "viem";

export enum Token {
  TOKEN_1,
  TOKEN_2,
}

export type Gauge = {
  gauge: Address;
  weight: bigint;
};

export enum Contract {
  ESCROW_CONTRACT,
  TOKEN_CONTRACT,
  VOTER_CONTRACT,
  CURVE_CONTRACT,
  CLOCK_CONTRACT,
  EXIT_QUEUE_CONTRACT,
}
