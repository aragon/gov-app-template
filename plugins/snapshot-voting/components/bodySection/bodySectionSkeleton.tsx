import { Card, StateSkeletonBar } from "@aragon/ods";

export const BodySectionSkeleton = () => (
  <Card className="p-4 shadow-neutral md:p-6">
    <div className="flex flex-col gap-y-4">
      <StateSkeletonBar width={"240px"} className="h-8" />
      <hr className="rounded-full border-neutral-100" />
      <div className="flex flex-col gap-y-8">
        <StateSkeletonBar width={"120px"} className="h-8" />
        <StateSkeletonBar width={"75%"} className="h-6" />
      </div>
      <StateSkeletonBar width={"95%"} className="h-6" />
      <StateSkeletonBar width={"95%"} className="h-6" />
      <StateSkeletonBar width={"92%"} className="h-6" />
    </div>
  </Card>
);
