import { PWN_TOKEN_ABI } from "@/artifacts/PWN.sol";
import { PUB_PWN_TOKEN_ADDRESS } from "@/constants";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useProposalRewards(votingContract: Address, proposalId: bigint) {
  const { isLoading, data: proposalRewardsResult } = useReadContract({
    abi: PWN_TOKEN_ABI,
    address: PUB_PWN_TOKEN_ADDRESS,
    functionName: "proposalRewards",
    args: [votingContract, proposalId],
  });

  console.log("proposalrewards");
  console.log(proposalRewardsResult);

  return {
    isLoading,
    proposalRewardsResult,
  };
}
