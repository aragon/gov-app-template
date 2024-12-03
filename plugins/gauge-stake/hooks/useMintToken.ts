import { useState } from "react";
import { useAccount } from "wagmi";
import { useForceChain } from "@/hooks/useForceChain";
import { type Token } from "../types/tokens";
import { getTokenContract } from "./useGetContract";
import { PUB_CHAIN } from "@/constants";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useMintToken(token: Token, onSuccess?: () => void, onError?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();
  const { forceChain } = useForceChain();
  const tokenContract = getTokenContract(token);

  const { writeContract, isConfirming } = useTransactionManager({
    onSuccessMessage: "Minted successfully",
    onSuccessDescription: "The transaction has been validated",
    onDeclineMessage: "Mint declined",
    onDeclineDescription: "The transaction has been declined",
    onErrorMessage: "Could not mint",
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

  const mintToken = async (amount: bigint) => {
    setIsLoading(true);

    try {
      if (!address) return;

      await forceChain();
      writeContract({
        chain: PUB_CHAIN,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        address: tokenContract,
        functionName: "mint",
        args: [address, amount],
      });
    } catch (err) {
      setIsLoading(false);
      onError?.();
    }
  };

  return {
    mintToken,
    isConfirming: isLoading || isConfirming,
  };
}
