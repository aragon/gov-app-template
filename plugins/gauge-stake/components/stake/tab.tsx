import { Button, InputNumberMax, Toggle, ToggleGroup } from "@aragon/ods";
import { useEffect, useState } from "react";
import { useGetBalance } from "../../hooks/useGetBalance";
import { Token } from "../../types/tokens";
import { formatUnits, parseUnits } from "viem";
import { NumberFormat, formatterUtils } from "@aragon/ods";
import { useStakeToken } from "../../hooks/useStakeToken";
import { useQueryClient } from "@tanstack/react-query";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { useApproveToken } from "../../hooks/useApproveToken";
import { useGetMinDeposit } from "../../hooks/useGetMinDeposit";
import { useAccount } from "wagmi";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

type PercentValues = "" | "0" | "25" | "50" | "75" | "100";

interface IHeaderProps {
  token: Token;
  onStake?: () => void;
}

export const StakeToken: React.FC<IHeaderProps> = ({ token, onStake }) => {
  const { address } = useAccount();
  const [balanceToStake, setBalanceToStake] = useState<bigint>(0n);
  const [percentToggle, setPercentToggle] = useState<PercentValues>("0");
  const { data, queryKey: balanceQueryKey } = useGetBalance(token);
  const { queryKey: ownedTokensQueryKey } = useOwnedTokens(token, false);
  const { data: minAmountData } = useGetMinDeposit(token);
  const queryClient = useQueryClient();

  const { stakeToken, isConfirming: isConfirming1 } = useStakeToken(balanceToStake, token, async () => {
    await queryClient.invalidateQueries({ queryKey: balanceQueryKey });
    await queryClient.invalidateQueries({ queryKey: ownedTokensQueryKey });
    onStake?.();
  });

  const { approveToken, isConfirming: isConfirming2 } = useApproveToken(balanceToStake, token, stakeToken);

  const balance = BigInt(data?.balance ?? 0n);
  const decimals = Number(data?.decimals ?? 18);
  const minAmount = BigInt(minAmountData ?? 100n * 10n ** BigInt(decimals));
  const symbol = token === Token.TOKEN_1 ? TOKEN_1_NAME : TOKEN_2_NAME;
  const formattedBalance = data?.formattedBalance ?? "0";
  const formattedQuantity = formatterUtils.formatNumber(formattedBalance, { format: NumberFormat.TOKEN_AMOUNT_LONG });
  const formattedMinAmount = formatterUtils.formatNumber(formatUnits(minAmount, 18), {
    format: NumberFormat.TOKEN_AMOUNT_LONG,
  });

  const onBalanceEnter = (newBalance: string) => {
    const newValue = parseUnits(newBalance, decimals);

    if (newValue >= balance) {
      setBalanceToStake(balance);
      setPercentToggle("100");
    } else {
      setBalanceToStake(newValue);
    }
  };

  useEffect(() => {
    setBalanceToStake(balance);
    setPercentToggle("100");
  }, [balance]);

  useEffect(() => {
    if (!percentToggle) return;

    const newValue = (BigInt(balance) * BigInt(percentToggle)) / BigInt(100);
    setBalanceToStake(newValue);
  }, [percentToggle, balance]);

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      <InputNumberMax
        disabled={isConfirming1 || isConfirming2}
        max={Number(formatUnits(balance, decimals))}
        alert={
          !!balanceToStake && balanceToStake < minAmount
            ? { message: `The amount is too low (min ${formattedMinAmount} ${symbol})`, variant: "critical" }
            : undefined
        }
        value={
          formatterUtils.formatNumber(formatUnits(balanceToStake, decimals), {
            format: NumberFormat.TOKEN_AMOUNT_LONG,
          }) ?? ""
        }
        onChange={(v) => onBalanceEnter(v || "0")}
      />

      <ToggleGroup
        isMultiSelect={false}
        onChange={(v) => setPercentToggle(v as PercentValues)}
        value={percentToggle}
        className="flex justify-between"
      >
        <Toggle
          disabled={isConfirming1 || isConfirming2}
          value="0"
          label="None"
          className="hidden rounded-lg sm:block"
        />
        <Toggle disabled={isConfirming1 || isConfirming2} value="25" label="25%" className="rounded-lg" />
        <Toggle disabled={isConfirming1 || isConfirming2} value="50" label="50%" className="rounded-lg" />
        <Toggle disabled={isConfirming1 || isConfirming2} value="75" label="75%" className="rounded-lg" />
        <Toggle disabled={isConfirming1 || isConfirming2} value="100" label="100%" className="rounded-lg" />
      </ToggleGroup>
      <p className="mt-2 text-left">
        Your balance: {formattedQuantity} <span className="text-xs text-neutral-700">{symbol}</span>
      </p>
      <Button
        className="mt-2 w-full"
        disabled={address && balanceToStake < minAmount}
        onClick={approveToken}
        isLoading={isConfirming1 || isConfirming2}
      >
        Stake
      </Button>
    </div>
  );
};
