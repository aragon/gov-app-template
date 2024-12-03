import {
  PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
  PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  PUB_MULTISIG_PLUGIN_ADDRESS,
  PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS,
  PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
  PUB_OPT_MULTISIG_PLUGIN_ADDRESS,
} from "@/constants";
import { type IconType } from "@aragon/ods";
import { zeroAddress } from "viem";

type PluginItem = {
  /** The URL fragment after /plugins */
  id: string;
  /** The name of the folder within `/plugins` */
  folderName: string;
  /** Title on menu */
  title: string;
  icon?: IconType;
  pluginAddress: string;
};

export const plugins: PluginItem[] = [
  {
    id: "multisig",
    folderName: "multisig",
    title: "Multisig",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_MULTISIG_PLUGIN_ADDRESS,
  },
  {
    id: "token-voting",
    folderName: "tokenVoting",
    title: "Token Voting",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  },
  {
    id: "lock-to-vote",
    folderName: "lockToVote",
    title: "Lock to vote",
    // icon: IconType.BLOCKCHAIN_BLOCK,
    pluginAddress: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
  },
  {
    id: "optimistic",
    folderName: "optimistic-proposals",
    title: "Optimistic",
    // icon: IconType.APP_MEMBERS,
    pluginAddress: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  },
  {
    id: "opt-multisig",
    folderName: "opt-multisig",
    title: "Multisig (Optimistic)",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_OPT_MULTISIG_PLUGIN_ADDRESS,
  },
  {
    id: "emergency",
    folderName: "emergency-multisig",
    title: "Emergency",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS,
  },
  {
    id: "members",
    folderName: "members",
    title: "Members",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
  },
  {
    id: "stake",
    folderName: "stake",
    title: "Stake",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
  },
  {
    id: "gauge-voting",
    folderName: "gauge-voting",
    title: "Gauges",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
  },
  {
    id: "gauge-multisig",
    folderName: "gauge-multisig",
    title: "Gauge Multisig",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
  },
  {
    id: "community",
    folderName: "snapshot-voting",
    title: "Proposals",
    //icon: IconType.APP_PROPOSALS,
    pluginAddress: zeroAddress,
  },
];
