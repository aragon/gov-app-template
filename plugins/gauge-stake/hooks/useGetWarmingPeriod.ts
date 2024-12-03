import { QuadraticIncreasingEscrowAbi } from "@/artifacts/QuadraticIncreasingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetWarmingPeriod(token: Token) {
  const { data } = useGetContracts(token);

  const curveContract = data?.curveContract.result;

  return useReadContract({
    address: curveContract,
    abi: QuadraticIncreasingEscrowAbi,
    functionName: "warmupPeriod",
    args: [],
    query: {
      enabled: !!curveContract,
    },
  });
}
