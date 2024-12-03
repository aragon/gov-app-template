import { useState } from "react";
import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useForceChain } from "@/hooks/useForceChain";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useWithdraw(token: Token, tokenId: bigint, onSuccess?: () => void, onError?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, isConfirming } = useTransactionManager({
    onSuccessMessage: "Withdrawal successfully",
    onSuccessDescription: "The transaction has been validated",
    onDeclineMessage: "Withdrawal declined",
    onDeclineDescription: "The transaction has been declined",
    onErrorMessage: "Could not withdraw",
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
  const escrowContract = getEscrowContract(token);

  const withdraw = async () => {
    setIsLoading(true);

    try {
      await forceChain();

      writeContract({
        abi: VotingEscrowAbi,
        address: escrowContract,
        functionName: "withdraw",
        args: [tokenId],
      });
    } catch (err) {
      setIsLoading(false);
      onError?.();
    }
  };

  return {
    withdraw,
    isConfirming: isLoading || isConfirming,
  };
}
