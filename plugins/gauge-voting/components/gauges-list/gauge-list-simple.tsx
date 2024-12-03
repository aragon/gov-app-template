import { DataListContainer, DataListRoot } from "@aragon/ods";
import { useState } from "react";
import { useGetGauges } from "../../hooks/useGetGauges";

import { type GaugeMetadata, type GaugeItem } from "./types";
import { Token } from "@/types/tokens";
import { useGetGaugesInfo } from "../../hooks/useGetGaugesInfo";
import { type Address } from "viem";
import { useGetGaugeMetadata } from "../../hooks/useGetGaugeMetadata";
import { SimpleGaugeListItem } from "./simple-list-item";

export const SimpleGaugeList = () => {
  const [searchValue] = useState("");

  const { gauges: pufferGauges } = useGetGauges(Token.TOKEN_1);

  const { data: pufferInfo } = useGetGaugesInfo((pufferGauges as Address[]) ?? [], Token.TOKEN_1);

  const gaugesData = pufferInfo ?? [];
  const gaugesInfo = gaugesData.filter((gauge) => gauge.info?.active);

  const { metadata: gaugesMetadata } = useGetGaugeMetadata<GaugeMetadata>(gaugesInfo.map((g) => g.info?.metadataURI));

  const allGauges = gaugesInfo.map((gauge) => {
    const metadata = gaugesMetadata.find((m) => m.data?.ipfsUri === gauge.info?.metadataURI);
    return {
      ...gauge,
      metadata: metadata?.data?.metadata,
    };
  }) as GaugeItem[];

  const isLoading = false;

  const gauges = allGauges.filter((gauge, index, self) => {
    return index === self.findIndex((t) => t.address === gauge.address);
  });

  const filteredGauges = gauges.filter((gauge) => {
    if (!searchValue) return true;
    return (
      gauge.metadata?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      gauge.address.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  return (
    <div>
      <DataListRoot
        entityLabel="Projects"
        itemsCount={filteredGauges.length}
        pageSize={filteredGauges.length}
        className="gap-y-6"
        state={isLoading ? "initialLoading" : "idle"}
      >
        <DataListContainer>
          {filteredGauges.length === 0 && <div className="text-neutral-500">No Projects found</div>}
          {filteredGauges.map((gauge, pos) => (
            <SimpleGaugeListItem key={pos} props={gauge} />
          ))}
        </DataListContainer>
      </DataListRoot>
    </div>
  );
};
