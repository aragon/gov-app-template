import { Avatar, DataListItem, formatterUtils, NumberFormat, Tag } from "@aragon/ods";

import { VotingDialog } from "../voting-dialog";
import { type GaugeItem } from "../gauges-list/types";
import { Token } from "../../types/tokens";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { formatUnits } from "viem";
import { useGetUsedVp } from "../../hooks/useGetUsedVp";
import { useAccount } from "wagmi";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

type VotingBarProps = {
  selectedGauges: GaugeItem[];
  onRemove: (gauge: GaugeItem) => void;
};

export const VotingBar: React.FC<VotingBarProps> = ({ selectedGauges, onRemove }) => {
  const { isConnected } = useAccount();

  const { ownedTokens: token1OwnedTokensData } = useOwnedTokens(Token.TOKEN_1);
  const { ownedTokens: token2OwnedTokensData } = useOwnedTokens(Token.TOKEN_2);

  const token1OwnedTokens = [...(token1OwnedTokensData ?? [])];
  const token2OwnedTokens = [...(token2OwnedTokensData ?? [])];

  const { data: usedToken1Vp } = useGetUsedVp(Token.TOKEN_1, token1OwnedTokens);
  const { data: usedToken2Vp } = useGetUsedVp(Token.TOKEN_2, token2OwnedTokens);

  const { vp: token1VpBn } = useGetAccountVp(Token.TOKEN_1);
  const { vp: token2VpBn } = useGetAccountVp(Token.TOKEN_2);

  if (!isConnected) {
    return null;
  }

  const hasVp = !(token1VpBn === 0n && token2VpBn === 0n);

  const token1Vp = formatUnits(token1VpBn ?? 0n, 18);
  const token2Vp = formatUnits(token2VpBn ?? 0n, 18);

  const formattedToken1Vp = formatterUtils.formatNumber(token1Vp, {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const formattedToken2Vp = formatterUtils.formatNumber(token2Vp, {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const token1Percentage = Number(token1Vp) ? Number(formatUnits(usedToken1Vp ?? 0n, 18)) / Number(token1Vp) : 0;
  const token2Percentage = Number(token2Vp) ? Number(formatUnits(usedToken2Vp ?? 0n, 18)) / Number(token2Vp) : 0;

  const formattedToken1Percentage = formatterUtils.formatNumber(token1Percentage, {
    format: NumberFormat.PERCENTAGE_SHORT,
  });
  const formattedToken2Percentage = formatterUtils.formatNumber(token2Percentage, {
    format: NumberFormat.PERCENTAGE_SHORT,
  });

  const voted = (usedToken1Vp ?? 0n) > 0n || (usedToken2Vp ?? 0n) > 0n;

  return (
    <div className="sticky -bottom-2 -mb-12 md:-mx-8">
      <DataListItem>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8 md:py-2">
          <p className="title flex text-sm text-neutral-900">Your total voting power</p>
          <div className="flex flex-grow flex-row gap-8">
            <div className="flex flex-row items-center gap-2">
              <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/token-1-icon.png" />
              <p className="text-md md:text-base">
                {formattedToken1Vp} {TOKEN_1_NAME}
              </p>
              {token1Percentage > 0 && <p className="hidden sm:block">({formattedToken1Percentage} used)</p>}
            </div>
            <div className="flex flex-row items-center gap-2">
              <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/token-2-icon.png" />
              <p className="text-md md:text-base">
                {formattedToken2Vp} {TOKEN_2_NAME}
              </p>
              {token2Percentage > 0 && <p className="hidden sm:block">({formattedToken2Percentage} used)</p>}
            </div>
          </div>

          <div className="absolute right-3 top-4 md:relative md:right-0 md:top-0 md:flex md:flex-row md:gap-2">
            {hasVp &&
              (voted || !!selectedGauges.length ? (
                <Tag label={`${selectedGauges.length} selected`} />
              ) : (
                <Tag label="Select gauges" />
              ))}
          </div>
          <VotingDialog voted={voted} selectedGauges={selectedGauges} onRemove={(gauge) => onRemove(gauge)} />
        </div>
      </DataListItem>
    </div>
  );
};
