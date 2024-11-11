import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

export interface INavLink {
  path: string;
  id: string;
  name: string;
}

interface INavLinkProps extends INavLink {
  onClick?: () => void;
}

export const NavLink: React.FC<INavLinkProps> = (props) => {
  const { id, name, path, onClick } = props;
  const { asPath } = useRouter();
  const pathToCheck = asPath === "/" ? "/#/community-voting" : asPath;
  const isSelected = pathToCheck.includes(path);

  const containerClasses = classNames(
    "group relative md:-mb-0.25 md:border-b md:hover:border-b-primary-400", // base styles
    {
      "md:border-b-transparent md:active:border-b-primary-400": !isSelected, // unselected link styles
      "md:border-b-primary-400 md:hover:border-b-primary-400": isSelected, // base selected link styles

      // using after so that the size of the links don't change when one is selected and active
      "md:after:bg-primary-400 md:after:content-[attr(aria-current)] md:active:after:hidden": isSelected,
      "md:after:absolute md:after:-bottom-0 md:after:left-0 md:after:right-0 md:after:h-[1px]": isSelected,
    }
  );

  const anchorClasses = classNames(
    "w-full py-3", // base styles
    "group-hover:text-neutral-800 group-hover:bg-primary-600", // hover styles
    "outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset", // focus styles
    "flex h-12 flex-1 items-center justify-between gap-3 rounded-xl px-4 leading-tight", // mobile styles
    "md:h-11 md:rounded-none md:px-0 md:leading-normal", // desktop nav styles
    {
      "bg-primary-800": isSelected,
    }
  );

  const spanClasses = classNames("flex-1 truncate px-4 text-primary-400", {
    "text-neutral-800": isSelected,
  });

  return (
    <li key={id} className={containerClasses}>
      <Link href={path} onClick={onClick} aria-current={isSelected ? "page" : undefined} className={anchorClasses}>
        <span className={spanClasses}>{name}</span>
      </Link>
    </li>
  );
};
