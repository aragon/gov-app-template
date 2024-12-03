import { DataListContainer, DataListFilter, DataListRoot } from "@aragon/ods";
import { useState } from "react";
import { useGetGauges } from "../../hooks/useGetGauges";

import { GaugeListItem } from "./gauge-item";
import { type GaugeMetadata, type GaugeItem } from "./types";
import { Token } from "@/types/tokens";
import { useGetGaugesInfo } from "../../hooks/useGetGaugesInfo";
import { type Address } from "viem";
import { VotingBar } from "../voting-bar";
import { useGetGaugeMetadata } from "../../hooks/useGetGaugeMetadata";
import { useGetTotalGaugeVotes } from "../../hooks/useGetTotalGaugeVotes";

export const StakePositions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedGauges, setSelectedGauges] = useState<GaugeItem[]>([]);

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

  const { data: totalModeVotesData } = useGetTotalGaugeVotes(
    Token.TOKEN_1,
    allGauges.filter((gauge) => gauge.token === Token.TOKEN_1).map((gauge) => gauge.address)
  );

  const totalVotesBn = totalModeVotesData ?? 0n;

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
    <div className="mt-8">
      <DataListRoot
        entityLabel="Projects"
        itemsCount={filteredGauges.length}
        pageSize={filteredGauges.length}
        className="mb-12 gap-y-6"
        state={isLoading ? "initialLoading" : "idle"}
      >
        <DataListFilter
          searchValue={searchValue}
          placeholder="Filter projects by name or address"
          onSearchValueChange={(v) => setSearchValue((v ?? "").trim())}
        />

        <div className="hidden gap-x-4 px-6 md:flex">
          <p className="flex w-1/6 flex-row">Name</p>
          <div className="end flex w-3/6 flex-row">
            <p className="flex w-1/2 justify-end">Total Votes</p>
            <p className="flex w-1/2 justify-end">Your Votes</p>
          </div>
          <p className="w-1/6 flex-auto"></p>
        </div>

        <DataListContainer>
          {filteredGauges.length === 0 && <div className="text-neutral-500">No Projects found</div>}
          {filteredGauges.map((gauge, pos) => (
            <GaugeListItem
              key={pos}
              props={gauge}
              totalVotes={totalVotesBn}
              selected={!!selectedGauges.find((g) => g.address === gauge.address)}
              onSelect={(selected) => {
                setSelectedGauges((selectedGauges) => {
                  const cleanedGauges = selectedGauges.filter((g) => g.address !== gauge.address);
                  if (selected) {
                    cleanedGauges.splice(pos, 0, gauge);
                  }
                  return cleanedGauges;
                });
              }}
            />
          ))}
        </DataListContainer>
      </DataListRoot>
      <VotingBar
        selectedGauges={selectedGauges}
        onRemove={(gauge) => {
          const index = selectedGauges.findIndex((g) => g.address === gauge.address);
          if (index !== -1) setSelectedGauges(selectedGauges.filter((_, i) => i !== index));
        }}
      />
    </div>
  );
};
