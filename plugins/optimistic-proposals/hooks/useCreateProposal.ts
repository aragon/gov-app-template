import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProposalMetadata, RawAction } from "@/utils/types";
import { useAlerts } from "@/context/Alerts";
import { PUB_APP_NAME, PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_PROJECT_URL } from "@/constants";
import { URL_PATTERN } from "@/utils/input-values";
import { toHex } from "viem";
import { useTransactionManager } from "@/hooks/useTransactionManager";
import { uploadToWeb3Storage } from "@/utils/ipfs";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";
import { useGovernanceSettings } from "./useGovernanceSettings";
import { useBlock } from "wagmi";

const UrlRegex = new RegExp(URL_PATTERN);

export function useCreateProposal() {
  const { push } = useRouter();
  const { addAlert } = useAlerts();
  const { minDuration } = useGovernanceSettings();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [duration, setDuration] = useState<number>(); // in hours
  const [description, setDescription] = useState<string>("");
  const [actions, setActions] = useState<RawAction[]>([]);
  const [resources, setResources] = useState<{ name: string; url: string }[]>([]);
  const { data: blockInfo } = useBlock({
    blockTag: "latest",
  });

  useEffect(() => {
    if (!minDuration || duration !== undefined) {
      return;
    }

    setDuration(Number(minDuration) / 86400);
  }, [minDuration]);

  const { writeContract: createProposalWrite, isConfirming } = useTransactionManager({
    onSuccessMessage: "Proposal created",
    onSuccess() {
      setTimeout(() => {
        push("#/");
        window.scroll(0, 0);
      }, 1000 * 2);
    },
    onErrorMessage: "Could not create the proposal",
    onError: () => setIsCreating(false),
  });

  const submitProposal = async () => {
    if (!blockInfo?.timestamp) {
      return addAlert("Could not get current block timestamp.", {
        description: "Please try again",
        type: "error",
      });
    }

    // Check metadata
    if (!title.trim()) {
      return addAlert("Invalid proposal details", {
        description: "Please enter a title",
        type: "error",
      });
    }

    if (!summary.trim()) {
      return addAlert("Invalid proposal details", {
        description: "Please enter a summary of what the proposal is about",
        type: "error",
      });
    }

    if (!duration || !minDuration || duration * 86400 < minDuration) {
      return addAlert("Invalid proposal duration", {
        description: `Current duration of ${duration} is lower than minimally allowed duration ${minDuration}.`,
        type: "error",
      });
    }

    for (const item of resources) {
      if (!item.name.trim()) {
        return addAlert("Invalid resource name", {
          description: "Please enter a name for all the resources",
          type: "error",
        });
      } else if (!UrlRegex.test(item.url.trim())) {
        return addAlert("Invalid resource URL", {
          description: "Please enter valid URL for all the resources",
          type: "error",
        });
      }
    }

    try {
      setIsCreating(true);
      const proposalMetadataJsonObject: ProposalMetadata = {
        title,
        summary,
        description,
        resources,
      };

      const ipfsPin = await uploadToWeb3Storage(JSON.stringify(proposalMetadataJsonObject));

      const startDate = BigInt(0); // equals "start right now"
      // the 5 * 3600 is some padding as the checks for min duration and block.timestmap in the contract will use different block timestamp than we are using here
      const endDate = blockInfo?.timestamp + BigInt(duration * 86400) + BigInt(10 * 3600);

      createProposalWrite({
        chainId: PUB_CHAIN.id,
        abi: OptimisticTokenVotingPluginAbi,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        functionName: "createProposal",
        args: [toHex(ipfsPin), actions, BigInt(0), startDate, endDate],
      });
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  return {
    isCreating: isCreating || isConfirming || status === "pending",
    title,
    summary,
    description,
    actions,
    resources,
    setTitle,
    setSummary,
    setDescription,
    setActions,
    setResources,
    submitProposal,
    duration,
    setDuration,
  };
}
