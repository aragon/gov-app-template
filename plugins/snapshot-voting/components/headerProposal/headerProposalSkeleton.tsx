import { Breadcrumbs } from "@/components/odsModified/breadcrumbs";
import { MainSection } from "../layout/mainSection";
import { type IBreadcrumbsLink, StateSkeletonBar, StateSkeletonCircular } from "@aragon/ods";

interface IHeaderProposalSkeletonProps {
  breadcrumbs: IBreadcrumbsLink[];
}

export const HeaderProposalSkeleton: React.FC<IHeaderProposalSkeletonProps> = (props) => {
  const { breadcrumbs } = props;
  return (
    <>
      {/* LOADER */}
      <div className="flex w-full justify-center bg-neutral-0">
        {/* Wrapper */}
        <MainSection className="flex h-[248px] flex-col gap-y-6 md:px-16 md:py-10">
          <span className="flex gap-x-2">
            <Breadcrumbs links={breadcrumbs} />
            <StateSkeletonBar size="lg" width={"120px"} className="h-6" />
          </span>
          {/* Title & description */}
          <div className="flex w-full flex-col gap-y-3">
            <div className="flex w-full items-center gap-x-4">
              <StateSkeletonBar size="2xl" width={"45%"} className="h-9" />
              <StateSkeletonBar size="lg" width={"120px"} className="h-6" />
            </div>
            <StateSkeletonBar size="lg" width={"69%"} className="h-6" />
          </div>
          {/* Metadata */}
          <div className="flex flex-wrap gap-x-10 gap-y-2">
            <div className="flex items-center gap-x-2">
              <StateSkeletonCircular size="sm" />
              <StateSkeletonBar size="lg" width={"160px"} className="h-5" />
            </div>
            <div className="flex items-center gap-x-2">
              <StateSkeletonCircular size="sm" />
              <StateSkeletonBar size="lg" width={"360px"} className="h-5" />
            </div>

            <div className="flex items-center gap-x-2">
              <StateSkeletonCircular size="sm" />
              <StateSkeletonBar size="lg" width={"160px"} className="h-5" />
            </div>
          </div>
        </MainSection>
      </div>
    </>
  );
};
