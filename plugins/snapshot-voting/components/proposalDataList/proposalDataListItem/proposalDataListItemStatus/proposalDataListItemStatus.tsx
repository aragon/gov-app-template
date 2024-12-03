import classNames from "classnames";

import { type IProposalDataListItemStructureProps, type ProposalStatus } from "../proposalDataListItemStructure";
import {
  type TagVariant,
  type StatePingAnimationVariant,
  type ModulesCopy,
  formatterUtils,
  DateFormat,
  useOdsModulesContext,
  Rerender,
  AvatarIcon,
  IconType,
  StatePingAnimation,
} from "@aragon/ods";
import React from "react";
import { Tag } from "@/components/odsModified/tag";

export type IProposalDataListItemStatusProps = Pick<IProposalDataListItemStructureProps, "date" | "status" | "voted">;

const statusToTagVariant: Record<ProposalStatus, TagVariant> = {
  accepted: "success",
  active: "info",
  challenged: "warning",
  draft: "neutral",
  executed: "success",
  expired: "critical",
  failed: "critical",
  partiallyExecuted: "warning",
  pending: "neutral",
  queued: "success",
  rejected: "critical",
  vetoed: "warning",
};

type OngoingProposalStatus = "active" | "challenged" | "vetoed";

const ongoingStatusToPingVariant: Record<OngoingProposalStatus, StatePingAnimationVariant> = {
  active: "info",
  challenged: "warning",
  vetoed: "warning",
};

const getFormattedProposalDate = (date: string | number, now: number, copy: ModulesCopy) => {
  const formattedDuration = formatterUtils.formatDate(date, { format: DateFormat.DURATION });

  const suffix =
    new Date(date).getTime() > now ? copy.proposalDataListItemStatus.left : copy.proposalDataListItemStatus.ago;

  return `${formattedDuration} ${suffix}`;
};

export const ProposalDataListItemStatus: React.FC<IProposalDataListItemStatusProps> = (props) => {
  const { date, status, voted } = props;

  const ongoing = status === "active" || status === "challenged" || status === "vetoed";
  const ongoingAndVoted = ongoing && voted;
  const showStatusMetadata = status !== "draft";

  const { copy } = useOdsModulesContext();

  return (
    <div className="flex items-center gap-x-4 md:gap-x-6">
      <Tag label={status} variant={statusToTagVariant[status]} className="shrink-0 capitalize" />
      {showStatusMetadata && (
        <div className="flex flex-1 items-center justify-end gap-x-2 md:gap-x-3">
          <span
            className={classNames("text-sm leading-tight md:text-base", {
              "text-info-800": status === "active",
              "text-warning-800": status === "challenged" || status === "vetoed",
              "text-neutral-800": ongoing === false,
            })}
          >
            {ongoingAndVoted && copy.proposalDataListItemStatus.voted}
            {!ongoingAndVoted && date != null && (
              <Rerender>{(now) => getFormattedProposalDate(date, now, copy)}</Rerender>
            )}
          </span>
          {ongoingAndVoted && <AvatarIcon icon={IconType.CHECKMARK} responsiveSize={{ md: "md" }} />}
          {ongoing && !voted && <StatePingAnimation variant={ongoingStatusToPingVariant[status]} />}
          {!ongoing && !voted && date && <AvatarIcon icon={IconType.CALENDAR} responsiveSize={{ md: "md" }} />}
        </div>
      )}
    </div>
  );
};
