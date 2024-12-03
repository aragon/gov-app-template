import { useAccount, usePublicClient } from "wagmi";
import { type Token } from "../types/tokens";
import { decodeEventLog, getAbiItem } from "viem";
import { ExitQueueAbi } from "@/artifacts/ExitQueue.sol";
import { useQuery } from "wagmi/query";
import { useGetContracts } from "./useGetContract";
import { CONTRACTS_DEPLOYMENT_BLOCK } from "@/constants";

export function useGetCooldownLogs(token: Token) {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data } = useGetContracts(token);

  const queueContract = data?.queueContract.result;

  const ExitQueueEvent = getAbiItem({
    abi: ExitQueueAbi,
    name: "ExitQueued",
  });

  return useQuery({
    queryKey: ["exitQueue", token, address ?? ""],
    enabled: !!queueContract && !!address,
    queryFn: () =>
      publicClient?.getLogs({
        address: queueContract,
        event: ExitQueueEvent,
        args: { holder: address! },
        fromBlock: CONTRACTS_DEPLOYMENT_BLOCK,
        toBlock: "latest",
      }),
    select: (data) =>
      data?.flatMap((log) => {
        const decodedLog = decodeEventLog({ abi: ExitQueueAbi, data: log.data, topics: log.topics });
        return decodedLog.eventName === "ExitQueued" ? log : undefined;
      }),
  });
}
