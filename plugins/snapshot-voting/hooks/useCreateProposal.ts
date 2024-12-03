import { PUB_APP_NAME } from "@/constants";
import { PUB_SNAPSHOT_SPACE, PUB_SNAPSHOT_HUB_URL } from "../constants";

import { useAlerts } from "@/context/Alerts";
import { logger } from "@/services/logger";
import { Web3Provider, type ExternalProvider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useCreateProposal = (onSuccess?: (id?: string) => void) => {
  const { addAlert } = useAlerts();
  const { address, connector } = useAccount();

  const [error, setError] = useState<Error | null>(null);
  const [receipt, setReceipt] = useState<string>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      if (error?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", { type: "error", timeout: 4 * 1000 });
      } else {
        addAlert("Proposal creation failed", { type: "error" });
      }
      return;
    }

    if (receipt && isConfirmed) {
      addAlert("Proposal created", {
        description: "The transaction has been validated",
        type: "success",
      });

      onSuccess?.(receipt);
    }
  }, [isConfirming, isConfirmed]);

  const createProposal = async (
    start: Date,
    end: Date,
    title: string,
    body: string = "",
    discussion: string = "",
    choices: string[] = ["Yes", "No"]
  ) => {
    if (!title || !body || !address) {
      setError(new Error('"Missing required parameters."'));
      return;
    }

    const snapshotClient = new snapshot.Client712(PUB_SNAPSHOT_HUB_URL);
    const provider = new Web3Provider((await connector?.getProvider()) as ExternalProvider);

    try {
      setIsConfirming(true);
      setError(null);

      const latestBlock = await snapshot.utils.getBlockNumber(provider);

      const startDate = Math.floor(start.valueOf() / 1000);
      const endDate = Math.floor(end.valueOf() / 1000);

      const receipt = await snapshotClient.proposal(provider, address, {
        space: PUB_SNAPSHOT_SPACE,
        type: "single-choice",
        app: PUB_APP_NAME,
        title,
        body,
        start: startDate,
        end: endDate,
        discussion,
        choices,
        snapshot: latestBlock,
        plugins: "{}",
        labels: [],
      });

      setIsConfirmed(true);
      setReceipt((receipt as any).id as string);
    } catch (error) {
      setIsConfirmed(false);
      logger.error("Proposal creation failed", error);
      setError(error as Error);
    } finally {
      setIsConfirming(false);
    }
  };

  return { createProposal, isConfirming, isConfirmed, error, receipt };
};
