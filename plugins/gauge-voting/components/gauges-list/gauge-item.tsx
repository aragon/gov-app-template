import { Avatar, Button, DataListItem, formatterUtils, IconType, NumberFormat } from "@aragon/ods";
import { type GaugeItem } from "./types";
import { Fragment, useEffect, useState } from "react";
import { shortenAddress } from "@/utils/address";
import { useGetVotes } from "../../hooks/useGetVotes";
import { useOwnedTokens } from "@/plugins/gauge-stake/hooks/useOwnedTokens";
import { useGetGaugeVotes } from "../../hooks/useGetGaugeVotes";
import { formatUnits } from "viem";
import { GaugeDetailsDialog } from "./gauge-details-dialog";
import { StakingToken, Token } from "@/types/tokens";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";

type GaugeItemProps = {
  props: GaugeItem;
  totalVotes: bigint;
  selected: boolean;
  onSelect: (selected: boolean) => void;
};

export const GaugeListItem: React.FC<GaugeItemProps> = ({ props, selected, totalVotes: totalVotesBn, onSelect }) => {
  const metadata = props.metadata;
  const [openDialog, setOpenDialog] = useState(false);

  const { ownedTokens } = useOwnedTokens(Token.TOKEN_1);
  const tokenIds = ownedTokens ?? [];

  const { data: userVotesData } = useGetVotes(Token.TOKEN_1, [...tokenIds], props.address);
  const { data: gaugeVotesData } = useGetGaugeVotes(Token.TOKEN_1, props.address);

  const { vp } = useGetAccountVp(Token.TOKEN_1);

  const hasBalance = !!vp && vp > 0n;

  const userVotesBn = BigInt(userVotesData ?? 0n);
  const gaugeTotalVotesBn = BigInt(gaugeVotesData ?? 0n);

  const userVotes = formatterUtils.formatNumber(formatUnits(userVotesBn, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const gaugeTotalVotes = formatterUtils.formatNumber(formatUnits(gaugeTotalVotesBn, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const percentage = (Number(formatUnits(gaugeTotalVotesBn, 18)) / Number(formatUnits(totalVotesBn, 18))) * 100;
  const formattedPercentage = formatterUtils.formatNumber(percentage ? percentage : 0, {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  useEffect(() => {
    if (userVotesBn > 0n) {
      onSelect(true);
    }
  }, [userVotesBn]);

  return (
    <>
      <Fragment>
        <div>
          <GaugeDetailsDialog
            selectedGauge={props}
            openDialog={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          />
          <DataListItem
            key={metadata?.name}
            className="mt-2 flex flex-col gap-x-4 border border-neutral-100 p-4 md:flex-row md:items-center"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <div className="flex w-full flex-row items-center gap-x-3 md:w-1/6">
              <Avatar
                alt="Gauge icon"
                size="lg"
                src={metadata?.logo}
                fallback={
                  <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
                    {metadata?.name.slice(0, 2).toUpperCase()}
                  </span>
                }
              />
              <div className="flex flex-col">
                <p className="title text-neutral-900">{metadata?.name}</p>
                <p className="text-neutral-600">{shortenAddress(props.address)}</p>
              </div>
            </div>
            <div className="flex w-full flex-row md:w-3/6">
              <div className="my-2 flex w-1/2 flex-col md:my-0 md:text-right">
                <p className="mb-1 mt-3 text-neutral-900 md:hidden">Total votes</p>
                <p>
                  {gaugeTotalVotes} <span className="title text-xs text-neutral-600">votes</span>
                </p>
                <p>
                  {formattedPercentage}% <span className="title text-xs text-neutral-600">of total</span>
                </p>
              </div>
              <div className="my-2 flex w-1/2 flex-col justify-start md:my-0 md:justify-center md:text-right">
                <p className="mb-1 mt-3 text-neutral-900 md:hidden">Your votes</p>
                {userVotesBn ? (
                  <>
                    <p>
                      {userVotes} <span className="title text-xs text-neutral-600">{StakingToken.symbol}</span>
                    </p>
                  </>
                ) : (
                  <p className="title text-neutral-700">None</p>
                )}
              </div>
            </div>
            <div className="w-full flex-auto md:w-1/6">
              <div className="flex flex-row-reverse">
                <Button
                  size="sm"
                  disabled={!hasBalance}
                  variant={selected ? "primary" : "tertiary"}
                  iconLeft={selected ? IconType.CHECKMARK : undefined}
                  className="btn btn-primary w-full md:w-1/2"
                  onClick={(ev: any) => {
                    ev.stopPropagation();
                    onSelect(!selected);
                  }}
                >
                  {selected ? "Selected" : hasBalance ? "Select to vote" : "Stake to vote"}
                </Button>
              </div>
            </div>
          </DataListItem>
        </div>
        <div className="hidden">
          <DataListItem key={metadata?.name} className="my-2 border border-neutral-100 px-4 py-2">
            <dl className="flex flex-col divide-y divide-neutral-100">
              <div className="flex justify-between py-2">
                <div className="flex items-center gap-x-4">
                  <Avatar
                    alt="Gauge icon"
                    size="lg"
                    src={metadata?.logo}
                    fallback={
                      <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
                        {metadata?.name.slice(0, 2).toUpperCase()}
                      </span>
                    }
                  />
                  {metadata?.name}
                </div>
                <div>{gaugeTotalVotes}</div>
              </div>
            </dl>
          </DataListItem>
        </div>
      </Fragment>
    </>
  );
};
