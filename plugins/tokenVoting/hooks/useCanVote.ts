import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { TokenVotingPluginAbi } from "../artifacts/TokenVoting.sol";
import { useEffect } from "react";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useChainIdTypesafe } from "@/utils/chains";

export function useCanVote(proposalId: number) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const chainId = useChainIdTypesafe();

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
    chainId,
    abi: TokenVotingPluginAbi,
    functionName: "canVote",
    args: [BigInt(proposalId), address!, 1],
    query: { enabled: !!address },
  });

  useEffect(() => {
    refreshCanVote();
  }, [blockNumber, chainId]);

  return canVote;
}
