import { type Address } from "viem";

export const EPOCH_DURATION = 1000 * 60 * 60 * 24 * 7 * 2;

export const TOKEN_1_NAME = process.env.NEXT_PUBLIC_TOKEN_1_NAME ?? "TOKEN_1";
export const TOKEN_1_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_1_CONTRACT ?? "") as Address;
export const TOKEN_1_ESCROW_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_1_ESCROW_CONTRACT ?? "") as Address;

export const TOKEN_2_NAME = process.env.NEXT_PUBLIC_TOKEN_2_NAME ?? "TOKEN_2";
export const TOKEN_2_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_2_CONTRACT ?? "") as Address;
export const TOKEN_2_ESCROW_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_2_ESCROW_CONTRACT ?? "") as Address;

export const PUB_GET_MORE_TOKEN_1_URL = process.env.NEXT_PUBLIC_GET_MORE_TOKEN_1_URL ?? "";
export const PUB_GET_MORE_TOKEN_2_URL = process.env.NEXT_PUBLIC_GET_MORE_TOKEN_2_URL ?? "";
export const PUB_GET_MORE_BOTH_URL = process.env.NEXT_PUBLIC_GET_MORE_BOTH_URL ?? "";
export const PUB_GET_REWARDS_URL = process.env.NEXT_PUBLIC_GET_REWARDS_URL ?? "";

export const PUB_STAKING_LEARN_MORE_URL = process.env.NEXT_PUBLIC_STAKING_LEARN_MORE_URL ?? "";
export const PUB_VE_TOKENS_LEARN_MORE_URL = process.env.NEXT_PUBLIC_VE_TOKENS_LEARN_MORE_URL ?? "";
