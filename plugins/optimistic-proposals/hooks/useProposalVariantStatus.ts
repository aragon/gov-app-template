import { useState, useEffect } from "react";
import { OptimisticProposal } from "../utils/types";
import { ProposalStatus } from "@aragon/ods";

export const useProposalVariantStatus = (proposal: OptimisticProposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;

    if (proposal?.active) {
      setStatus({ variant: "info", label: "Active" });
    } else if (proposal?.executed) {
      setStatus({ variant: "primary", label: "Executed" });
    } else if (proposal?.vetoTally >= proposal.parameters.minVetoVotingPower) {
      setStatus({ variant: "critical", label: "Defeated" });
    } else {
      setStatus({ variant: "success", label: proposal.actions?.length > 0 ? "Executable" : "Passed" });
    }
  }, [proposal?.vetoTally, proposal?.active, proposal?.executed, proposal?.parameters?.minVetoVotingPower]);

  return status;
};

export const useProposalStatus = (proposal: OptimisticProposal) => {
  const [status, setStatus] = useState<ProposalStatus>();

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;

    if (proposal?.active) {
      setStatus(ProposalStatus.ACTIVE);
    } else if (proposal?.executed) {
      setStatus(ProposalStatus.EXECUTED);
    } else if (proposal?.vetoTally >= proposal.parameters.minVetoVotingPower) {
      setStatus(ProposalStatus.VETOED);
    } else {
      setStatus(ProposalStatus.ACCEPTED);
    }
  }, [proposal?.vetoTally, proposal?.active, proposal?.executed, proposal?.parameters?.minVetoVotingPower]);

  return status;
};
