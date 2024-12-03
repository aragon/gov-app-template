import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useForceChain } from "@/hooks/useForceChain";
import { type Token } from "../types/tokens";
import { getEscrowContract } from "./useGetContract";
import { PUB_CHAIN } from "@/constants";
import { useState } from "react";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useStakeToken(amount: bigint, token: Token, onSuccess?: () => void, onError?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const { forceChain } = useForceChain();
  const escrowContract = getEscrowContract(token);

  const { writeContract, isConfirming: isConfirming } = useTransactionManager({
    onSuccessMessage: "Staked successfully",
    onSuccessDescription: "The transaction has been validated",
    onDeclineMessage: "Stake declined",
    onDeclineDescription: "The transaction has been declined",
    onErrorMessage: "Could not stake",
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

  const stakeToken = async () => {
    setIsLoading(true);

    try {
      await forceChain();
      if (!amount) throw new Error("Amount is required");
      writeContract({
        chain: PUB_CHAIN,
        abi: VotingEscrowAbi,
        address: escrowContract,
        functionName: "createLock",
        args: [amount],
      });
    } catch (err) {
      setIsLoading(false);
      onError?.();
    }
  };

  return {
    stakeToken,
    isConfirming: isLoading || isConfirming,
  };
}
