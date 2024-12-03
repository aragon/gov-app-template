import { PUB_CHAIN, PUB_VOTING_ESCROW_ADDRESS } from "@/constants";
import { useReadContract } from "wagmi";
import { VotingEscrowAbi } from "../artifacts/VotingEscrow.sol";

export const useTotalVotingPower = () => {
  return useReadContract({
    chainId: PUB_CHAIN.id,
    abi: VotingEscrowAbi,
    address: PUB_VOTING_ESCROW_ADDRESS,
    functionName: "totalVotingPower",
  });
};
