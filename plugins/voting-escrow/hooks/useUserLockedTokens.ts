import { PUB_VOTING_ESCROW_ADDRESS } from "@/constants";
import { config } from "@/context/Web3Modal";
import { useQueries } from "@tanstack/react-query";
import { type Address } from "viem";
import { useReadContract } from "wagmi";
import { readContractQueryOptions } from "wagmi/query";
import { VotingEscrowAbi } from "../artifacts/VotingEscrow.sol";
import { useMemo } from "react";

export interface IUseUserLockedTokensParams {
  account: Address | undefined;
  blockNumber?: bigint;
}

export const useUserLockedTokens = (params: IUseUserLockedTokensParams) => {
  const { data: ownedTokens, isLoading: ownedTokensLoading } = useReadContract({
    abi: VotingEscrowAbi,
    address: PUB_VOTING_ESCROW_ADDRESS,
    functionName: "ownedTokens",
    blockNumber: params.blockNumber,
    args: [params.account!],
    query: { enabled: !!params.account },
  });

  const lockedVpQueries = useQueries({
    queries: ownedTokens
      ? ownedTokens.map((id) => {
          return readContractQueryOptions(config, {
            abi: VotingEscrowAbi,
            address: PUB_VOTING_ESCROW_ADDRESS,
            functionName: "locked",
            args: [id],
            blockNumber: params.blockNumber,
          });
        })
      : [],
  });

  const isLoading = ownedTokensLoading || lockedVpQueries.some((q) => q.isLoading);
  const isFetched = !lockedVpQueries.some((q) => q.data == null && q.isFetched === false);

  const lockedVp = isFetched
    ? lockedVpQueries.reduce((prev, current) => {
        return (prev += current.data?.amount ?? 0n);
      }, 0n)
    : undefined;

  const value = useMemo(() => ({ data: lockedVp, isLoading, isFetched }), [isFetched, isLoading, lockedVp]);

  return value;
};
