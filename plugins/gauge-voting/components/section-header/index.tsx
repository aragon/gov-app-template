import { IconType } from "@aragon/ods";
import { Link } from "@aragon/ods";
import { type ReactNode } from "react";

interface IHeaderProps {
  title: string;
  children: ReactNode;
  learnMoreUrl: string;
}

export const SectionHeader: React.FC<IHeaderProps> = ({ title, children, learnMoreUrl }) => {
  return (
    <div className="flex flex-col gap-y-3">
      <h1 className="line-clamp-1 flex flex-1 shrink-0 text-2xl font-normal leading-tight text-neutral-800 md:text-3xl">
        {title}
      </h1>
      <p className="max-w-[700px]">{children}</p>
      <Link target="_blank" href={learnMoreUrl} variant="primary" iconRight={IconType.LINK_EXTERNAL}>
        Learn more
      </Link>
    </div>
  );
};
