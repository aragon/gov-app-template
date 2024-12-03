import { DataListItem, DateFormat, formatterUtils, NumberFormat } from "@aragon/ods";
import Image from "next/image";
import { formatUnits } from "viem";
import { useGetVp } from "../../hooks/useGetVp";
import { useTokenInfo } from "../../hooks/useTokenInfo";
import { Token } from "../../types/tokens";
import { type VeTokenItem } from "./types";
import { epochsSince } from "./utils";
import { TokenAction } from "./ve-token-action";
import { Fragment } from "react";
import { useNow } from "../../hooks/useNow";
import { useGetPoint } from "../../hooks/useGetPoint";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

type VePositionItemProps = {
  props: VeTokenItem;
};

export const VePositionItem: React.FC<VePositionItemProps> = ({ props }) => {
  const id = props.id;
  const token = props.token;
  const { tokenInfo, isLoading: infoLoading } = useTokenInfo(token, id);
  const { data: vp, isLoading: vpLoading } = useGetVp(token, id);
  const { now, getRelativeTime } = useNow();
  const { point: depositPoint } = useGetPoint(token, id, 1n);

  const isLoading = infoLoading || vpLoading;

  const amountVal = Number(formatUnits(tokenInfo?.amount ?? 0n, 18));
  const vpVal = Number(formatUnits(vp ?? 0n, 18));

  const multiplierVal = Math.max(vpVal / (amountVal || 1), 1);

  const amount = tokenInfo?.amount
    ? formatterUtils.formatNumber(amountVal, {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
      })
    : null;
  const created = Number(depositPoint?.writtenTs ?? 0) * 1000;

  const symbol = token === Token.TOKEN_1 ? TOKEN_1_NAME : TOKEN_2_NAME;
  const multiplier = tokenInfo?.amount
    ? formatterUtils.formatNumber(multiplierVal, {
        format: NumberFormat.TOKEN_AMOUNT_SHORT,
      })
    : null;

  const strEpochs = epochsSince(created, now);
  const relativeTime = getRelativeTime(created, DateFormat.RELATIVE);

  return (
    <Fragment>
      <div className="hidden md:block">
        <DataListItem key={id.toString()} className="flex items-center gap-x-4 border border-neutral-100 p-4">
          <p className="flex w-16 flex-auto items-center gap-x-3">
            <Image
              className="w-8"
              alt="Token icon"
              width={32}
              height={32}
              src={token === Token.TOKEN_1 ? "/token-1-icon.png" : "/token-2-icon.png"}
            />
            {id.toString()}
          </p>
          {amount ? (
            <p className="w-32 flex-auto text-neutral-900">
              {amount}&nbsp;
              <span className="title text-xs text-neutral-700">{symbol}</span>
            </p>
          ) : (
            <p className="w-32 flex-auto">-</p>
          )}
          <p className="w-32 flex-auto lowercase">{multiplier ? `${multiplier}x` : "-"}</p>
          <p className="w-32 flex-auto lowercase">
            {strEpochs !== "0" && strEpochs !== "-" ? (
              <>
                {strEpochs} {strEpochs === "1" ? "epoch" : "epochs"}
                <br />
                <p className="text-xs lowercase text-neutral-200">{relativeTime}</p>
              </>
            ) : (
              <span>-</span>
            )}
          </p>
          <div className="w-48 flex-auto">
            {isLoading ? (
              <div className="flex w-48 flex-auto items-center justify-between gap-x-4">
                <p className="flex items-center justify-between gap-x-4">-</p>;
              </div>
            ) : (
              <TokenAction tokenId={id} token={token} created={created} />
            )}
          </div>
        </DataListItem>
      </div>
      <div className="md:hidden">
        <DataListItem key={id.toString()} className="my-2 border border-neutral-100 px-4 py-2">
          <dl className="flex flex-col divide-y divide-neutral-100">
            <div className="flex justify-between py-2">
              <div className="mb-1 flex gap-x-4">
                <Image
                  className="-mt-1"
                  alt="Token icon"
                  width={32}
                  height={32}
                  src={token === Token.TOKEN_1 ? "/token-1-icon.png" : "/token-2-icon.png"}
                />
                <p>{id.toString()}</p>
              </div>
              {amount ? (
                <p className="w-32 flex-auto text-neutral-900">
                  {amount}&nbsp;
                  <span className="text-xs">{symbol}</span>
                </p>
              ) : (
                <p className="w-32 flex-auto">-</p>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="">
                <small>MULTIPLIER</small>
                <br />
                {multiplier ? `${multiplier}x` : "-"}
              </div>
              <div className="text-right">
                <small>AGE</small>
                <br />
                {strEpochs !== "-" ? (
                  <>
                    {strEpochs} {strEpochs === "1" ? "epoch" : "epochs"}
                    <br />
                    <small className="text-neutral-200">{relativeTime}</small>
                  </>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
            <div className="pt-5">
              {isLoading ? (
                <div className="flex w-48 flex-auto items-center justify-between gap-x-4">
                  <p className="flex items-center justify-between gap-x-4">-</p>;
                </div>
              ) : (
                <TokenAction tokenId={id} token={token} created={created} />
              )}
            </div>
          </dl>
        </DataListItem>
      </div>
    </Fragment>
  );
};
