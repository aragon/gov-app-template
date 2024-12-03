import { PUB_CHAIN, PUB_VOTING_ESCROW_ADDRESS } from "@/constants";
import { useReadContract } from "wagmi";
import { VotingEscrowAbi } from "../artifacts/VotingEscrow.sol";
import { type Address } from "viem";

/**
 * Get the total voting power for an account
 * @returns Total voting power for an account
 */
export const useUserVotingPower = (account: string | undefined) => {
  return useReadContract({
    chainId: PUB_CHAIN.id,
    abi: VotingEscrowAbi,
    address: PUB_VOTING_ESCROW_ADDRESS,
    functionName: "votingPowerForAccount",
    args: [account as Address],
    query: { enabled: !!account },
  });
};
