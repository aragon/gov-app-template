import { Card, StateSkeletonBar } from "@aragon/ods";

export const CardResourcesSkeleton = () => {
  return (
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
      <StateSkeletonBar size="xl" width={"40%"} />
      <div className="flex flex-col gap-y-1">
        <StateSkeletonBar size="lg" width={"30%"} />
        <StateSkeletonBar size="lg" width={"100%"} />
      </div>
      <div className="flex flex-col gap-y-1">
        <StateSkeletonBar size="lg" width={"30%"} />
        <StateSkeletonBar size="lg" width={"100%"} />
      </div>
    </Card>
  );
};
