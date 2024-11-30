import { useState } from "react";
import { useReadContract } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";
import { useRouter } from "next/router";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useTransactionManager } from "@/hooks/useTransactionManager";
import { useChainIdTypesafe } from "@/utils/chains";

export function useProposalExecute(index: number) {
  const { reload } = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);
  const chainId = useChainIdTypesafe();

  const {
    data: canExecute,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
    abi: OptimisticTokenVotingPluginAbi,
    chainId,
    functionName: "canExecute",
    args: [index ? BigInt(index) : BigInt("0")],
  });

  const { writeContract, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Proposal executed",
    onSuccess() {
      setTimeout(() => reload(), 1000 * 2);
    },
    onErrorMessage: "Could not execute the proposal",
    onErrorDescription: "The proposal may contain actions with invalid operations",
    onError() {
      setIsExecuting(false);
    },
  });

  const executeProposal = () => {
    if (!canExecute) return;
    else if (typeof index === "undefined") return;

    setIsExecuting(true);

    writeContract({
      chainId,
      abi: OptimisticTokenVotingPluginAbi,
      address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
      functionName: "execute",
      args: [BigInt(index)],
    });
  };

  return {
    executeProposal,
    canExecute: !isCanVoteError && !isCanVoteLoading && !isConfirmed && !!canExecute,
    isConfirming: isExecuting || isConfirming,
    isConfirmed,
  };
}
