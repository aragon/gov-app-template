import { Button, DateFormat, formatterUtils, Tag, Tooltip } from "@aragon/ods";
import { useBeginWithdrawal } from "../../hooks/useBeginWithdrawal";
import { useWithdraw } from "../../hooks/useWithdrawToken";
import { type Token } from "../../types/tokens";
import { useGetCooldown } from "../../hooks/useGetCooldown";
import { useCanExit } from "../../hooks/useCanExit";
import { useGetWarmingPeriod } from "../../hooks/useGetWarmingPeriod";
import { useQueryClient } from "@tanstack/react-query";
import { useGetVp } from "../../hooks/useGetVp";
import { useGetNextEpochIn } from "../../hooks/useGetNextEpochIn";
import { useApproveNFT } from "../../hooks/useApproveNFT";
import { useEffect, useState } from "react";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { useNow } from "../../hooks/useNow";
import { useIsVoting } from "../../hooks/useIsVoting";
import { useIsVotingActive } from "../../hooks/useIsVotingActive";

type TokenActionProps = {
  tokenId: bigint;
  token: Token;
  created: number;
};

enum TokenActionStatus {
  Loading = "loading",
  Claimable = "claimable",
  InWarmup = "inWarmup",
  InCooldown = "inCooldown",
  Inactive = "inactive",
  ActiveWithLockedVotes = "activeWithLockedVotes",
  Active = "active",
}

