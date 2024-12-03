import { Avatar, Button, DataListItem, IconType, type IInputContainerAlert, InputNumber, Tooltip } from "@aragon/ods";
import React, { useEffect } from "react";
import { type GaugeItem } from "../gauges-list/types";
import { shortenAddress } from "@/utils/address";
import { Token } from "../../types/tokens";
import { useGetVotes } from "../../hooks/useGetVotes";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { formatUnits } from "viem";
import { useGetUsedVp } from "../../hooks/useGetUsedVp";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

type VotingListItemProps = {
  gauge: GaugeItem;
  token1Votes?: number;
  token2Votes?: number;
  totalToken1Votes: number;
  totalToken2Votes: number;
  tolerance: number;
  onChange: (token: Token, votes: number) => void;
  onRemove: () => void;
};
export const VotingListItem: React.FC<VotingListItemProps> = ({
  gauge,
  token1Votes,
  token2Votes,
  totalToken1Votes,
  totalToken2Votes,
  tolerance,
  onChange,
  onRemove,
}) => {
  const { ownedTokens: token1OwnedTokensData } = useOwnedTokens(Token.TOKEN_1);
  const { ownedTokens: token2OwnedTokensData } = useOwnedTokens(Token.TOKEN_2);

  const token1OwnedTokens = [...(token1OwnedTokensData ?? [])];
  const token2OwnedTokens = [...(token2OwnedTokensData ?? [])];

  const { data: userToken1VotesData } = useGetVotes(Token.TOKEN_1, [...token1OwnedTokens], gauge.address);
  const { data: userToken2VotesData } = useGetVotes(Token.TOKEN_2, [...token2OwnedTokens], gauge.address);

  const { data: usedToken1Vp } = useGetUsedVp(Token.TOKEN_1, token1OwnedTokens);
  const { data: usedToken2Vp } = useGetUsedVp(Token.TOKEN_2, token2OwnedTokens);

  const { vp: token1Vp } = useGetAccountVp(Token.TOKEN_1);
  const { vp: token2Vp } = useGetAccountVp(Token.TOKEN_2);

  const token1Perc = usedToken1Vp
    ? Math.round((Number(formatUnits(userToken1VotesData ?? 0n, 18)) / Number(formatUnits(usedToken1Vp, 18))) * 100)
    : 0;

  const token2Perc = usedToken2Vp
    ? Math.round((Number(formatUnits(userToken2VotesData ?? 0n, 18)) / Number(formatUnits(usedToken2Vp, 18))) * 100)
    : 0;

  useEffect(() => {
    if (token1Votes === undefined && token1Perc) {
      onChange(Token.TOKEN_1, token1Perc);
    }
  }, [token1Votes, token1Perc, onChange]);

  useEffect(() => {
    if (token2Votes === undefined && token2Perc) {
      onChange(Token.TOKEN_2, token2Perc);
    }
  }, [token2Votes, token2Perc, onChange]);

  const getToken1Alert = () => {
    return Math.abs(totalToken1Votes - 100) >= tolerance && totalToken1Votes !== 0
      ? ("critical" as IInputContainerAlert["variant"])
      : undefined;
  };

  const getToken2Alert = () => {
    return Math.abs(totalToken2Votes - 100) >= tolerance && totalToken2Votes !== 0
      ? ("critical" as IInputContainerAlert["variant"])
      : undefined;
  };

  return (
    <DataListItem className="flex flex-col items-center gap-4 md:flex-row">
      <div className="flex w-full flex-auto items-center gap-x-3 md:w-1/4">
        <Avatar
          alt="Gauge icon"
          size="lg"
          src={gauge.metadata?.logo}
          fallback={
            <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
              {gauge.metadata?.name.slice(0, 2)}
            </span>
          }
        />
        <div className="flex flex-col">
          <p className="title text-neutral-900">{gauge.metadata?.name}</p>
          <p className="text-neutral-600">{shortenAddress(gauge.address)}</p>
        </div>
        <div className="flex w-full flex-row-reverse md:hidden">
          <Button
            variant="tertiary"
            size="sm"
            iconLeft={IconType.CLOSE}
            onClick={() => {
              onChange(Token.TOKEN_1, 0);
              onChange(Token.TOKEN_2, 0);
              onRemove();
            }}
          />
        </div>
      </div>
      <div className="w-full flex-auto md:w-1/4">
        <div className="mx-4 flex flex-row items-center gap-2">
          <Avatar alt="Token1 icon" size="sm" src="/token-1-icon.png" />
          <p className="w-1/5">{TOKEN_1_NAME}</p>
          <InputNumber
            value={token1Votes ?? token1Perc}
            step={1}
            variant={getToken1Alert()}
            disabled={token1Vp === 0n}
            suffix="%"
            min={0}
            max={100}
            onChange={(val) => {
              if (val === undefined) return;
              onChange(Token.TOKEN_1, Number(val));
            }}
          />
        </div>
      </div>
      <div className="w-full flex-auto md:w-1/4">
        <div className="mx-4 flex flex-row items-center gap-2">
          <Avatar alt="Token2 icon" size="sm" src="/token-2-icon.png" />
          <p className="w-1/5">{TOKEN_2_NAME}</p>
          <InputNumber
            value={token2Votes ?? token2Perc}
            step={1}
            variant={getToken2Alert()}
            disabled={token2Vp === 0n}
            suffix="%"
            min={0}
            max={100}
            onChange={(val) => {
              if (val === undefined) return;
              onChange(Token.TOKEN_2, Number(val));
            }}
          />
        </div>
      </div>
      <div className="w-1/8 hidden flex-row-reverse md:block">
        <Button
          variant="tertiary"
          size="sm"
          iconLeft={IconType.REMOVE}
          onClick={() => {
            onChange(Token.TOKEN_1, 0);
            onChange(Token.TOKEN_2, 0);
            onRemove();
          }}
        />
      </div>
    </DataListItem>
  );
};
