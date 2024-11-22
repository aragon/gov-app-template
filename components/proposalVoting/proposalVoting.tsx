import { AccordionContainer, Card, Heading } from "@aragon/gov-ui-kit";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React from "react";
import { VotingStage, type IVotingStageProps } from "./votingStage/votingStage";
import type { ITransformedStage } from "@/utils/types";

dayjs.extend(utc);
dayjs.extend(relativeTime);

interface IProposalVotingProps {
  stages: ITransformedStage[];
  description: string;
  totalReward?: bigint;
  isVeto: boolean;
}

export const ProposalVoting: React.FC<IProposalVotingProps> = ({
  stages,
  description,
  totalReward = undefined,
  isVeto,
}) => {
  return (
    <Card className="overflow-hidden  bg-neutral-0 shadow-neutral">
      {/* Header */}
      <div className="flex flex-col gap-y-2 p-6">
        <Heading size="h2">{isVeto ? "Vetoing" : "Voting"}</Heading>
        <p className="text-lg leading-normal text-neutral-500">{description}</p>
      </div>
      {/* Stages */}
      <AccordionContainer isMulti={false} defaultValue="Stage 1" className="border-t border-t-neutral-100">
        {stages.map((stage, index) => (
          <VotingStage
            totalReward={totalReward}
            key={stage.id}
            {...({ ...stage, number: index + 1 } as IVotingStageProps)}
            showStageKey={false}
          />
        ))}
      </AccordionContainer>
    </Card>
  );
};
