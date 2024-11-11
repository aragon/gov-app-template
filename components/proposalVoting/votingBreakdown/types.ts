import { type IButtonProps } from "@aragon/gov-ui-kit";

export type VotingCta = Pick<IButtonProps, "disabled" | "isLoading"> & {
  label?: string;
  onClick?: (value?: number) => void;
};
