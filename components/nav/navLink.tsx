import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

export interface INavLink {
  path: string;
  id: string;
  name: string;
  isExternal?: boolean;
}

interface INavLinkProps extends INavLink {
  onClick?: () => void;
}

export const NavLink: React.FC<INavLinkProps> = (props) => {
  const { id, name, path, onClick, isExternal } = props;
  const { asPath } = useRouter();
  const pathToCheck = asPath === "/" ? "/#/community-voting" : asPath;
  const isSelected = pathToCheck.includes(path);

  const anchorClasses = classNames(
    "w-full py-3 transition-colors duration-75", // base styles
    "group-hover:text-primary-500 group-hover:underline", // hover styles
    "outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset", // focus styles
    "flex h-12 flex-1 items-center justify-between gap-2 px-4 leading-tight",
    "md:h-11 md:px-0 md:leading-normal", // desktop nav styles
    {
      "text-primary-400": isSelected,
    },
    {
      "text-neutral-800": !isSelected,
    }
  );

  return (
    <li key={id} className="group">
      <Link
        target={isExternal ? "_blank" : "_self"}
        href={path}
        onClick={onClick}
        aria-current={isSelected ? "page" : undefined}
        className={anchorClasses}
      >
        <span>{name}</span>
        {isExternal && (
          <svg
            width="10"
            className="stroke-neutral-800 group-hover:stroke-primary-500"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 7.125V15H1V1H8.875" strokeLinejoin="bevel" />
            <path d="M5 11L15 1M15 1V4.33333M15 1H11.6667" strokeLinejoin="bevel" />
          </svg>
        )}
      </Link>
    </li>
  );
};
