import { NotFound } from "@/components/not-found";
import ProposalCreate from "./pages/new";
import ProposalList from "./pages/proposal-list";
import ProposalDetail from "./pages/proposal";
import { useRouter } from "next/router";

export function getStewardsSubpage(urlAsPath: string) {
  let pluginSubPage = urlAsPath.slice("/#/stewards".length);
  if (pluginSubPage[0] === "/") {
    pluginSubPage = pluginSubPage.slice(1);
  }

  if (pluginSubPage === "") return <ProposalList />;
  else if (pluginSubPage === "new") return <ProposalCreate />;
  else if (pluginSubPage.startsWith("proposals/")) {
    const id = pluginSubPage.replace("proposals/", "");
    return <ProposalDetail index={parseInt(id)} />;
  }

  // Default not found page
  return <NotFound />;
}

export default function PluginPage() {
  const { asPath } = useRouter();
  return getStewardsSubpage(asPath);
}
