import React from "react";
import { Token } from "../../types/tokens";
import { NumberFormat, formatterUtils } from "@aragon/ods";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { formatUnits } from "viem";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

export const StakeUserStats: React.FC = () => {
  const { vp: token1Vp } = useGetAccountVp(Token.TOKEN_1);
  const { vp: token2Vp } = useGetAccountVp(Token.TOKEN_2);

  const balanceToken1 = formatterUtils.formatNumber(formatUnits(token1Vp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const balanceToken2 = formatterUtils.formatNumber(formatUnits(token2Vp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  return (
    <aside className="flex w-full flex-col gap-y-4 md:mt-7 md:gap-y-6">
      <dl className="divide-y divide-neutral-100">
        <div className="flex flex-col items-baseline gap-y-2 py-3 lg:gap-x-6 lg:py-4">
          <dt className="line-clamp-1 shrink-0 text-xl leading-tight text-neutral-800 lg:line-clamp-6">
            <h2>
              <span className="text-neutral-900">Your active</span> voting power
            </h2>
          </dt>
        </div>

        <div className="grid grid-cols-2 gap-y-3 py-3">
          <p>{TOKEN_1_NAME}</p>
          <p className="text-neutral-900">{balanceToken1}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 py-3">
          <p>{TOKEN_2_NAME}</p>
          <p className="text-neutral-900">{balanceToken2}</p>
        </div>
      </dl>
    </aside>
  );
};
