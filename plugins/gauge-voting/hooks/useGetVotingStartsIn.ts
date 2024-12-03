import { ClockAbi } from "@/artifacts/Clock.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetVotingStartsIn(token: Token, timestamp: bigint) {
  const { data } = useGetContracts(token);

  const clockContract = data?.clockContract.result;

  const {
    data: votingStartsIn,
    isLoading,
    queryKey,
  } = useReadContract({
    address: clockContract,
    abi: ClockAbi,
    functionName: "resolveEpochVoteStartsIn",
    args: [timestamp],
    query: {
      enabled: !!clockContract,
    },
  });

  return {
    votingStartsIn,
    isLoading,
    queryKey,
  };
}
