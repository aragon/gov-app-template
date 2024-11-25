import WalletContainer from "@/components/WalletContainer";
import { plugins } from "@/plugins";
import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { MobileNavDialog } from "./mobileNavDialog";
import { NavLink, type INavLink } from "./navLink";
import { PUB_APP_NAME, PUB_PROJECT_LOGO } from "@/constants";
import mobileNavMenuTriggerStyles from "./mobileNavMenuTrigger.module.css";

export const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navLinks: INavLink[] = [
    ...plugins.map((p) => ({
      id: p.id,
      name: p.title,
      // path: `/plugins/${p.id}/#/`,
      path: `#/${p.id}`,
    })),
    {
      id: "appUi",
      name: "App",
      path: "https://app.pwn.xyz",
      isExternal: true,
    },
    {
      id: "stakingUi",
      name: "Stake",
      path: "https://staking.pwn.xyz",
      isExternal: true,
    },
    {
      id: "forumUi",
      name: "Forum",
      path: "https://forum.pwn.xyz",
      isExternal: true,
    },
    //{
    //  id: 'linktree',
    //  name: 'Linktree',
    //  path: 'https://linktr.ee/pwndao',
    //  isExternal: true,
    //}
  ];

  return (
    <>
      <nav className="font-screener sticky top-0 z-[var(--hub-navbar-z-index)] flex h-20 w-full select-none items-center justify-center bg-neutral-0">
        <div className="m-auto flex h-[90%] w-[97%] max-w-[100%] items-center justify-between gap-2 px-4 md:gap-8 lg:h-[95%]">
          <Link
            href="/#/community-voting"
            className={classNames(
              "flex items-center gap-x-5 py-2",
              "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
            )}
          >
            <img src={PUB_PROJECT_LOGO} height={24} className="shrink-0" alt={`${PUB_APP_NAME} logo`} />
          </Link>
          <ul className="mr-auto hidden gap-x-8 md:flex">
            {navLinks.map(({ id, name, path, isExternal = false }) => (
              <NavLink name={name} path={path} id={id} key={id} isExternal={isExternal} />
            ))}
          </ul>

          <div className="ml-auto shrink-0 md:ml-0 md:mr-0">
            <WalletContainer />
          </div>

          {/* Mobile Nav Menu Trigger */}
          <div
            className={classNames("relative md:hidden", mobileNavMenuTriggerStyles.ExpandMenuContainer, {
              [mobileNavMenuTriggerStyles.ExpandMenuContainerActive]: showMenu,
            })}
            onClick={() => setShowMenu(true)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </nav>
      <MobileNavDialog open={showMenu} navLinks={navLinks} onOpenChange={setShowMenu} />
    </>
  );
};
