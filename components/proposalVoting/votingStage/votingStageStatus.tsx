import { ElseIf, If, Then } from "@/components/if";
import { AvatarIcon, IconType, ProposalStatus, Spinner, StatePingAnimation } from "@aragon/gov-ui-kit";

interface IVotingStageStatus {
  endDate: string;
  status: ProposalStatus; // "pending" | "active" | "accepted" | "rejected" | "unreached";
}

export const VotingStageStatus: React.FC<IVotingStageStatus> = (props) => {
  const { endDate, status } = props;

  return (
    <div className="flex items-center gap-x-2 text-lg leading-tight">
      <If val={status} is={"pending"}>
        <Then>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-800">Stage</span>
            <span className="flex-grow truncate text-neutral-500">is pending</span>
          </div>
          <Spinner size="md" variant="neutral" className="shrink-0" />
        </Then>
        <ElseIf all={[status === ProposalStatus.ACTIVE, endDate]}>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-primary-500">{endDate}</span>&nbsp;
            <span className="flex-grow truncate text-neutral-500">left to participate</span>
          </div>
          <StatePingAnimation variant="primary" className="shrink-0" />
        </ElseIf>
        <ElseIf val={status} is={ProposalStatus.ACCEPTED}>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-500">The proposal has been</span>
            <span className="flex-grow truncate text-success-200">accepted</span>
          </div>
          <AvatarIcon size="sm" variant="success" icon={IconType.CHECKMARK} className="shrink-0" />
        </ElseIf>
        <ElseIf true={[ProposalStatus.REJECTED, ProposalStatus.VETOED].includes(status)}>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-500">The proposal has been</span>
            <span className="flex-grow truncate text-negative-200">rejected</span>
          </div>
          <AvatarIcon size="sm" variant="critical" icon={IconType.CLOSE} className="shrink-0" />
        </ElseIf>
        {
          // TODO here was 'unreached', is PENDING good alternative?
        }
        <ElseIf val={status} is={ProposalStatus.PENDING}>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-800">Stage</span>
            <span className="flex-grow truncate text-neutral-500">not reached</span>
          </div>
          <AvatarIcon size="sm" variant="neutral" icon={IconType.CLOSE} className="shrink-0" />
        </ElseIf>
      </If>
    </div>
  );
};
