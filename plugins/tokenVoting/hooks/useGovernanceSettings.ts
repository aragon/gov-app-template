import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { TokenVotingPluginAbi } from "../artifacts/TokenVoting.sol";

export function useGovernanceSettings() {
  const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
  const [minDuration, setMinDuration] = useState<bigint>(); // in seconds
  const [minParticipation, setMinParticipation] = useState<number>();
  const [supportThreshold, setSupportThreshold] = useState<number>();

  const {
    data: contractReads,
    isLoading,
    error,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
        abi: TokenVotingPluginAbi,
        functionName: "minDuration",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
        abi: TokenVotingPluginAbi,
        functionName: "minParticipation",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
        abi: TokenVotingPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
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
  }, [contractReads?.[0]?.status, contractReads?.[1]?.status, contractReads?.[2]?.status, contractReads?.[3]?.status]);

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
