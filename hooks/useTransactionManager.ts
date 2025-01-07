import { useEffect } from "react";
import { useAlerts } from "@/context/Alerts";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export type TxLifecycleParams = {
  onSuccessMessage?: string;
  onSuccessDescription?: string;
  onSuccess?: () => any;
  onErrorMessage?: string;
  onErrorDescription?: string;
  onError?: () => any;
};

export function useTransactionManager(params: TxLifecycleParams) {
  const { onSuccess, onError } = params;
  const { writeContract, data: hash, error, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (status === "idle" || status === "pending") {
      return;
    } else if (status === "error") {
      if (error?.message?.startsWith("User rejected the request")) {
        addAlert("The transaction signature was declined", {
          description: "Nothing has been sent to the network",
          timeout: 4 * 1000,
        });
      } else {
        console.error(error);
        let description = "The proposal may contain actions with invalid operations";
        if (error?.toString()) {
          const found = error.toString().match(/ror: ActionFailed\(uint256 index\)\n\s+\(([0-9]+)\)/);
          if (found && found[1] && typeof parseInt(found[1]) === "number") {
            description = `Action ${parseInt(found[1]) + 1} failed to complete successfully`;
          }
        }
        addAlert(params.onErrorMessage || "Could not fulfill the transaction", {
          type: "error",
          description,
        });
      }

      if (typeof onError === "function") {
        onError();
      }
      return;
    }

    // TX submitted
    if (!hash) {
      return;
    } else if (isConfirming) {
      addAlert("Transaction submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: hash,
      });
      return;
    } else if (!isConfirmed) {
      return;
    }

    addAlert(params.onSuccessMessage || "Transaction fulfilled", {
      description: params.onSuccessDescription || "The transaction has been validated on the network",
      type: "success",
      txHash: hash,
    });

    if (typeof onSuccess === "function") {
      onSuccess();
    }
  }, [status, hash, isConfirming, isConfirmed]);

  return { writeContract, hash, status, isConfirming, isConfirmed };
}
