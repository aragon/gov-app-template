import { useState, useEffect } from "react";
import { Proposal } from "../utils/types";
import { ProposalStatus } from "@aragon/ods";

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;

    // TODO also check supportThreshold here?
    const totalVotes = proposal.tally.yes + proposal.tally.no + proposal.tally.abstain;

    if (proposal?.active) {
      setStatus({ variant: "info", label: "Active" });
    } else if (proposal?.executed) {
      setStatus({ variant: "primary", label: "Executed" });
    } else if (totalVotes < proposal.parameters.minVotingPower) {
      setStatus({ variant: "critical", label: "Low turnout" });
    } else if (proposal.tally.yes > proposal.tally.no && proposal.tally.yes > proposal.tally.abstain) {
      setStatus({ variant: "success", label: proposal.actions?.length > 0 ? "Executable" : "Passed" });
    } else if (proposal.tally.no > proposal.tally.yes && proposal.tally.no > proposal.tally.abstain) {
      setStatus({ variant: "critical", label: "Defeated" });
    } else if (proposal.tally.abstain > proposal.tally.no && proposal.tally.abstain > proposal.tally.yes) {
      if (proposal.tally.yes > proposal.tally.no) {
        setStatus({ variant: "success", label: proposal.actions?.length > 0 ? "Executable" : "Passed" });
      } else {
        setStatus({ variant: "critical", label: "Defeated" });
      }
    }
  }, [proposal?.tally, proposal?.active, proposal?.executed, proposal?.parameters?.minVotingPower]);

  return status;
};

export const useProposalStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState<ProposalStatus>();

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;

    // TODO also check supportThreshold here?
    const totalVotes = proposal.tally.yes + proposal.tally.no + proposal.tally.abstain;

    if (proposal?.active) {
      setStatus(ProposalStatus.ACTIVE);
    } else if (proposal?.executed) {
      setStatus(ProposalStatus.EXECUTED);
    } else if (totalVotes < proposal.parameters.minVotingPower) {
      setStatus(ProposalStatus.FAILED);
    } else if (proposal.tally.yes > proposal.tally.no && proposal.tally.yes > proposal.tally.abstain) {
      setStatus(proposal.actions?.length > 0 ? ProposalStatus.EXECUTABLE : ProposalStatus.ACCEPTED);
    } else if (proposal.tally.no > proposal.tally.yes && proposal.tally.no > proposal.tally.abstain) {
      setStatus(ProposalStatus.REJECTED);
    } else if (proposal.tally.abstain > proposal.tally.no && proposal.tally.abstain > proposal.tally.yes) {
      if (proposal.tally.yes > proposal.tally.no) {
        setStatus(proposal.actions?.length > 0 ? ProposalStatus.EXECUTABLE : ProposalStatus.ACCEPTED);
      } else {
        setStatus(ProposalStatus.REJECTED);
      }
    }
  }, [proposal?.tally, proposal?.active, proposal?.executed, proposal?.parameters?.minVotingPower]);

  return status;
};
