import { If } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { useEpochs } from "@/hooks/useEpochs";
import { Heading, DefinitionListContainer, DefinitionListItem } from "@aragon/gov-ui-kit";
import { useEffect, useState } from "react";
import { formatUnits, type Address } from "viem";

export interface IVotingDetailsProps {
  startDate?: string;
  endDate: string;
  tokenAddress?: Address;
  options: string;
  strategy: string;
  snapshotEpoch: bigint | undefined;
  quorum: string | undefined;
  supportThreshold?: string | undefined;
  totalReward?: bigint | undefined;
}

export const VotingDetails: React.FC<IVotingDetailsProps> = (props) => {
  const { startDate, endDate, snapshotEpoch, tokenAddress, options, strategy, supportThreshold, quorum, totalReward } =
    props;

  const { getStartAndEndDateOfEpoch, formatEpochDate } = useEpochs();
  const [epochStartDate, setEpochStartDate] = useState<number>();
  const [epochEndDate, setEpochEndDate] = useState<number>();

  useEffect(() => {
    if (!snapshotEpoch) {
      return;
    }

    const startAndEndDateOfEpoch = getStartAndEndDateOfEpoch(Number(snapshotEpoch));
    if (!startAndEndDateOfEpoch) {
      return;
    }
    setEpochStartDate(startAndEndDateOfEpoch[0]);
    setEpochEndDate(startAndEndDateOfEpoch[1]);
  }, [snapshotEpoch]);

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <Heading size="h4">Voting</Heading>
        <DefinitionListContainer className="">
          <If true={startDate}>
            <DefinitionListItem term="Starting" className="!gap-y-1">
              <div className="w-full text-neutral-800 md:text-right">{startDate}</div>
            </DefinitionListItem>
          </If>
          <DefinitionListItem term="Ending" className="!gap-y-1">
            <div className="w-full text-neutral-800 md:text-right">{endDate}</div>
          </DefinitionListItem>
          {epochStartDate && epochEndDate && (
            <DefinitionListItem term="Census epoch" className="!gap-y-1">
              <div className="w-full text-neutral-800 md:text-right">
                Epoch {snapshotEpoch}
                <span className="text-xs text-neutral-200">
                  {" "}
                  ({formatEpochDate(epochStartDate)}-{formatEpochDate(epochEndDate)})
                </span>
              </div>
            </DefinitionListItem>
          )}
          {totalReward !== undefined && (
            <DefinitionListItem term="Total distibuted voting reward" className="!gap-y-1">
              <div className="w-full text-neutral-800 md:text-right">{formatUnits(totalReward, 18)} vePWN</div>
            </DefinitionListItem>
          )}
        </DefinitionListContainer>
      </div>
      <div>
        <Heading size="h4">Governance Settings</Heading>
        <DefinitionListContainer>
          <If true={!!tokenAddress}>
            <DefinitionListItem term="Token contract" className="!gap-y-1">
              <div className="w-full text-ellipsis text-neutral-800 md:text-right">
                <AddressText>{tokenAddress}</AddressText>
              </div>
            </DefinitionListItem>
          </If>
          <DefinitionListItem term="Strategy" className="!gap-y-1">
            <div className="w-full text-neutral-800 md:text-right">{strategy}</div>
          </DefinitionListItem>
          <DefinitionListItem term="Voting options" className="!gap-y-1">
            <div className="w-full text-neutral-800 md:text-right">{options}</div>
          </DefinitionListItem>
          {supportThreshold && (
            <DefinitionListItem term="Threshold to pass" className="!gap-y-1">
              <div className="w-full text-neutral-800 md:text-right">{supportThreshold}</div>
            </DefinitionListItem>
          )}
          {quorum && (
            <DefinitionListItem term="Quorum" className="!gap-y-1">
              <div className="w-full text-neutral-800 md:text-right">{quorum}</div>
            </DefinitionListItem>
          )}
        </DefinitionListContainer>
      </div>
    </div>
  );
};
