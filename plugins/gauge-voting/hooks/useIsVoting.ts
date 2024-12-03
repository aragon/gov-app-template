import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";

export function useIsVoting(token: Token, tokenId: bigint) {
  const escrowContract = getEscrowContract(token);

  const {
    data: isVoting,
    isLoading,
    queryKey,
  } = useReadContract({
    address: escrowContract,
    abi: VotingEscrowAbi,
    functionName: "isVoting",
    args: [tokenId],
  });

  return {
    isVoting,
    isLoading,
    queryKey,
  };
}
