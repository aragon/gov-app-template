import { AccordionContainer, Card, Heading } from "@aragon/ods";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React from "react";
import type { IBreakdownMajorityVotingResult } from "./votingBreakdown";
import { VotingStage, type IVotingStageDetails, type IVotingStageProps } from "./votingStage/votingStage";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export interface ITransformedStage {
  id: string;
  title: string;
  status: string;
  disabled?: boolean;
  proposalId?: string;
  providerId?: string;
  result: IBreakdownMajorityVotingResult;
  details?: IVotingStageDetails;
}

interface IProposalVotingProps {
  stages: ITransformedStage[];
}

export const ProposalVoting: React.FC<IProposalVotingProps> = ({ stages }) => {
  const defaultStage = stages.length === 1 ? "Stage 1" : "";

  return (
    <Card className="overflow-hidden rounded-xl bg-neutral-0 shadow-neutral">
      {/* Header */}
      <div className="flex flex-col gap-y-2 p-6">
        <Heading size="h2">Voting</Heading>
        <p className="text-lg leading-normal text-neutral-500">
          The proposal must pass the community voting stage to be accepted.
        </p>
      </div>
      {/* Stages */}
      <AccordionContainer isMulti={false} className="border-t border-t-neutral-100" defaultValue={defaultStage}>
        {stages.map((stage, index) => (
          <VotingStage
            key={stage.id}
            {...({ ...stage, number: stages.length > 1 ? index + 1 : null } as IVotingStageProps)}
          />
        ))}
      </AccordionContainer>
    </Card>
  );
};
