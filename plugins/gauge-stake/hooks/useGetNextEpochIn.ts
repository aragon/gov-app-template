import { ClockAbi } from "@/artifacts/Clock.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetNextEpochIn(token: Token, timestamp: bigint) {
  const { data } = useGetContracts(token);

  const clockContract = data?.clockContract.result;

  return useReadContract({
    address: clockContract,
    abi: ClockAbi,
    functionName: "resolveEpochNextCheckpointIn",
    args: [timestamp],
    query: {
      enabled: !!clockContract,
    },
  });
}
