import { Card, type IBreadcrumbsLink, StateSkeletonBar } from "@aragon/ods";
import { BodySectionSkeleton } from "../bodySection/bodySectionSkeleton";
import { CardResourcesSkeleton } from "../cardResources/cardResourcesSkeleton";
import { HeaderProposalSkeleton } from "../headerProposal/headerProposalSkeleton";
import { MainSection } from "../layout/mainSection";

interface IProposalDetailsSkeletonLoaderProps {
  breadcrumbs: IBreadcrumbsLink[];
}

export const ProposalDetailsSkeletonLoader: React.FC<IProposalDetailsSkeletonLoaderProps> = ({ breadcrumbs }) => {
  return (
    <>
      <HeaderProposalSkeleton breadcrumbs={breadcrumbs} />
      <MainSection className="md:px-16 md:pb-20 md:pt-10">
        <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
          <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
            <BodySectionSkeleton />
          </div>

          {/* Additional Information */}
          <div className="flex flex-col gap-y-6 md:w-[33%]">
            <CardResourcesSkeleton />
            <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
              <StateSkeletonBar size="xl" width={"40%"} />
              <div className="flex flex-col gap-y-1">
                <StateSkeletonBar size="lg" width={"69%"} />
              </div>
              <div className="flex flex-col gap-y-1">
                <StateSkeletonBar size="lg" width={"69%"} />
              </div>
            </Card>
          </div>
        </div>
      </MainSection>
    </>
  );
};
