import { useState } from "react";
import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useForceChain } from "@/hooks/useForceChain";
import { useIsVoting } from "./useIsVoting";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useBeginWithdrawal(token: Token, tokenId: bigint, onSuccess?: () => void, onError?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, isConfirming } = useTransactionManager({
    onSuccessMessage: "Started withdrawal successfully",
    onSuccessDescription: "The transaction has been validated",
    onDeclineMessage: "Start withdrawal declined",
    onDeclineDescription: "The transaction has been declined",
    onErrorMessage: "Could not start withdrawal",
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
  const { isVoting } = useIsVoting(token, tokenId);
  const escrowContract = getEscrowContract(token);

  const beginWithdrawal = async () => {
    setIsLoading(true);

    try {
      await forceChain();

      writeContract({
        abi: VotingEscrowAbi,
        address: escrowContract,
        functionName: isVoting ? "resetVotesAndBeginWithdrawal" : "beginWithdrawal",
        args: [tokenId],
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      onError?.();
    }
  };

  return {
    beginWithdrawal,
    isConfirming: isLoading || isConfirming,
  };
}
