import { useState } from "react";
import { useReadContract } from "wagmi";
import { TokenVotingPluginAbi } from "../artifacts/TokenVoting.sol";
import { useRouter } from "next/router";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useTransactionManager } from "@/hooks/useTransactionManager";
import { useChainIdTypesafe } from "@/utils/chains";

export function useProposalExecute(proposalId: number) {
  const { reload } = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);
  const chainId = useChainIdTypesafe();

  const {
    data: canExecute,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
    abi: TokenVotingPluginAbi,
    chainId,
    functionName: "canExecute",
    args: [BigInt(proposalId)],
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
    else if (typeof proposalId === "undefined") return;

    setIsExecuting(true);

    writeContract({
      chainId,
      abi: TokenVotingPluginAbi,
      address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
      functionName: "execute",
      args: [BigInt(proposalId)],
    });
  };

  return {
    executeProposal,
    canExecute: !isCanVoteError && !isCanVoteLoading && !isConfirmed && !!canExecute,
    isConfirming: isExecuting || isConfirming,
    isConfirmed,
  };
}
