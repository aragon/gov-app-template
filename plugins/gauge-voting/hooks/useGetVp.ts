import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";

export function useGetVp(token: Token, tokenId: bigint) {
  const escrowContract = getEscrowContract(token);

  const {
    data: vp,
    isLoading,
    queryKey,
  } = useReadContract({
    address: escrowContract,
    abi: VotingEscrowAbi,
    functionName: "votingPower",
    args: [tokenId],
  });

  return {
    vp,
    isLoading,
    queryKey,
  };
}
