import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/optimistic-proposals/artifacts/OptimisticTokenVotingPlugin.sol";
import { useEffect } from "react";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useChainIdTypesafe } from "@/utils/chains";

export function useUserCanVeto(proposalId?: bigint) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const chainId = useChainIdTypesafe();

  const { data: canVeto, refetch } = useReadContract({
    chainId,
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "canVeto",
    args: [proposalId ?? BigInt(0), address!],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (Number(blockNumber) % 2 === 0) {
      refetch();
    }
  }, [blockNumber, chainId]);

  return { canVeto, refetch };
}
