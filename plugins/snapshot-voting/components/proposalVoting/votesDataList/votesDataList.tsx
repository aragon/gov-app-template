import { Button } from "@/components/odsModified/button";
import { PUB_CHAIN, PUB_ENS_CHAIN } from "@/constants";
import { config } from "@/context/Web3Modal";
import { votes } from "@/plugins/snapshot-voting/services/proposals";
import { isAddressEqual } from "@/utils/evm";
import { generateDataListState } from "@/utils/query";
import { DataList, IconType, type DataListState } from "@aragon/ods";
import { keepPreviousData, useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import { getEnsAvatarQueryOptions, getEnsNameQueryOptions } from "wagmi/query";
import { VotesDataListItemSkeleton } from "./votesDataListItemSkeleton";
import { VotesDataListItemStructure } from "./votesDataListItemStructure";

const DEFAULT_PAGE_SIZE = 3;

interface IVotesDataListProps {
  proposalId: string;
}

export const VotesDataList: React.FC<IVotesDataListProps> = (props) => {
  const { proposalId } = props;
  const { address } = useAccount();

  const {
    data,
    isError,
    isLoading,
    isRefetching,
    isRefetchError,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    ...votes({ proposalId, limit: DEFAULT_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const ensNames = useQueries({
    queries: data
      ? data.map(({ address }) => ({
          ...getEnsNameQueryOptions(config, { address: address as Address, chainId: PUB_ENS_CHAIN.id }),
          enabled: !!address,
        }))
      : [],
  });

  const ensAvatars = useQueries({
    queries: ensNames
      ? ensNames.map(({ data }) => ({
          ...getEnsAvatarQueryOptions(config, { name: data!, chainId: PUB_ENS_CHAIN.id }),
          enabled: !!data,
        }))
      : [],
  });

  const loading = isLoading || (isError && isRefetching);
  const error = isError && !isRefetchError && !isFetchNextPageError;
  const [dataListState, setDataListState] = useState<DataListState>(() =>
    generateDataListState(loading, error, isFetchingNextPage)
  );

  useEffect(() => {
    setDataListState(generateDataListState(loading, isError, isFetchingNextPage));
  }, [isError, isFetchingNextPage, loading]);

  const entityLabel = data?.length === 1 ? "Vote" : "Votes";
  const showMore = hasNextPage || (data?.length ?? 0) > DEFAULT_PAGE_SIZE;

  const emptyState = {
    heading: "No votes cast yet",
  };

  const errorState = {
    heading: "Error loading votes",
    description: "There was an error loading the votes. Try again!",
    secondaryButton: {
      label: "Reload votes",
      iconLeft: IconType.RELOAD,
      onClick: () => refetch(),
      className: "!rounded-full",
    },
  };

  return (
    <DataList.Root entityLabel={entityLabel} state={dataListState}>
      <DataList.Container SkeletonElement={VotesDataListItemSkeleton} errorState={errorState} emptyState={emptyState}>
        {data?.map(({ id, choice, ...otherProps }, index) => (
          <VotesDataListItemStructure
            {...otherProps}
            ensName={ensNames[index]?.data as string | undefined}
            ensAvatar={ensAvatars[index]?.data as string | undefined}
            href={`${PUB_CHAIN.blockExplorers?.default.url}/address/${otherProps.address}`}
            variant={choice}
            rel="noopener noreferrer"
            target="_blank"
            connectedAccount={address && isAddressEqual(address, otherProps.address)}
            key={id}
          />
        ))}
      </DataList.Container>

      {showMore && (
        <span>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}
            iconRight={IconType.CHEVRON_DOWN}
          >
            More
          </Button>
        </span>
      )}
    </DataList.Root>
  );
};
