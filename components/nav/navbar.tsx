import WalletContainer from "@/components/WalletContainer";
import { plugins } from "@/plugins";
import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { MobileNavDialog } from "./mobileNavDialog";
import { NavLink, type INavLink } from "./navLink";
import { AvatarIcon, IconType } from "@aragon/gov-ui-kit";
import { PUB_APP_NAME, PUB_PROJECT_LOGO } from "@/constants";

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
        <div className="w-full max-w-[1280px] flex-col gap-2 p-3 md:px-6 md:pb-0 lg:gap-3">
          <div className="">
            <div className="flex w-full items-center justify-between pb-3 lg:ml-10">
              <Link
                href="/#/community-voting"
                className={classNames(
                  "flex items-center gap-x-5 py-2",
                  "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
                )}
              >
                <img src={PUB_PROJECT_LOGO} height={24} className="shrink-0" alt={`${PUB_APP_NAME} logo`} />
              </Link>
              <ul className="mr-auto hidden gap-x-8 md:flex lg:pl-8">
                {navLinks.map(({ id, name, path, isExternal = false }) => (
                  <NavLink name={name} path={path} id={id} key={id} isExternal={isExternal} />
                ))}
              </ul>

              <div className="shrink-0">
                <WalletContainer />
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              {/* Nav Trigger */}
              <button
                onClick={() => setShowMenu(true)}
                className={classNames(
                  "border border-neutral-100 bg-neutral-0 p-1 md:hidden",
                  "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset" // focus styles
                )}
              >
                <AvatarIcon size="lg" icon={IconType.MENU} />
              </button>
            </div>
          </div>

          {/* Tab wrapper */}
        </div>
      </nav>
      <MobileNavDialog open={showMenu} navLinks={navLinks} onOpenChange={setShowMenu} />
    </>
  );
};
