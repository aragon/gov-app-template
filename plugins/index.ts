type PluginItem = {
  /** The URL fragment after /plugins */
  id: string;
  /** The name of the folder within `/plugins` */
  folderName: string;
  /** Title on menu */
  title: string;
};

export const plugins: PluginItem[] = [
  {
    id: "community-voting",
    folderName: "tokenVoting",
    title: "Community",
  },
  {
    id: "stewards",
    folderName: "optimistic-proposals",
    title: "Stewards",
  },
];
