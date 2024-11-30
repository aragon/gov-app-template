import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { TokenVotingPluginAbi } from "../artifacts/TokenVoting.sol";
import { useChainIdTypesafe } from "@/utils/chains";

export function useGovernanceSettings() {
  const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
  const [minDuration, setMinDuration] = useState<bigint>(); // in seconds
  const [minParticipation, setMinParticipation] = useState<number>();
  const [supportThreshold, setSupportThreshold] = useState<number>();
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
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
        abi: TokenVotingPluginAbi,
        functionName: "minDuration",
      },
      {
        chainId,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
        abi: TokenVotingPluginAbi,
        functionName: "minParticipation",
      },
      {
        chainId,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
        abi: TokenVotingPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
        abi: TokenVotingPluginAbi,
        functionName: "supportThreshold",
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
    setMinParticipation(contractReads[1].result);
    setMinProposerVotingPower(contractReads[2].result);
    setSupportThreshold(contractReads[3].result);
  }, [contractReads?.[0]?.result, contractReads?.[1]?.result, contractReads?.[2]?.result, contractReads?.[3]?.result]);

  return {
    minDuration,
    minProposerVotingPower,
    supportThreshold,
    minParticipation,
    isLoading,
    error,
    refetch,
  };
}
