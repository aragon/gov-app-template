import { QuadraticIncreasingEscrowAbi } from "@/artifacts/QuadraticIncreasingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useGetPoint(token: Token, tokenId: bigint, period: bigint) {
  const { data } = useGetContracts(token);

  const curveContract = data?.curveContract.result;

  const { data: point, isLoading } = useReadContract({
    address: curveContract,
    abi: QuadraticIncreasingEscrowAbi,
    functionName: "tokenPointHistory",
    args: [tokenId, period],
    query: {
      enabled: !!curveContract,
    },
  });

  return {
    point,
    isLoading,
  };
}
