"use client";

import { useEffect, useCallback, useState } from 'react';
import { useContractRead, usePublicClient } from 'wagmi';
import { getAbiItem, Address } from 'viem'
import { TokenVotingAbi } from '../../../artifacts/TokenVoting.sol';
import { Tally, Action, Proposal, ProposalCreatedLogResponse, ProposalParameters, ProposalMetadata } from '../../../types';
import { useQuery } from 'react-query';
import { fromHex } from 'viem'


const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`
const ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || "";
const ipfsKey = process.env.NEXT_PUBLIC_IPFS_API_KEY || "";

type ProposalInputs = {
  proposalId: bigint;
}

function getPath(hexedIpfs: Address) {
  const ipfsPath = fromHex(hexedIpfs, 'string')
  const path = ipfsPath.includes('ipfs://') ? ipfsPath.substring(7) : ipfsPath
  return path
}
async function fetchFromIPFS(ipfsPath: string | undefined) {
  if (!ipfsPath) return
  const path = getPath((ipfsPath as Address))
  const response = await fetch(`${ipfsEndpoint}${path}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': ipfsKey,
      'Accept': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // or .text(), .blob(), etc., depending on the data format
}

export default function Proposal(props: ProposalInputs) {
  const publicClient = usePublicClient()
  const [proposal, setProposal] = useState<Proposal>();
  const [proposalLogs, setProposalLogs] = useState<ProposalCreatedLogResponse>();
  const [proposalMetadata, setProposalMetadata] = useState<string>();
  const { data: ipfsResponse, isLoading: ipfsLoading, error } = useQuery<ProposalMetadata, Error>(
    `ipfsData${props.proposalId}`,
    () => fetchFromIPFS(proposalMetadata),
    { enabled: proposalMetadata ? true : false }
  );

  const { isLoading: proposalLoading } = useContractRead({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: 'getProposal',
    args: [props.proposalId],
    onSuccess(data) {
      setProposal({
        open: (data as Array<boolean>)[0],
        executed: (data as Array<boolean>)[1],
        parameters: (data as Array<ProposalParameters>)[2],
        tally: (data as Array<Tally>)[3],
        actions: (data as Array<Array<Action>>)[4],
        allowFailureMap: (data as Array<bigint>)[5],
      } as Proposal)
    }
  })

  const getProposalLogs = useCallback(async () => {
    if (!proposal) return
    const event = getAbiItem({ abi: TokenVotingAbi, name: 'ProposalCreated' })

    const logs: ProposalCreatedLogResponse[] = await publicClient.getLogs({
      address: pluginAddress,
      event,
      args: {
        proposalId: props.proposalId,
      } as any,
      fromBlock: (proposal as Proposal).parameters.snapshotBlock,
      toBlock: (proposal as Proposal).parameters.startDate,
    });
    setProposalLogs(logs[0]);
    setProposalMetadata(logs[0].args.metadata);
  }, [proposal]);

  useEffect(() => {
    if (proposal) getProposalLogs();
  }, [proposal]);

  if (proposalLogs) return (
    <section className="pb-6 pt-10 dark:bg-dark lg:pb-[15px] lg:pt-[20px] w-5/6">
      <div className="container mx-auto">
        <div className="bg-blue-50 flex flex-wrap items-center justify-between rounded-lg border border-stroke bg-gray-2 px-6 py-8 dark:border-dark-3 dark:bg-dark-2 xs:px-10 md:px-8 lg:px-10">
          <div className="w-full md:w-7/12 lg:w-2/3">
            <div className="mb-6 md:mb-0">
              <h4 className="mb-1 text-l font-semibold text-dark dark:text-white xs:text-xl md:text-l lg:text-xl">
                {props.proposalId.toLocaleString()} - {ipfsResponse && ipfsResponse.title}
              </h4>
              <p className="text-base text-body-color dark:text-dark-6">
                {ipfsResponse && ipfsResponse.summary}
              </p>
            </div>
          </div>

          <div className="w-full md:w-5/12 lg:w-1/3">
            <div className="flex items-center space-x-3 md:justify-end">
              <button className="inline-flex items-center justify-center rounded-md bg-white px-7 py-3 text-center text-base font-medium text-body-color shadow-1 dark:bg-dark dark:text-dark-6 dark:shadow-none">
                {proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally.no >= proposal?.tally.yes ? 'Defeated' : 'To Execute'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  else return (<></>)
}


