import { Button } from "@/components/odsModified/button";
import { voted } from "@/plugins/snapshot-voting/services/proposals/query-options";
import { mapProposalChoice } from "@/plugins/snapshot-voting/services/snapshot/utils";
import { capitalizeFirstLetter } from "@/utils/case";
import { AlertInline, Progress, RadioCard, RadioGroup, TextArea } from "@aragon/ods";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useState } from "react";
import { useAccount } from "wagmi";
import { type VotingCta } from "./types";

type Choices = "yes" | "approve" | "no" | "veto" | "abstain" | "reject";

export interface IBreakdownMajorityVotingResult {
  votingScores: { option: string; voteAmount: string; votePercentage: number; tokenSymbol: string }[];
  cta?: VotingCta;
  proposalId: string;
}

const choiceClassNames: Record<Choices, string> = {
  yes: "*:bg-success-500",
  approve: "*:bg-success-500",
  abstain: "*:bg-neutral-400",
  no: "*:bg-critical-500",
  veto: "*:bg-critical-500",
  reject: "*:bg-critical-500",
};

const choiceTextClassNames: Record<Choices, string> = {
  yes: "text-success-800",
  approve: "text-success-800",
  abstain: "text-neutral-800",
  no: "text-critical-800",
  veto: "text-critical-800",
  reject: "text-critical-800",
};

export const BreakdownMajorityVotingResult: React.FC<IBreakdownMajorityVotingResult> = (props) => {
  const { cta, votingScores, proposalId } = props;

  const { address } = useAccount();

  const { data: previousVote } = useQuery({
    ...voted({ address: address!, proposalId }),
    select: (data) => ({ ...data.vote, choice: mapProposalChoice(data.vote.vote) }),
  });

  const [showOptions, setShowOptions] = useState(false);
  const [justification, setJustification] = useState<string>(previousVote?.reason ?? "");
  const [option, setOption] = useState<string>(
    previousVote?.choice
      ? (votingScores.findIndex((s) => s.option.toLowerCase() === previousVote?.choice.toLowerCase()) + 1).toString()
      : ""
  );

  const handleVoteClick = () => {
    if (showOptions) {
      cta?.onClick?.(parseInt(option ?? "0"), justification.trim());
      setShowOptions(false);
      setJustification("");
      setOption("");
    } else {
      setShowOptions(true);
    }
  };

  const label = showOptions && !cta?.isLoading ? "Submit vote" : cta?.label;
  const disabled = (!!showOptions && !option) || cta?.disabled;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-3 rounded-xl border border-neutral-100 p-3 shadow-neutral-sm md:flex-row md:gap-x-6 md:p-6">
        {votingScores.map((choice, index) => (
          <div className="flex flex-1 flex-col gap-y-3 md:flex-row md:gap-x-6" key={choice.option}>
            <div className="flex flex-1 flex-col gap-y-2 py-1 md:gap-y-3 md:py-0">
              <span
                className={classNames(
                  "capitalize leading-tight md:text-lg",
                  choiceTextClassNames[choice.option as Choices]
                )}
              >
                {choice.option}
              </span>
              <Progress value={choice.votePercentage} className={choiceClassNames[choice.option as Choices]} />
              <div className="flex gap-x-1">
                <span className="text-neutral-800">{choice.voteAmount}</span>
                <span className="text-neutral-500">{choice.tokenSymbol}</span>
              </div>
            </div>
            {index < votingScores.length - 1 && <div className="h-0.25 bg-neutral-100 md:h-auto md:w-0.25" />}
          </div>
        ))}
      </div>

      {/* Options */}
      {showOptions && (
        <div className="flex flex-col gap-y-3 pt-3">
          <div className="flex flex-col gap-y-6">
            <RadioGroup
              value={option}
              onValueChange={(value) => setOption(value)}
              label="Choose your option"
              helpText="To vote, select one of the following options and confirm in your wallet. Once signed, your vote will be counted and displayed."
            >
              {votingScores?.map((choice, index) => {
                const parsedChoice = capitalizeFirstLetter(choice.option);
                return (
                  <RadioCard
                    key={choice.option}
                    label={parsedChoice}
                    description={`Your choice will be counted for "${parsedChoice}"`}
                    value={(index + 1).toString()}
                  />
                );
              })}
            </RadioGroup>
            <TextArea
              label="Add your justification"
              helpText="Add a brief statement supporting your choice"
              isOptional={true}
              maxLength={1000}
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
              }}
            />
          </div>
        </div>
      )}
      {/* Button group */}
      {cta && (
        <div className="flex w-full flex-col gap-y-4 md:flex-row md:gap-x-4">
          {!cta.alert && !cta.disabled && (
            <Button size="md" disabled={disabled} onClick={handleVoteClick} isLoading={cta.isLoading}>
              {label}
            </Button>
          )}

          {cta.alert && <AlertInline message={cta.alert} className="py-2" />}

          {showOptions && (
            <Button size="md" onClick={() => setShowOptions(false)} variant="tertiary">
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
