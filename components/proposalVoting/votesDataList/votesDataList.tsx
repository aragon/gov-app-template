import { DataListPagination, DataListContainer, DataListRoot, IconType } from "@aragon/gov-ui-kit";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import { VotesDataListItemSkeleton } from "./votesDataListItemSkeleton";
import { VotesDataListItemStructure } from "./votesDataListItemStructure";
import { type IVote } from "@/utils/types";

const DEFAULT_PAGE_SIZE = 6;

interface IVotesDataListProps {
  votes: IVote[];
  strategy: "Veto" | "Vote" | undefined;
}

export const VotesDataList: React.FC<IVotesDataListProps> = (props) => {
  const { votes, strategy } = props;
  const { address } = useAccount();

  const isVeto = strategy === "Veto";

  const totalVotes = votes.length;
  const showPagination = (totalVotes ?? 0) > DEFAULT_PAGE_SIZE;
  const entityLabel = totalVotes === 1 ? (isVeto ? "Veto" : "Vote") : isVeto ? "Vetoes" : "Votes";

  const emptyFilteredState = {
    heading: isVeto ? "No vetoes found" : "No votes found",
    description: "Your applied filters are not matching with any results. Reset and search with other filters!",
    secondaryButton: {
      label: "Reset all filters",
      iconLeft: IconType.RELOAD,
    },
  };

  const emptyState = {
    heading: isVeto ? "No vetoes cast" : "No votes cast",
  };

  const errorState = {
    heading: isVeto ? "Error loading vetoes" : "Error loading votes",
    description: `There was an error loading the ${isVeto ? "vetoes" : "votes"}. Try again!`,
    secondaryButton: {
      label: isVeto ? "Reload vetoes" : "Reload votes",
      iconLeft: IconType.RELOAD,
      // onClick: () => refetch(),
    },
  };

  return (
    <DataListRoot
      entityLabel={entityLabel}
      itemsCount={totalVotes}
      pageSize={DEFAULT_PAGE_SIZE}
      state={undefined}
      onLoadMore={() => {}}
    >
      <DataListContainer
        SkeletonElement={VotesDataListItemSkeleton}
        errorState={errorState}
        emptyState={emptyState}
        emptyFilteredState={emptyFilteredState}
      >
        {votes?.map(({ variant, ...otherProps }, id) => (
          <VotesDataListItemStructure
            {...otherProps}
            variant={variant}
            connectedAccount={address && isAddressEqual(address, otherProps.address)}
            key={id}
          />
        ))}
      </DataListContainer>
      {showPagination && <DataListPagination />}
    </DataListRoot>
  );
};
