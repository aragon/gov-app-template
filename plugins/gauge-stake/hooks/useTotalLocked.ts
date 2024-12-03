import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";

export function useTotalLocked(token: Token) {
  const escrowContract = getEscrowContract(token);

  const {
    data: totalLocked,
    isLoading,
    queryKey,
  } = useReadContract({
    address: escrowContract,
    abi: VotingEscrowAbi,
    functionName: "totalLocked",
    args: [],
  });

  return {
    totalLocked,
    isLoading,
    queryKey,
  };
}
