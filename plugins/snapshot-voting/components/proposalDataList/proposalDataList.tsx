import { Button } from "@/components/odsModified/button";
import { NewProposal, ProposalDetails } from "@/plugins/snapshot-voting/nav/routes";
import { generateDataListState } from "@/utils/query";
import { DataList, IconType, ProposalDataListItemSkeleton, ProposalStatus, type DataListState } from "@aragon/ods";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useCanCreateProposal } from "../../hooks/useCanCreateProposal";
import { proposalList, voted, type IFetchProposalListParams } from "../../services/proposals";
import {
  ProposalDataListItemStructure,
  type ProposalStatus as ProposalDataListItemStatus,
} from "./proposalDataListItem";

const DEFAULT_PAGE_SIZE = 6;

interface IProposalDataListProps extends IFetchProposalListParams {
  display?: "overview" | "list";
  pageSize?: number;
  pathPrefix?: string;
}

export const ProposalDataList: React.FC<IProposalDataListProps> = (props) => {
  const { display = "list", pageSize = DEFAULT_PAGE_SIZE, pathPrefix = "" } = props;

  const { address } = useAccount();
  const router = useRouter();
  const { isAuthorized } = useCanCreateProposal();

  const {
    data: proposals,
    isError,
    isRefetchError,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    ...proposalList({
      limit: DEFAULT_PAGE_SIZE,
    }),
  });

  const votedData = useQueries({
    queries:
      proposals && !!address
        ? proposals.flatMap(({ id: proposalId, status }) => {
            if (status === ProposalStatus.ACTIVE) {
              return {
                ...voted({ proposalId, address }),
                enabled: !!proposalId && address && status === ProposalStatus.ACTIVE,
              };
            }
            return [];
          })
        : [],
  });

  const loading = isLoading || (isError && isRefetching);
  const [dataListState, setDataListState] = useState<DataListState>("initialLoading");

  useEffect(() => {
    setDataListState(generateDataListState(loading, isError && isRefetchError, isFetchingNextPage, false, false));
  }, [isError, isFetching, isFetchingNextPage, loading, isRefetching, isRefetchError]);

  const totalProposals = proposals?.length;
  const entityLabel = totalProposals === 1 ? "Proposal" : "Proposals";

  const emptyState = {
    heading: "No proposals have been created yet",
    description: isAuthorized ? "Start by creating a proposal" : "",
    primaryButton: isAuthorized
      ? {
          label: "Create proposal",
          iconLeft: IconType.PLUS,
          className: "!rounded-full",
          onClick: () => {
            router.push(`${pathPrefix}${NewProposal.path}`);
          },
        }
      : undefined,
  };

  const errorState = {
    heading: "Error loading proposals",
    description: "There was an error loading the proposals. Please try again!",
    secondaryButton: {
      label: "Reload proposals",
      iconLeft: IconType.RELOAD,
      className: "!rounded-full",
      onClick: () => refetch(),
    },
  };

  return (
    <DataList.Root
      entityLabel={entityLabel}
      itemsCount={totalProposals}
      pageSize={pageSize}
      state={dataListState}
      onLoadMore={fetchNextPage}
    >
      <DataList.Container
        SkeletonElement={ProposalDataListItemSkeleton}
        errorState={errorState}
        emptyState={emptyState}
      >
        {proposals?.map((proposal, index) => (
          <ProposalDataListItemStructure
            {...proposal}
            status={proposal.status.toLowerCase() as ProposalDataListItemStatus}
            id=""
            voted={votedData[index]?.data?.hasVoted}
            href={`${pathPrefix}${ProposalDetails.getPath(proposal.id)}`}
            key={proposal.id}
            className="!py-4 md:!py-6"
          />
        ))}
      </DataList.Container>
      {display === "list" && !isLoading && (totalProposals ?? 0) > pageSize && <DataList.Pagination />}
      {display === "overview" && (totalProposals ?? 0) !== 0 && (
        <span>
          <Button
            className="!rounded-full"
            variant="secondary"
            size="md"
            iconRight={IconType.CHEVRON_RIGHT}
            onClick={() => {
              router.push(pathPrefix);
            }}
          >
            View all
          </Button>
        </span>
      )}
    </DataList.Root>
  );
};
