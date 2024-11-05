import { Dialog, type IDialogRootProps } from "@aragon/ods";
import Link from "next/link";
import { NavLink, type INavLink } from "./navLink";

interface IMobileNavDialogProps extends IDialogRootProps {
  navLinks: INavLink[];
}

export const MobileNavDialog: React.FC<IMobileNavDialogProps> = (props) => {
  const { navLinks, ...dialogRootProps } = props;

  return (
    <Dialog.Root {...dialogRootProps}>
      <Dialog.Content className="flex flex-col gap-y-6 px-3 py-7">
        <ul className="flex w-full flex-col gap-y-1">
          {navLinks.map((navLink) => (
            <NavLink {...navLink} key={navLink.id} onClick={() => dialogRootProps.onOpenChange?.(false)} />
          ))}
        </ul>
      </Dialog.Content>
    </Dialog.Root>
  );
};
