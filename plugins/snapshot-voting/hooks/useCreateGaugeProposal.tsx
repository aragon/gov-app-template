import { PUB_APP_NAME } from "@/constants";
import { PUB_SNAPSHOT_HUB_URL, PUB_SNAPSHOT_GAUGES_SPACE } from "../constants";

import { useAlerts } from "@/context/Alerts";
import { Gauge, GaugeInfo } from "@/plugins/gauge-voting/components/gauges-list/types";
import { useGetGauges } from "@/plugins/gauge-voting/hooks/useGetGauges";
import { useGetGaugesInfo } from "@/plugins/gauge-voting/hooks/useGetGaugesInfo";
import { Token } from "@/plugins/gauge-voting/types/tokens";
import { logger } from "@/services/logger";
import { Web3Provider, type ExternalProvider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

function useGetActiveGauges(): Address[] | [] {
  const [gaugeAddresses, setGaugeAddresses] = useState<Address[]>([]);
  const { gauges } = useGetGauges();
  const { data: gaugeInfo, isLoading: getGaugesInfoLoading } = useGetGaugesInfo((gauges as Address[]) ?? []);

  useEffect(() => {
    if (!getGaugesInfoLoading && gaugeInfo && gaugeInfo.length) {
      const activeGauges = gaugeInfo
        .filter((g) => g.info.active)
        .map((g) => g.address)
        .map((g) => g.toLowerCase()) as Address[];
      setGaugeAddresses(activeGauges);
    }
  }, [gauges, gaugeInfo, getGaugesInfoLoading]);
  return gaugeAddresses;
}

export const useCreateGaugeProposal = (onSuccess?: (id?: string) => void) => {
  const { addAlert } = useAlerts();
  const { address, connector } = useAccount();

  const [error, setError] = useState<Error | null>(null);
  const [receipt, setReceipt] = useState<string>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const activeGauges = useGetActiveGauges();

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

  const createGaugeProposal = async (
    start: Date,
    end: Date,
    title: string,
    body: string = "",
    discussion: string = ""
  ) => {
    // if (!title || !body || !address) {
    //   setError(new Error('"Missing required parameters."'));
    //   return;
    // }
    console.debug("CREATE");

    const snapshotClient = new snapshot.Client712(PUB_SNAPSHOT_HUB_URL);
    const provider = new Web3Provider((await connector?.getProvider()) as ExternalProvider);

    try {
      setIsConfirming(true);
      setError(null);

      const latestBlock = await snapshot.utils.getBlockNumber(provider);

      const startDate = Math.floor(start.valueOf() / 1000);
      const endDate = Math.floor(end.valueOf() / 1000);

      const proposalData = {
        space: PUB_SNAPSHOT_GAUGES_SPACE,
        type: "weighted",
        app: PUB_APP_NAME,
        title,
        body,
        start: startDate,
        end: endDate,
        discussion,
        choices: activeGauges,
        snapshot: latestBlock,
        plugins: "{}",
        labels: [],
      };

      //
      // const receipt = await snapshotClient.proposal(provider, address, {
      //   space: PUB_SNAPSHOT_GAUGES_SPACE,
      //   type: "weighted",
      //   app: PUB_APP_NAME,
      //   title,
      //   body,
      //   start: startDate,
      //   end: endDate,
      //   discussion,
      //   choices: activeGauges,
      //   snapshot: latestBlock,
      //   plugins: "{}",
      //   labels: [],
      // });
      //

      const receipt = { id: "1234" };
      console.log({ proposalData });

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

  return { createProposal: createGaugeProposal, isConfirming, isConfirmed, error, receipt };
};
