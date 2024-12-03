import { useState } from "react";
import { SimpleGaugeVotingAbi } from "@/artifacts/SimpleGaugeVoting.sol";
import { useForceChain } from "@/hooks/useForceChain";
import { type Gauge, type Token } from "../types/tokens";
import { useGetContracts } from "./useGetContract";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useVote(
  token: Token,
  tokenIds: bigint[],
  gauges: Gauge[],
  onSuccess?: () => void,
  onError?: () => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, isConfirming } = useTransactionManager({
    onSuccessMessage: "Voted successfully",
    onSuccessDescription: "The transaction has been validated",
    onDeclineMessage: "Vote declined",
    onDeclineDescription: "The transaction has been declined",
    onErrorMessage: "Could not vote",
    onErrorDescription: "The transaction could not be completed",
    onSuccess() {
      setIsLoading(false);
      onSuccess?.();
    },
    onError() {
      setIsLoading(false);
      onError?.();
    },
  });

  const { forceChain } = useForceChain();
  const { data } = useGetContracts(token);

  const voterContract = data?.voterContract.result;

  const vote = async () => {
    setIsLoading(true);

    try {
      await forceChain();
      if (!voterContract || !tokenIds.length || !gauges.length) return onSuccess?.();
      writeContract({
        abi: SimpleGaugeVotingAbi,
        address: voterContract,
        functionName: "voteMultiple",
        args: [tokenIds, gauges.filter((gauge) => gauge.weight > 0)],
      });
    } catch (err) {
      setIsLoading(false);
      onError?.();
    }
  };

  return {
    vote,
    isConfirming: isLoading || isConfirming,
  };
}
