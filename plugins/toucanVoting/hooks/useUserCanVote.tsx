import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { useEffect } from "react";
import { PUB_TOUCAN_VOTING_PLUGIN_ADDRESS } from "@/constants";

export function useUserCanVote(proposalId: bigint) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "canVote",
    args: [proposalId, address!, { abstain: 0n, yes: 0n, no: 0n }],
    query: { enabled: !!address },
  });

  useEffect(() => {
    refreshCanVote();
  }, [blockNumber]);

  return canVote;
}