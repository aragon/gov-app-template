import { ExitQueueAbi } from "@/artifacts/ExitQueue.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "../hooks/useGetContract";

export function useCanExit(token: Token, tokenId: bigint) {
  const { data } = useGetContracts(token);

  const queueContract = data?.queueContract.result;

  return useReadContract({
    address: queueContract,
    abi: ExitQueueAbi,
    functionName: "canExit",
    args: [tokenId],
    query: {
      enabled: !!queueContract,
    },
  });
}
