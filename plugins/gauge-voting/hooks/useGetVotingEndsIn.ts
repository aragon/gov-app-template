import { ClockAbi } from "@/artifacts/Clock.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetVotingEndsIn(token: Token, timestamp: bigint) {
  const { data } = useGetContracts(token);

  const clockContract = data?.clockContract.result;

  const {
    data: votingEndsIn,
    isLoading,
    queryKey,
  } = useReadContract({
    address: clockContract,
    abi: ClockAbi,
    functionName: "resolveEpochVoteEndsIn",
    args: [timestamp],
    query: {
      enabled: !!clockContract,
    },
  });

  return {
    votingEndsIn,
    isLoading,
    queryKey,
  };
}
