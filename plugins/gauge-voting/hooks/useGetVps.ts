import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";
import { useReadContracts } from "wagmi";

export function useGetVps(token: Token, tokenIds: bigint[]) {
  const escrowContract = getEscrowContract(token);

  return useReadContracts({
    contracts: tokenIds.map((tokenId) => ({
      abi: VotingEscrowAbi,
      address: escrowContract,
      functionName: "votingPower",
      args: [tokenId],
    })),
    query: {
      select: (results) =>
        tokenIds.filter((_, i) => {
          return !!results[i].result && results[i].result !== 0n;
        }),
    },
  });
}
