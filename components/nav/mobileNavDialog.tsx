import { type IDialogRootProps, DialogRoot, DialogContent } from "@aragon/gov-ui-kit";
import { NavLink, type INavLink } from "./navLink";

interface IMobileNavDialogProps extends IDialogRootProps {
  navLinks: INavLink[];
}

export const MobileNavDialog: React.FC<IMobileNavDialogProps> = (props) => {
  const { navLinks, ...dialogRootProps } = props;

  return (
    <DialogRoot {...dialogRootProps}>
      <DialogContent className="flex flex-col gap-y-6 px-3 py-7">
        <ul className="flex w-full flex-col gap-y-1">
          {navLinks.map((navLink) => (
            <NavLink {...navLink} key={navLink.id} onClick={() => dialogRootProps.onOpenChange?.(false)} />
          ))}
        </ul>
      </DialogContent>
    </DialogRoot>
  );
};
