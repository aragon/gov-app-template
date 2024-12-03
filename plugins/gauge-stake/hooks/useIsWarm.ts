import { QuadraticIncreasingEscrowAbi } from "@/artifacts/QuadraticIncreasingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useIsWarm(token: Token, tokenId: bigint) {
  const { data } = useGetContracts(token);

  const curveContract = data?.curveContract.result;

  const { data: isWarm, isLoading } = useReadContract({
    address: curveContract,
    abi: QuadraticIncreasingEscrowAbi,
    functionName: "isWarm",
    args: [tokenId],
    query: {
      enabled: !!curveContract,
    },
  });

  return {
    isWarm,
    isLoading,
  };
}
