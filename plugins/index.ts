import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { IconType } from "@aragon/ods";

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
    id: "community-voting",
    folderName: "tokenVoting",
    title: "Community Voting",
    // icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
    pluginAddress: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  },
  {
    id: "stewards",
    folderName: "optimistic-proposals",
    title: "Stewards",
    // icon: IconType.APP_MEMBERS,
    pluginAddress: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  },
];
