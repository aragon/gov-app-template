import { type Address } from "viem";

export const TOKEN_1_NAME = process.env.NEXT_PUBLIC_TOKEN_1_NAME ?? "TOKEN_1";
export const TOKEN_1_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_1_CONTRACT ?? "") as Address;
export const TOKEN_1_ESCROW_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_1_ESCROW_CONTRACT ?? "") as Address;

export const TOKEN_2_NAME = process.env.NEXT_PUBLIC_TOKEN_2_NAME ?? "TOKEN_2";
export const TOKEN_2_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_2_CONTRACT ?? "") as Address;
export const TOKEN_2_ESCROW_CONTRACT = (process.env.NEXT_PUBLIC_TOKEN_2_ESCROW_CONTRACT ?? "") as Address;

export const PUB_STAKING_LEARN_MORE_URL = process.env.NEXT_PUBLIC_STAKING_LEARN_MORE_URL ?? "";
