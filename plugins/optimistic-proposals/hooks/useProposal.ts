import { useState, useEffect } from "react";
import { useBlockNumber, usePublicClient, useReadContract } from "wagmi";
import { Address, Hex, fromHex, getAbiItem } from "viem";
import { ProposalMetadata, type RawAction, type DecodedAction } from "@/utils/types";
import {
  type OptimisticProposal,
  type OptimisticProposalParameters,
  type OptimisticProposalResultType,
} from "@/plugins/optimistic-proposals/utils/types";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useMetadata } from "@/hooks/useMetadata";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";
import { parseProposalId } from "../utils/proposal-id";

type ProposalCreatedLogResponse = {
  args: {
    actions: RawAction[];
    allowFailureMap: bigint;
    creator: Address;
    endDate: bigint;
    startDate: bigint;
    metadata: Hex;
    proposalId: bigint;
  };
};

const ProposalCreatedEvent = getAbiItem({
  abi: OptimisticTokenVotingPluginAbi,
  name: "ProposalCreated",
});

export function useProposal(proposalId?: bigint, autoRefresh = false) {
  const publicClient = usePublicClient();
  const [proposalCreationEvent, setProposalCreationEvent] = useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadataUri] = useState<string>();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Proposal onchain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
  } = useReadContract({
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "getProposal",
    args: [proposalId ?? BigInt(0)],
    chainId: PUB_CHAIN.id,
  });

  const proposalData = decodeProposalResultData(proposalResult);

  useEffect(() => {
    if (autoRefresh) proposalRefetch();
  }, [blockNumber]);

  // Creation event
  useEffect(() => {
    if (proposalId === undefined || !proposalData || !publicClient) return;

    publicClient
      .getLogs({
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        event: ProposalCreatedEvent,
        args: {
          proposalId: BigInt(proposalId),
        },
        //fromBlock: proposalData.parameters.snapshotBlock,
        // TODO can we somehow get the from/to blocks from the proposalData?
        fromBlock: BigInt(0),
        // toBlock: proposalData.parameters.startDate,
        toBlock: "latest",
      })
      .then((logs) => {
        if (!logs || !logs.length) throw new Error("No creation logs");

        const log: ProposalCreatedLogResponse = logs[0] as any;
        setProposalCreationEvent(log.args);
        setMetadataUri(fromHex(log.args.metadata as Hex, "string"));
      })
      .catch((err) => {
        console.error("Could not fetch the proposal details", err);
      });
  }, [proposalId, !!proposalData, publicClient?.chain.id]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetadata<ProposalMetadata>(metadataUri);

  const proposal = arrangeProposalData(proposalId, proposalData, proposalCreationEvent, metadataContent);
  return {
    proposal,
    refetch: proposalRefetch,
    status: {
      proposalReady: proposalFetchStatus === "idle",
      proposalLoading: proposalFetchStatus === "fetching",
      proposalError,
      metadataReady: !metadataError && !metadataLoading && !!metadataContent,
      metadataLoading,
      metadataError: metadataError !== undefined,
    },
  };
}

// Helpers

function decodeProposalResultData(data?: OptimisticProposalResultType) {
  if (!data?.length || data.length < 6) return null;

  return {
    active: data[0] as boolean,
    executed: data[1] as boolean,
    parameters: data[3] as OptimisticProposalParameters,
    vetoTally: data[4] as bigint,
    // TODO what about this metadataUri?
    // metadataUri: data[4] as string,
    actions: data[5] as Array<RawAction>,
    allowFailureMap: data[6] as bigint,
  };
}

function arrangeProposalData(
  proposalId?: bigint,
  proposalData?: ReturnType<typeof decodeProposalResultData>,
  creationEvent?: ProposalCreatedLogResponse["args"],
  metadata?: ProposalMetadata
): OptimisticProposal | null {
  if (!proposalData || proposalId === undefined) return null;

  const { index, startDate: vetoStartDate, endDate: vetoEndDate } = parseProposalId(proposalId);

  return {
    index,
    actions: proposalData.actions,
    active: proposalData.active,
    executed: proposalData.executed,
    parameters: proposalData.parameters,
    //  {
    //   minVetoRatio: proposalData.parameters.minVetoRatio,
    //   skipL2: proposalData.parameters.skipL2,
    //   snapshotTimestamp: proposalData.parameters.snapshotTimestamp,
    //   vetoStartDate,
    //   vetoEndDate,
    // },
    vetoTally: proposalData.vetoTally,
    allowFailureMap: proposalData.allowFailureMap,
    creator: creationEvent?.creator ?? "",
    title: metadata?.title ?? "",
    summary: metadata?.summary ?? "",
    description: metadata?.description ?? "",
    resources: metadata?.resources ?? [],
  };
}
