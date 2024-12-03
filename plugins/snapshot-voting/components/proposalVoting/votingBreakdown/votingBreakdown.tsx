import { BreakdownMajorityVotingResult, type IBreakdownMajorityVotingResult } from "./majorityVotingResult";
import { type VotingCta } from "./types";

export type ProposalType = "majorityVoting" | "approvalThreshold";

export interface IVotingBreakdownProps<TType extends ProposalType = ProposalType> {
  proposalId: string;
  result?: IBreakdownMajorityVotingResult;
  cta?: VotingCta;
}

export const VotingBreakdown: React.FC<IVotingBreakdownProps> = (props) => {
  const { result, cta, proposalId } = props;

  return (
    result && (
      <BreakdownMajorityVotingResult
        {...(result as IBreakdownMajorityVotingResult)}
        cta={cta}
        proposalId={proposalId}
      />
    )
  );
};
