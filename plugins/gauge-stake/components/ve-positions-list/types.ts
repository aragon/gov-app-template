import { type Token } from "../../types/tokens";

export type VeTokenItem = {
  id: bigint;
  token: Token;
};

export type VeTokenInfo = {
  id: bigint;
  token: Token;
  amount: bigint;
  created: Date;
};
