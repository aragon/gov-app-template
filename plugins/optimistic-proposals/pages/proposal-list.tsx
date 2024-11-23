import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { type ReactNode, useEffect } from "react";
import ProposalCard from "../components/proposal";
import {
  Button,
  Link,
  IconType,
  ProposalDataListItemSkeleton,
  type DataListState,
  DataListRoot,
  DataListContainer,
  DataListPagination,
} from "@aragon/gov-ui-kit";
import { Else, If, Then } from "@/components/if";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_CHAIN } from "@/constants";
import { MainSection } from "@/components/layout/main-section";
import { MissingContentView } from "@/components/MissingContentView";
import { useCanCreateProposal } from "../hooks/useCanCreateProposal";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";

const DEFAULT_PAGE_SIZE = 6;

export default function Proposals() {
  const { isConnected } = useAccount();
  const canCreateProposal = useCanCreateProposal();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const {
    data: proposalCountResponse,
    error: isError,
    isLoading,
    isFetching: isFetchingNextPage,
    refetch,
  } = useReadContract({
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "proposalCount",
    chainId: PUB_CHAIN.id,
  });
  const proposalCount = Number(proposalCountResponse);

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  const entityLabel = proposalCount === 1 ? "Proposal" : "Proposals";

  let dataListState: DataListState = "idle";
  if (isLoading && !proposalCount) {
    dataListState = "initialLoading";
  } else if (isError) {
    dataListState = "error";
  } else if (isFetchingNextPage) {
    dataListState = "fetchingNextPage";
  }

  return (
    <MainSection narrow>
      <SectionView>
        <h1 className="line-clamp-1 flex flex-1 shrink-0 text-2xl font-normal leading-tight text-neutral-800 md:text-3xl">
          Stewards Proposals
        </h1>
        <div className="justify-self-end">
          <Link href="#/stewards/new">
            <Button
              disabled={!isConnected || !canCreateProposal}
              iconLeft={IconType.PLUS}
              size="md"
              variant="secondary"
            >
              Submit Proposal
            </Button>
          </Link>
        </div>
      </SectionView>

      <If true={proposalCount}>
        <Then>
          <DataListRoot
            entityLabel={entityLabel}
            itemsCount={proposalCount}
            pageSize={DEFAULT_PAGE_SIZE}
            state={dataListState}
          >
            <DataListContainer style={{ rowGap: "1rem" }} SkeletonElement={ProposalDataListItemSkeleton}>
              {Array.from(Array(proposalCount || 0)?.keys())
                .reverse()
                ?.map((proposalIndex) => <ProposalCard key={proposalIndex} proposalIndex={proposalIndex} />)}
            </DataListContainer>
            <DataListPagination />
          </DataListRoot>
        </Then>
        <Else>
          <MissingContentView>
            No proposals have been created yet.
            <br />
            Here you will see the list of proposals initiated by the Stewards.
          </MissingContentView>
        </Else>
      </If>
    </MainSection>
  );
}

function SectionView({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-row content-center justify-between">{children}</div>;
}
