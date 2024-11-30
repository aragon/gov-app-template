import { PUB_TOKEN_ADDRESS } from "@/constants";
import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { useChainIdTypesafe } from "@/utils/chains";

const erc20Votes = parseAbi(["function getPastTotalSupply(uint256 blockNumber) view returns (uint256)"]);

export function usePastSupply(epoch: bigint | undefined) {
  const chainId = useChainIdTypesafe();

  const { data: pastSupply } = useReadContract({
    address: PUB_TOKEN_ADDRESS[chainId],
    chainId,
    abi: erc20Votes,
    functionName: "getPastTotalSupply",
    args: [BigInt(epoch || 0)],
  });

  return pastSupply || BigInt(0);
}
