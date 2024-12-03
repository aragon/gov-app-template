export enum Token {
  TOKEN_1,
  TOKEN_2,
}

export const StakingToken = {
  name: "Puffer",
  symbol: "PUFFER",
  logo: "/logo-color.png",
} as const;

export const veToken = {
  name: "vePuffer",
  symbol: "vePUFFER",
} as const;

export const RewardToken = {
  name: "Puffer Points",
  symbol: "FISHY",
} as const;

export enum Contract {
  ESCROW_CONTRACT,
  TOKEN_CONTRACT,
  VOTER_CONTRACT,
  CURVE_CONTRACT,
  CLOCK_CONTRACT,
  EXIT_QUEUE_CONTRACT,
}
