import React, { useEffect, useState, type FC } from "react";
import { useRouter } from "next/router";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { resolveQueryParam } from "@/utils/query";
import { NotFound } from "@/components/not-found";
import { plugins } from "@/plugins";
import { MainSection } from "@/components/layout/main-section";

const PluginLoader: FC = () => {
  const { query } = useRouter();
  const pluginId = resolveQueryParam(query.id);
  const [PageComponent, setPageComponent] = useState<FC | null>(null);
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    console.log("pluginId in plugins id");
    console.log(pluginId || "community-voting");
    if (!pluginId) return;

    const plugin = plugins.find((p) => p.id === (pluginId || "community-voting"));
    if (!plugin) return;

    import(`@/plugins/${plugin.folderName}`)
      .then((mod) => {
        setComponentLoading(true);
        console.log("mod in plugins [id]");
        console.log(mod);
        setPageComponent(() => mod.default);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load the page component", err);
        setComponentLoading(false);
      });
  }, [pluginId]);

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
