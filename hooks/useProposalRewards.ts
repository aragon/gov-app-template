import { PWN_TOKEN_ABI } from "@/artifacts/PWN.sol";
import { PUB_PWN_TOKEN_ADDRESS } from "@/constants";
import { useChainIdTypesafe } from "@/utils/chains";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useProposalRewards(votingContract: Address, proposalId: bigint) {
  const chainId = useChainIdTypesafe();

  const { isLoading, data: proposalRewardsResult } = useReadContract({
    abi: PWN_TOKEN_ABI,
    address: PUB_PWN_TOKEN_ADDRESS[chainId],
    functionName: "proposalRewards",
    args: [votingContract, proposalId],
    chainId,
  });

  return {
    isLoading,
    proposalRewardsResult,
  };
}
