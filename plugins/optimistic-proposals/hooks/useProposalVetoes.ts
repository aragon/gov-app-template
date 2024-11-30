import { useState, useEffect } from "react";
import { getAbiItem } from "viem";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/optimistic-proposals/artifacts/OptimisticTokenVotingPlugin.sol";
import { VetoCastEvent } from "@/plugins/optimistic-proposals/utils/types";
import { usePublicClient } from "wagmi";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useChainIdTypesafe } from "@/utils/chains";

const event = getAbiItem({
  abi: OptimisticTokenVotingPluginAbi,
  name: "VetoCast",
});

export function useProposalVetoes(proposalId?: bigint) {
  const publicClient = usePublicClient();
  const [proposalLogs, setLogs] = useState<VetoCastEvent[]>([]);
  const chainId = useChainIdTypesafe();

  useEffect(() => {
    if (proposalId === undefined || !publicClient) return;

    publicClient
      .getLogs({
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
        event: event,
        args: {
          proposalId,
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      })
      .then((logs) => {
        const newLogs = logs.flatMap((log) => log.args as VetoCastEvent);
        if (newLogs.length > proposalLogs.length) setLogs(newLogs);
      });
  }, [proposalId, chainId]);

  return proposalLogs;
}
