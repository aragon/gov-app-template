import { type IResource as IProposalResource } from "@/utils/types";
import { Card, CardEmptyState, Heading, IconType, Link } from "@aragon/ods";
import React from "react";

interface ICardResourcesProps {
  displayLink?: boolean;
  resources?: IProposalResource[];
  title: string;
}

export const CardResources: React.FC<ICardResourcesProps> = (props) => {
  const { displayLink = true, resources, title } = props;

  if (resources == null || resources.length === 0) {
    return (
      <CardEmptyState
        objectIllustration={{ object: "ARCHIVE" }}
        heading="No resources were added"
        className="rounded-xl shadow-neutral"
      />
    );
  }

  return (
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
      <Heading size="h3">{title}</Heading>
      <div className="flex flex-col gap-y-4">
        {resources?.map((resource) => (
          <Link
            key={resource.link}
            href={resource.link}
            variant="primary"
            {...(displayLink
              ? {
                  rel: "noopener noreferrer",
                  target: "_blank",
                  iconRight: IconType.LINK_EXTERNAL,
                  description: resource.link,
                }
              : {})}
          >
            {resource.name}
          </Link>
        ))}
      </div>
    </Card>
  );
};
