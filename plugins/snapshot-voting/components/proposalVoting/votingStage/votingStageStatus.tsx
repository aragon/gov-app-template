import { ProposalStatus } from "@/plugins/snapshot-voting/services/snapshot/domain";
import { AvatarIcon, IconType, Spinner, StatePingAnimation } from "@aragon/ods";

interface IVotingStageStatus {
  endDate: string;
  status: ProposalStatus | "unreached";
}

export const VotingStageStatus: React.FC<IVotingStageStatus> = (props) => {
  const { endDate, status } = props;

  const stageAboutToEnd = parseInt(endDate) === 0;

  return (
    <div className="flex items-center gap-x-2 text-lg leading-tight">
      {status === ProposalStatus.PENDING && (
        <>
          <div className="flex flex-grow">
            <span className="shrink-0 text-neutral-800">Stage</span>
            &nbsp;
            <span className="flex-grow truncate text-neutral-500">is pending</span>
          </div>
          <Spinner size="md" variant="neutral" className="shrink-0" />
        </>
      )}
      {status === ProposalStatus.ACTIVE && endDate && !stageAboutToEnd && (
        <>
          <div className="flex flex-grow">
            <span className="shrink-0 text-primary-500">{endDate}</span>
            &nbsp;
            <span className="flex-grow truncate text-neutral-500">left to vote</span>
          </div>
          <StatePingAnimation variant="primary" className="shrink-0" />
        </>
      )}
      {status === ProposalStatus.ACTIVE && endDate && stageAboutToEnd && (
        <>
          <div className="flex flex-grow">
            <span className="shrink-0 text-neutral-500">Advancing to next stage</span>
          </div>
          <Spinner size="md" variant="neutral" className="shrink-0" />
        </>
      )}
      {status === ProposalStatus.ACCEPTED && (
        <>
          <div className="flex flex-grow">
            <span className="shrink-0 text-neutral-500">Proposal has been</span>
            &nbsp;
            <span className="flex-grow truncate text-success-800">accepted</span>
          </div>
          <AvatarIcon size="sm" variant="success" icon={IconType.CHECKMARK} className="shrink-0" />
        </>
      )}
      {status === ProposalStatus.REJECTED && (
        <>
          <p className="flex flex-grow">
            <span className="shrink-0 text-neutral-500">Proposal has been</span>
            &nbsp;
            <span className="flex-grow truncate text-critical-800">rejected</span>
          </p>
          <AvatarIcon size="sm" variant="critical" icon={IconType.CLOSE} className="shrink-0" />
        </>
      )}
      {status === "unreached" && (
        <>
          <div className="flex flex-grow">
            <span className="shrink-0 text-neutral-800">Stage</span>
            &nbsp;
            <span className="flex-grow truncate text-neutral-500">not reached</span>
          </div>
          <AvatarIcon size="sm" variant="neutral" icon={IconType.CLOSE} className="shrink-0" />
        </>
      )}
    </div>
  );
};
