import React, { useEffect, useState, type FC } from "react";
import { useRouter } from "next/router";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { NotFound } from "@/components/not-found";
import { plugins } from "@/plugins";
import { MainSection } from "@/components/layout/main-section";

const PluginLoader: FC = () => {
  const { asPath } = useRouter();
  const router = useRouter();
  const [PageComponent, setPageComponent] = useState<FC | null>(null);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    let pluginIdOrDefault;
    if (asPath === "/" || asPath.startsWith("/#/")) {
      if (asPath === "/" || asPath === "/#/") {
        router.push("/#/community-voting/");
        return;
      } else {
        pluginIdOrDefault = asPath.split("/")[2]; // ["", "#", "[plugin_name]"]
      }
    } else {
      throw new Error(
        `Unknown route specified: ${asPath}, route should be either #/ or #/community-voting/[action] or #/stewards/[action].`
      );
    }

    const plugin = plugins.find((p) => p.id === pluginIdOrDefault);
    if (!plugin) {
      // eslint-disable-next-line no-console
      console.error(`In URL Routing: no plugin has been found under name ${pluginIdOrDefault}.`);
      return;
    }

    // TODO do we need this import here if we have all under hash based routing?
    import(`@/plugins/${plugin.folderName}`)
      .then((mod) => {
        setComponentLoading(true);
        setPageComponent(() => mod.default);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load the page component", err);
        setComponentLoading(false);
      });
  }, [asPath]);

  if (!PageComponent) {
    if (componentLoading) {
      return (
        <MainSection>
          <div className="flex h-24 w-full items-center justify-center">
            <PleaseWaitSpinner />
          </div>
        </MainSection>
      );
    }
    return <NotFound />;
  }

  return <PageComponent />;
};

export default PluginLoader;
