import { QuadraticIncreasingEscrowAbi } from "@/artifacts/QuadraticIncreasingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetCoefficients(token: Token) {
  const { data } = useGetContracts(token);

  const curveContract = data?.curveContract.result;

  const { data: coefficients, isLoading } = useReadContract({
    address: curveContract,
    abi: QuadraticIncreasingEscrowAbi,
    functionName: "getCoefficients",
    args: [10n ** 18n],
    query: {
      enabled: !!curveContract,
    },
  });

  return {
    coefficients,
    isLoading,
  };
}
