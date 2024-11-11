import { modulesCopy } from "@aragon/ods";
import NextLink from "next/link";
import { type ComponentProps } from "react";

export const customModulesCopy = {
  ...modulesCopy,
  majorityVotingResult: {
    ...modulesCopy.majorityVotingResult,
    stage: "",
    // Overridding the default "Winning option" text, which doesn't apply to vetoing proposals
    // TODO? winningOption: "Proposal vetoes",
  },
};

const CustomLink: React.FC<ComponentProps<"a">> = ({ href = {}, ...otherProps }) => {
  if (href == null) {
    return otherProps.children;
  }

  return <NextLink href={href} {...otherProps} />;
};
export const odsCoreProviderValues = { Link: CustomLink };
