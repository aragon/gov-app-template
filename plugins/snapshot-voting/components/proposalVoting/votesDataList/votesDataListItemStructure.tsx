import { Collapsible } from "@/components/collapsible/collapsible";
import { PUB_ENS_CHAIN } from "@/constants";
import { formatHexString } from "@/utils/evm";
import { DataListItem, MemberAvatar, Tag, type IDataListItemProps, type TagVariant } from "@aragon/ods";
import classNames from "classnames";
import { sanitize } from "dompurify";

export type IVotesDataListVariant = "yes" | "approve" | "no" | "veto" | "abstain" | "reject";

export type IVotesDataListItemStructureProps = IDataListItemProps & {
  address: string;
  variant: IVotesDataListVariant;
  ensAvatar?: string;
  ensName?: string;
  connectedAccount?: boolean;
  delegate?: boolean;
  votingPower?: string;
  justification?: string;
};

export const VotesDataListItemStructure: React.FC<
  IVotesDataListItemStructureProps & { className?: string; href?: string; rel?: string; target?: string }
> = (props) => {
  const {
    address,
    connectedAccount,
    delegate,
    ensAvatar,
    ensName,
    variant,
    className,
    votingPower,
    justification,
    ...otherProps
  } = props;

  const getLabel = () => {
    if (connectedAccount) {
      return "You";
    } else if (delegate) {
      return "Your delegate";
    }
  };

  const label = getLabel();
  const dataListVariantToTagVariant: Record<IVotesDataListVariant, TagVariant> = {
    yes: "success",
    approve: "success",
    no: "critical",
    veto: "critical",
    abstain: "neutral",
    reject: "critical",
  };

  const handleToggle = (_isOpen: boolean, e: any) => {
    e.preventDefault();
  };

  return (
    <DataListItem className={classNames("flex flex-col gap-y-3 py-3 md:py-4", className)} {...otherProps}>
      <div className="flex w-full items-center gap-x-3 md:gap-x-4">
        <MemberAvatar
          src={ensAvatar ?? ""}
          address={address}
          alt="Profile picture"
          className="shrink-0"
          size="md"
          chainId={PUB_ENS_CHAIN.id}
        />
        <div className="md:gap-y-0.75 flex flex-1 flex-col justify-center gap-y-0.5">
          <div className="flex">
            <span className="leading-tight text-neutral-800 md:text-lg">{ensName ?? formatHexString(address)}</span>
            {label && <Tag label={label} variant="primary" className="relative -top-2 left-1 shrink-0 capitalize" />}
          </div>
          {votingPower && (
            <span className="line-clamp-1 text-sm leading-tight text-neutral-500">{`${votingPower} Voting power`}</span>
          )}
        </div>

        <Tag label={variant} variant={dataListVariantToTagVariant[variant]} className="shrink-0 capitalize" />
      </div>
      {justification && (
        <Collapsible
          customCollapsedHeight={24}
          buttonLabelClosed="Read more"
          buttonLabelOpened="Show less"
          onCollapsibleToggle={handleToggle}
        >
          <p className="text-base text-neutral-600">{sanitize(justification)}</p>
        </Collapsible>
      )}
    </DataListItem>
  );
};
