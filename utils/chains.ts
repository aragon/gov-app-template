import { config } from "@/context/Web3Modal";
import { AppKitNetwork } from "@reown/appkit/networks";
import { Chain, mainnet, sepolia } from "@wagmi/core/chains";
import { mainnet as mainnetAppKit, sepolia as sepoliaAppKit } from "@reown/appkit/networks";
import { useChainId } from "wagmi";
import { getChainId } from "wagmi/actions";

export const ALLOWED_CHAIN_IDS: [1, 11155111] = [1, 11155111];
export type ChainId = (typeof ALLOWED_CHAIN_IDS)[number];
export type ChainName = "mainnet" | "sepolia";

export function getViemChain(chainId: ChainId): Chain {
  switch (chainId) {
    case 1:
      return mainnet;
    case 11155111:
      return sepolia;
    default:
      throw new Error(`Unknown chain: ${chainId} in getViemChain.`);
  }
}

export function getAppKitChain(chainId: ChainId): AppKitNetwork {
  switch (chainId) {
    case 1:
      return mainnetAppKit;
    case 11155111:
      return sepoliaAppKit;
    default:
      throw new Error(`Unknown chain: ${chainId} in getAppKitChain.`);
  }
}

export function useChainIdTypesafe() {
  return useChainId() as ChainId;
}

export function getChainIdTypesafe() {
  return getChainId(config) as ChainId;
}

export function getCurrentViemChain() {
  return getViemChain(getChainIdTypesafe());
}
