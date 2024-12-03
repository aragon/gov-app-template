import { IconType } from "@aragon/ods";

export const Proposals = {
  name: "Proposals",
  id: "proposals",
  path: "#/proposals",
  icon: IconType.APP_PROPOSALS,
};

export const ProposalDetails = {
  name: "Proposal details",
  id: "proposals-details",
  path: "#/proposals/:id",
  getPath: (id: number | string) => `#/proposals/${id}`,
};

export const NewProposal = {
  name: "Create proposal",
  id: "new-proposal",
  path: "#/new",
  icon: IconType.APP_PROPOSALS,
  exitPath: "#/",
};

export const ProcessRoutes = [NewProposal];
