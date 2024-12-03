import { type IButtonProps, Button as ODSButton } from "@aragon/ods";
import classNames from "classnames";
import { forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, IButtonProps>((props, ref) => {
  const { className, variant = "primary", ...otherProps } = props;

  return (
    <ODSButton
      {...(!("href" in otherProps) || otherProps.href == null ? { type: "button" } : {})}
      {...otherProps}
      ref={ref}
      variant={variant}
      className={classNames(
        {
          "!border-secondary-400  !bg-secondary-400 !text-[#000] hover:!border-secondary-400/50 hover:!bg-secondary-400/40":
            variant === "secondary",
        },
        "!font-medium !rounded-full",
        className
      )}
    />
  );
});

Button.displayName = "Button";
