import { Address } from "viem";
import { ChainName, getChain } from "./utils/chains";

// Contract Addresses
export const PUB_DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS ?? "") as Address;
export const PUB_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "") as Address;
export const PUB_STEWARD_SAFE_MULTISIG_ADDRESS = (process.env.NEXT_PUBLIC_STEWARD_SAFE_MULTISIG_ADDRESS ??
  "") as Address;

export const PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS ??
  "") as Address;
export const PUB_TOKEN_VOTING_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS ?? "") as Address;
export const PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS ??
  "") as Address;
export const PUB_DELEGATION_WALL_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DELEGATION_WALL_CONTRACT_ADDRESS ??
  "") as Address;

export const PUB_BRIDGE_ADDRESS = (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS ?? "") as Address;

// Target chain
export const PUB_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME as ChainName;
export const PUB_CHAIN = getChain(PUB_CHAIN_NAME);

export const PUB_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

// Network and services
export const PUB_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";

export const PUB_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";

export const PUB_IPFS_ENDPOINTS = process.env.NEXT_PUBLIC_IPFS_ENDPOINTS ?? "";

// Private multisig
export const DETERMINISTIC_EMERGENCY_PAYLOAD =
  "This text is used to generate an encryption key to be used on private proposals targetting the PWN DAO.\n\nSign this message ONLY if you are about to create, approve or execute a emergency proposal using the official app.";

// General
export const PUB_APP_NAME = "PWN DAO";
export const PUB_APP_DESCRIPTION = "PWN DAO's official voting UI.";
export const PUB_TOKEN_SYMBOL = "PWN";

export const PUB_PROJECT_LOGO = "/pwn-dao.svg";
export const PUB_PROJECT_URL = "https://pwn.xyz";
export const PUB_BLOG_URL = "https://pwn.mirror.xyz";
export const PUB_FORUM_URL = "https://forum.pwn.xyz";
export const PUB_WALLET_ICON = "https://avatars.githubusercontent.com/u/37784886";
