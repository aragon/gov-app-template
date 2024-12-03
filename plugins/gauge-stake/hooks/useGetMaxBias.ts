import { QuadraticIncreasingEscrowAbi } from "@/artifacts/QuadraticIncreasingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetMaxBias(token: Token) {
  const { data } = useGetContracts(token);

  const curveContract = data?.curveContract.result;

  const { data: maxBias, isLoading } = useReadContract({
    address: curveContract,
    abi: QuadraticIncreasingEscrowAbi,
    functionName: "previewMaxBias",
    args: [10n ** 18n],
    query: {
      enabled: !!curveContract,
    },
  });

  return {
    maxBias,
    isLoading,
  };
}
