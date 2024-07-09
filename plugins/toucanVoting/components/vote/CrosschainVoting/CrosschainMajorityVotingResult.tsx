import { PUB_CHAIN_NAME, PUB_L2_CHAIN_NAME } from "@/constants";
import { readableChainName } from "@/utils/chains";
import { capitalizeFirstLetter } from "@/utils/text";
import { VotingCta } from "@/utils/types";
import { Button, Heading, Progress, RadioCard, RadioGroup } from "@aragon/ods";
import classNames from "classnames";
import { useEffect, useState } from "react";

type Choices = "yes" | "no" | "abstain";

export interface IBreakdownMajorityVotingResult {
  votingScores: { option: string; voteAmount: string; votePercentage: number; tokenSymbol: string }[];
  cta?: VotingCta;
}

const choiceClassNames: Record<Choices, string> = {
  yes: "*:bg-success-500",
  abstain: "*:bg-neutral-400",
  no: "*:bg-critical-500",
};

const choiceTextClassNames: Record<Choices, string> = {
  yes: "text-success-800",
  abstain: "text-neutral-800",
  no: "text-critical-800",
};

export const CrossChainMajorityVotingResult: React.FC<{
  l1: IBreakdownMajorityVotingResult;
  l2: IBreakdownMajorityVotingResult;
}> = (props) => {
  const { cta: ctaL1, votingScores: votingScoresL1 } = props.l1;
  const { cta: ctaL2, votingScores: votingScoresL2 } = props.l2;

  const [showOptions, setShowOptions] = useState(false);
  const [option, setOption] = useState<string>();

  const handleVoteClick = () => {
    if (showOptions || votingScoresL1.length === 1) {
      ctaL1?.onClick?.(parseInt(option ?? "0"));
    } else {
      setShowOptions(true);
    }
  };

  useEffect(() => {
    if (!!ctaL1?.disabled && !!option) {
      setShowOptions(false);
    }
  }, [ctaL1?.disabled, option]);

  const label = showOptions && !ctaL1?.isLoading ? "Submit vote" : ctaL1?.label;
  const disabled = (!!showOptions && !option) || ctaL1?.disabled;

  return (
    <div className="flex flex-col gap-y-4">
      <Heading size="h4">{readableChainName(PUB_CHAIN_NAME)}</Heading>
      <div className="flex flex-col gap-y-3 rounded-xl border border-neutral-100 p-3 shadow-neutral-sm md:flex-row md:gap-x-6 md:p-6">
        {votingScoresL1.map((choice, index) => (
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
            {index < votingScoresL1.length - 1 && <div className="h-0.25 bg-neutral-100 md:h-auto md:w-0.25" />}
          </div>
        ))}
      </div>
      <Heading size="h4">{readableChainName(PUB_L2_CHAIN_NAME)}</Heading>
      <div className="flex flex-col gap-y-3 rounded-xl border border-neutral-100 p-3 shadow-neutral-sm md:flex-row md:gap-x-6 md:p-6">
        {votingScoresL2.map((choice, index) => (
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
            {index < votingScoresL2.length - 1 && <div className="h-0.25 bg-neutral-100 md:h-auto md:w-0.25" />}
          </div>
        ))}
      </div>
      {/* Options */}
      {showOptions && (
        <div className="flex flex-col gap-y-3 pt-3">
          <div className="flex flex-col gap-y-2">
            <Heading size="h3">Choose your option</Heading>
            <p className="text-neutral-500">
              To vote, you must select one of the following options and confirm in your wallet. Once the transaction is
              completed, your vote will be counted and displayed.
            </p>
          </div>
          <RadioGroup value={option} onValueChange={(value) => setOption(value)} className="!gap-y-3">
            {votingScoresL1?.map((choice, index) => {
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
        </div>
      )}
      {/* Button group */}
      {ctaL1 && (
        <div className="flex w-full flex-col gap-y-4 md:flex-row md:gap-x-4">
          <Button
            size="md"
            className="!rounded-full"
            disabled={disabled}
            onClick={handleVoteClick}
            isLoading={ctaL1.isLoading}
          >
            {label}
          </Button>

          {showOptions && (
            <Button size="md" className="!rounded-full" onClick={() => setShowOptions(false)} variant="tertiary">
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
