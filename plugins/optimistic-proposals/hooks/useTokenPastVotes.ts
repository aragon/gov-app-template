import { useConfig } from "wagmi";
import { PUB_TOKEN_ADDRESS } from "@/constants";
import { Erc20VotesAbi } from "../artifacts/ERC20Votes";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";

export function useTokenPastVotes(holderAddress?: Address, epoch?: bigint) {
  const config = useConfig();
  const {
    data: votes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-past-votes", PUB_TOKEN_ADDRESS, holderAddress, epoch?.toString()],
    queryFn: () => {
      return readContract(config, {
        abi: Erc20VotesAbi,
        address: PUB_TOKEN_ADDRESS,
        functionName: "getPastVotes",
        args: [holderAddress!, epoch!],
      });
    },
    retry: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    enabled: !!holderAddress && !!epoch,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return {
    votes: votes || BigInt("0"),
    status: {
      isLoading: isLoading,
      isError: isError,
    },
  };
}
