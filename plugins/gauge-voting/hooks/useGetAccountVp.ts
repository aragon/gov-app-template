import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useAccount, useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";

export function useGetAccountVp(token: Token) {
  const { address } = useAccount();
  const escrowContract = getEscrowContract(token);

  const { data: vp, isLoading } = useReadContract({
    address: escrowContract,
    abi: VotingEscrowAbi,
    functionName: "votingPowerForAccount",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  return {
    vp,
    isLoading,
  };
}
