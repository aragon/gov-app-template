import { SimpleGaugeVotingAbi } from "@/artifacts/SimpleGaugeVoting.sol";
import { useReadContract } from "wagmi";
import { type Token } from "../types/tokens";
import { useGetContracts } from "./useGetContract";

export function useGetTotalVpCast(token: Token) {
  const { data } = useGetContracts(token);

  const voterContract = data?.voterContract.result;

  return useReadContract({
    abi: SimpleGaugeVotingAbi,
    address: voterContract,
    functionName: "totalVotingPowerCast",
    args: [],
    query: {
      enabled: !!voterContract,
    },
  });
}
