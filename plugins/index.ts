import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { IconType } from "@aragon/gov-ui-kit";

type PluginItem = {
  /** The URL fragment after /plugins */
  id: string;
  /** The name of the folder within `/plugins` */
  folderName: string;
  /** Title on menu */
  title: string;
  pluginAddress: string;
};

export const plugins: PluginItem[] = [
  {
    id: "community-voting",
    folderName: "tokenVoting",
    title: "Community",
    pluginAddress: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
  },
  {
    id: "stewards",
    folderName: "optimistic-proposals",
    title: "Stewards",
    pluginAddress: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  },
];