export const TokenAction = ({ tokenId, token, created }: TokenActionProps) => {
  const queryClient = useQueryClient();

  const { now, getRelativeTime } = useNow();
  const { data: vp, isLoading: vpLoading, queryKey: vpQueryKey } = useGetVp(token, tokenId);
  const { data: cooldown, isLoading: cooldownLoading, queryKey: cooldownQueryKey } = useGetCooldown(token, tokenId);
  const { data: warmingPeriod, isLoading: warmingPeriodLoading } = useGetWarmingPeriod(token);
  const { data: nextEpochIn, isLoading: nextEpochTsLoading } = useGetNextEpochIn(token, BigInt(created / 1000));
  const { data: canExit, isLoading: canExitLoading, queryKey: canExitQueryKey } = useCanExit(token, tokenId);
  const { queryKey: ownedQueryKey } = useOwnedTokens(token, false);
  const { isVoting, isLoading: isVotingLoading } = useIsVoting(token, tokenId);
  const { isVotingActive, isLoading: isVotingActiveLoading } = useIsVotingActive(token);

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["exitQueue", token] });
    await queryClient.invalidateQueries({ queryKey: ownedQueryKey });
    await queryClient.invalidateQueries({ queryKey: canExitQueryKey });
    await queryClient.invalidateQueries({ queryKey: cooldownQueryKey });
    await queryClient.invalidateQueries({ queryKey: vpQueryKey });
  };

  const { beginWithdrawal, isConfirming: isConfirmingBeginWithdraw } = useBeginWithdrawal(
    token,
    tokenId,
    invalidateQueries
  );
  const { approveNFT, isConfirming: isConfirmingApproval } = useApproveNFT(token, tokenId, beginWithdrawal);

  const { withdraw, isConfirming: isConfirmingWithdraw } = useWithdraw(token, tokenId, invalidateQueries);

  const [status, setStatus] = useState<TokenActionStatus>(TokenActionStatus.Loading);
  const [nextPeriodDate, setNextPeriodDate] = useState(0);

  const relativeTime = getRelativeTime(nextPeriodDate, DateFormat.DURATION);

  const nextPeriodDateTime = formatterUtils.formatDate(nextPeriodDate, {
    format: DateFormat.YEAR_MONTH_DAY_TIME,
  });

  const isLoading =
    vpLoading ||
    cooldownLoading ||
    warmingPeriodLoading ||
    nextEpochTsLoading ||
    canExitLoading ||
    isVotingLoading ||
    isVotingActiveLoading;

  useEffect(() => {
    const warmingPeriodDate = created + Math.max(Number(warmingPeriod ?? 0), Number(nextEpochIn ?? 0)) * 1000;
    const exitDate = Number(cooldown?.exitDate ?? 0) * 1000;

    const nextPeriodDate = exitDate ? exitDate : warmingPeriodDate;
    setNextPeriodDate(nextPeriodDate);

    const inWarmup = now <= warmingPeriodDate;
    const inCooldown = !!exitDate;
    const claimable = !!canExit;

    if (isLoading) {
      setStatus(TokenActionStatus.Loading);
    } else if (claimable) {
      setStatus(TokenActionStatus.Claimable);
    } else if (inWarmup) {
      setStatus(TokenActionStatus.InWarmup);
    } else if (inCooldown) {
      setStatus(TokenActionStatus.InCooldown);
    } else if (!vp) {
      setStatus(TokenActionStatus.Inactive);
    } else if (isVoting && !isVotingActive) {
      setStatus(TokenActionStatus.ActiveWithLockedVotes);
    } else {
      setStatus(TokenActionStatus.Active);
    }
  }, [vp, cooldown, canExit, warmingPeriod, nextEpochIn, now, created, isVoting, isVotingActive, isLoading]);

  switch (status) {
    case TokenActionStatus.Loading:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <Tag label="..." variant="neutral" className="rounded-[8px] normal-case [&>p]:px-2" />
          <Button className="pt-[2px]" size="sm" variant="secondary" disabled={true} isLoading={true}>
            Loading
          </Button>
        </div>
      );
    case TokenActionStatus.Claimable:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <Tag label="Claimable" variant="critical" className="rounded-[8px] normal-case [&>p]:px-[1px]" />
          <Button
            size="sm"
            className="pt-[2px]"
            variant="secondary"
            onClick={withdraw}
            isLoading={isConfirmingWithdraw}
          >
            Withdraw
          </Button>
        </div>
      );
    case TokenActionStatus.InWarmup:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <Tag label="In warmup" variant="info" className="rounded-[8px] normal-case [&>p]:px-[1px]" />
            <Tooltip content={nextPeriodDateTime}>
              <p className="text-xs lowercase text-neutral-700">{relativeTime} left</p>
            </Tooltip>
          </div>
          <Tooltip
            content={
              <div>
                <p>You can unstake after the warming period ends</p>
              </div>
            }
          >
            <Button className="pt-[2px]" size="sm" variant="secondary" disabled={true}>
              Unstake
            </Button>
          </Tooltip>
        </div>
      );
    case TokenActionStatus.InCooldown:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <Tag label="In cooldown" variant="success" className="rounded-[8px] normal-case [&>p]:px-[1px]" />
            <Tooltip content={nextPeriodDateTime}>
              <p className="text-xs lowercase text-neutral-700">{relativeTime} left</p>
            </Tooltip>
          </div>
          <Tooltip
            content={
              <div>
                <p>You can withdraw after the cooldown period ends</p>
              </div>
            }
          >
            <Button className="pt-[2px]" size="sm" variant="secondary" disabled={true}>
              Withdraw
            </Button>
          </Tooltip>
        </div>
      );
    case TokenActionStatus.Inactive:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <Tag
            label="Inactive"
            variant="neutral"
            className="rounded-[8px] normal-case [&>p]:px-[1px] [&>p]:text-neutral-700"
          />
          <Button className="pt-[2px]" size="sm" variant="secondary" disabled={true}>
            Claimed
          </Button>
        </div>
      );
    case TokenActionStatus.ActiveWithLockedVotes:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <Tag
            label="Active"
            className="rounded-[8px] bg-primary-900 normal-case [&>p]:px-[1px] [&>p]:text-neutral-0"
          />
          <Tooltip
            content={
              <div>
                <p>You can unstake when the next voting window starts</p>
              </div>
            }
          >
            <Button className="pt-[2px]" size="sm" variant="secondary" disabled={true}>
              Unstake
            </Button>
          </Tooltip>
        </div>
      );
    case TokenActionStatus.Active:
      return (
        <div className="flex items-center justify-between gap-x-4">
          <Tag
            label="Active"
            className="rounded-[8px] bg-primary-900 normal-case [&>p]:px-[1px] [&>p]:text-neutral-0"
          />
          <Button
            className="pt-[2px]"
            size="sm"
            variant="secondary"
            onClick={approveNFT}
            isLoading={isConfirmingApproval || isConfirmingBeginWithdraw}
          >
            Unstake
          </Button>
        </div>
      );
  }
};
