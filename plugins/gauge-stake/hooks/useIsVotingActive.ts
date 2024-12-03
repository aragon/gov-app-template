import { ClockAbi } from "@/artifacts/Clock.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "./useGetContract";

export function useIsVotingActive(token: Token) {
  const { data: contracts } = useGetContracts(token);

  const clockContract = contracts?.clockContract.result;

  const {
    data: isVotingActive,
    isLoading,
    queryKey,
  } = useReadContract({
    address: clockContract,
    abi: ClockAbi,
    functionName: "votingActive",
    args: [],
  });

  return {
    isVotingActive,
    isLoading,
    queryKey,
  };
}
