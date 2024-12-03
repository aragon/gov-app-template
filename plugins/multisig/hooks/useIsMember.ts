import { PUB_CHAIN, PUB_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { type Address } from "viem";
import { useReadContract } from "wagmi";
import { MultisigPluginAbi } from "../artifacts/MultisigPlugin.sol";

export const useIsMember = (address?: Address) => {
  return useReadContract({
    chainId: PUB_CHAIN.id,
    abi: MultisigPluginAbi,
    address: PUB_MULTISIG_PLUGIN_ADDRESS,
    functionName: "isMember",
    args: [address!],
    query: { enabled: !!address },
  });
};
