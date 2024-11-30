import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useReadContracts } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";
import { useEffect, useState } from "react";
import { useChainIdTypesafe } from "@/utils/chains";

export function useGovernanceSettings() {
  const [minVetoRatio, setMinVetoRatio] = useState<number>();
  const [minDuration, setMinDuration] = useState<bigint>();
  const chainId = useChainIdTypesafe();

  const {
    data: contractReads,
    isLoading,
    error,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        chainId,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "minDuration",
      },
      {
        chainId,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
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
  }, [contractReads?.[0]?.result, contractReads?.[1]?.result]);

  return {
    minDuration,
    minVetoRatio,
    isLoading,
    error,
    refetch,
  };
}
