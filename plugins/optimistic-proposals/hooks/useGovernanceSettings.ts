import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useReadContracts } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";
import { useEffect, useState } from "react";

// TODO can we remove this?
export function useGovernanceSettings() {
  const [minVetoRatio, setMinVetoRatio] = useState<number>();
  const [minDuration, setMinDuration] = useState<bigint>();

  const {
    data: contractReads,
    isLoading,
    error,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "minDuration",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "minVetoRatio",
      },
    ],
    query: {
      staleTime: 1000 * 60 * 60,
      retry: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: true,
    },
  });

  useEffect(() => {
    if (!contractReads?.length || contractReads?.length < 2) {
      return;
    }

    setMinDuration(contractReads[0].result);
    setMinVetoRatio(contractReads[1].result);
  }, [contractReads?.[0]?.status, contractReads?.[1]?.status]);

  return {
    minDuration,
    minVetoRatio,
    isLoading,
    error,
    refetch,
  };
}
