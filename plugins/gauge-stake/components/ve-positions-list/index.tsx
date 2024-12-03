import { PUB_VE_TOKENS_LEARN_MORE_URL } from "../../constants";
import { DataListContainer, DataListFilter, DataListPagination, DataListRoot } from "@aragon/ods";
import { useState } from "react";

import { SectionHeader } from "../section-header";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { Token } from "../../types/tokens";
import { VePositionItem } from "./ve-position-item";
import { filterTokens } from "./utils";
import { useGetCooldownLogs } from "../../hooks/useGetCooldownLogs";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

export const StakePositions = () => {
  const [searchValue, setSearchValue] = useState("");
  const { ownedTokens: token1TokensIds, isLoading: token1TokensLoading } = useOwnedTokens(Token.TOKEN_1);
  const { ownedTokens: token2TokensIds, isLoading: token2TokensLoading } = useOwnedTokens(Token.TOKEN_2);

  const { data: cooldownToken1Logs, isLoading: cooldownToken1Loading } = useGetCooldownLogs(Token.TOKEN_1);
  const { data: cooldownToken2Logs, isLoading: cooldownToken2Loading } = useGetCooldownLogs(Token.TOKEN_2);

  const cooldownToken1Tokens = cooldownToken1Logs?.flatMap((log) =>
    log?.args.exitDate
      ? {
          id: BigInt(log?.args.tokenId ?? 0n),
          token: Token.TOKEN_1,
        }
      : []
  );
  const cooldownToken2Tokens = cooldownToken2Logs?.flatMap((log) =>
    log?.args.exitDate
      ? {
          id: BigInt(log?.args.tokenId ?? 0n),
          token: Token.TOKEN_2,
        }
      : []
  );

  const token1Tokens = token1TokensIds?.map((id) => {
    return {
      id: BigInt(id),
      token: Token.TOKEN_1,
    };
  });

  const token2Tokens = token2TokensIds?.map((id) => {
    return {
      id: BigInt(id),
      token: Token.TOKEN_2,
    };
  });

  const isLoading = token1TokensLoading || token2TokensLoading || cooldownToken1Loading || cooldownToken2Loading;
  const allVeTokens = [
    ...(token1Tokens ?? []),
    ...(token2Tokens ?? []),
    ...(cooldownToken1Tokens ?? []),
    ...(cooldownToken2Tokens ?? []),
  ];

  allVeTokens.sort((a, b) => {
    return Number(b.id - a.id);
  });

  // Remove duplicates
  const veTokens = allVeTokens.filter((veToken, index, self) => {
    return index === self.findIndex((t) => t.id === veToken.id && t.token === veToken.token);
  });

  const filteredVeTokens = filterTokens(veTokens, searchValue);

  const pageSize = 10;

  return (
    <div>
      <h2 className="text-3xl font-semibold normal-case text-neutral-800">
        <span className="text-neutral-900">YOUR</span> veTOKENS
      </h2>
      <SectionHeader title="" learnMoreUrl={PUB_VE_TOKENS_LEARN_MORE_URL}>
        Your staked {TOKEN_1_NAME} and/or {TOKEN_2_NAME} tokens are represented as veTokens. If you want to unstake your
        {TOKEN_1_NAME} and/or {TOKEN_2_NAME} tokens, they will be available within 7 days after entering the cooldown.
      </SectionHeader>

      <div className="mt-8">
        <DataListRoot
          entityLabel="veTokens"
          itemsCount={filteredVeTokens.length}
          pageSize={pageSize}
          className="gap-y-6"
          state={isLoading ? "initialLoading" : "idle"}
        >
          <DataListFilter
            searchValue={searchValue}
            placeholder="Filter by token ID or token name"
            onSearchValueChange={(v) => setSearchValue((v ?? "").trim())}
          />

          <div className="hidden gap-x-4 px-6 md:flex">
            <p className="w-16 flex-auto">Token ID</p>
            <p className="w-32 flex-auto">Amount</p>
            <p className="w-32 flex-auto">Multiplier</p>
            <p className="w-32 flex-auto">Age</p>
            <p className="w-48 flex-auto">Status</p>
          </div>

          <DataListContainer>
            {filteredVeTokens.length === 0 && <div className="text-neutral-500">No veTokens found</div>}
            {filteredVeTokens.map((veToken, pos) => (
              <VePositionItem key={pos} props={veToken} />
            ))}
          </DataListContainer>

          {filteredVeTokens.length > pageSize && <DataListPagination />}
        </DataListRoot>
      </div>
    </div>
  );
};
