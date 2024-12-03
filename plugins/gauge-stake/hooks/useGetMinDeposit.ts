import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";

export function useGetMinDeposit(token: Token) {
  const escrowContract = getEscrowContract(token);

  return useReadContract({
    address: escrowContract,
    abi: VotingEscrowAbi,
    functionName: "minDeposit",
    args: [],
  });
}
