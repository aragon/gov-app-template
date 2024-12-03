import { SimpleGaugeVotingAbi } from "@/artifacts/SimpleGaugeVoting.sol";
import { useReadContracts } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "./useGetContract";

export function useGetUsedVp(token: Token, tokenIds: bigint[]) {
  const { data } = useGetContracts(token);

  const voterContract = data?.voterContract.result;

  return useReadContracts({
    contracts: tokenIds.map((tokenId) => ({
      abi: SimpleGaugeVotingAbi,
      address: voterContract,
      functionName: "usedVotingPower",
      args: [tokenId],
    })),
    query: {
      enabled: !!voterContract,
      select: (results) =>
        results.reduce((acc, res) => {
          return acc + (res.result as bigint);
        }, 0n),
    },
  });
}
