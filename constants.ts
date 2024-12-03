import { type Address } from "viem";
import { type ChainName, getChain } from "./utils/chains";

// Target chain
export const PUB_CHAIN_NAME = (process.env.NEXT_PUBLIC_CHAIN_NAME ?? "holesky") as ChainName;
export const PUB_CHAIN = getChain(PUB_CHAIN_NAME);
export const PUB_CHAIN_BLOCK_EXPLORER =
  process.env.NEXT_PUBLIC_CHAIN_BLOCK_EXPLORER ?? PUB_CHAIN.blockExplorers?.default.url;
export const CONTRACTS_DEPLOYMENT_BLOCK = BigInt(process.env.NEXT_PUBLIC_CONTRACTS_DEPLOYMENT_BLOCK ?? "0");

// ENS target chain
export const PUB_ENS_CHAIN_NAME = (process.env.NEXT_PUBLIC_ENS_CHAIN_NAME ?? "mainnet") as ChainName;
export const PUB_ENS_CHAIN = getChain(PUB_ENS_CHAIN_NAME);

// Contracts
export const PUB_DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS ?? "") as Address;
export const PUB_MULTISIG_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_MULTISIG_PLUGIN_ADDRESS ?? "") as Address;

export const PUB_DELEGATION_WALL_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DELEGATION_WALL_CONTRACT_ADDRESS ??
  "") as Address;
export const PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS ??
  "") as Address;
export const PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_EMERGENCY_MULTISIG_PLUGIN_ADDRESS ??
  "") as Address;
export const PUB_TOKEN_VOTING_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_LOCK_TO_VOTE_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_OPT_MULTISIG_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_OPT_MULTISIG_PLUGIN_ADDRESS ?? "") as Address;

export const PUB_VOTING_ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_VOTING_ESCROW_ADDRESS ?? "") as Address;

export const DETERMINISTIC_EMERGENCY_PAYLOAD = (process.env.NEXT_PUBLIC_DETERMINISTIC_EMERGENCY_PAYLOAD ??
  "") as string;

export const PUB_TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS ?? 18);
export const PUB_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "") as Address;
export const PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS ??
  "") as Address;
export const PUB_TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL ?? "";
export const PUB_BRIDGE_ADDRESS = (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS ?? "") as Address;

// Network and services
export const PUB_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";

export const PUB_WEB3_ENDPOINT = process.env.NEXT_PUBLIC_WEB3_URL_PREFIX ?? "";
export const PUB_WEB3_ENS_ENDPOINT = (process.env.NEXT_PUBLIC_WEB3_ENS_URL_PREFIX ?? "") + PUB_ALCHEMY_API_KEY;

export const PUB_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";

export const PUB_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";

export const PUB_USE_BLOCK_TIMESTAMP = process.env.NEXT_PUBLIC_USE_BLOCK_TIMESTAMP === "true";

// IFPS
export const PUB_IPFS_ENDPOINTS = process.env.NEXT_PUBLIC_IPFS_ENDPOINTS ?? "";
export const PUB_PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "";

// General
export const PUB_APP_NAME = "Aragon Governance Hub";
export const PUB_APP_DESCRIPTION = "The place for all things Aragon Governance.";
export const PUB_PROJECT_LOGO = "/logo.png";

export const PUB_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export const PUB_SOCIAL_IMAGE = process.env.NEXT_PUBLIC_SOCIAL_IMAGE ?? `${PUB_BASE_URL}/og`;

export const PUB_PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL ?? "";
export const PUB_GOV_FORUM_URL = process.env.NEXT_PUBLIC_GOV_FORUM_URL ?? "";
export const PUB_DEV_PAGE_URL = process.env.NEXT_PUBLIC_DEV_PAGE_URL ?? "";

export const PUB_WALLET_ICON = process.env.NEXT_PUBLIC_WALLET_CONNECT_ICON ?? "";

// Footer
export const PUB_BLOG_URL = "";
export const PUB_FORUM_URL = "";
