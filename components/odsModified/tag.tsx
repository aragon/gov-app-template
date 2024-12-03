import { type ITagProps, Tag as ODSTag } from "@aragon/ods";
import classNames from "classnames";

export const Tag: React.FC<ITagProps> = (props) => {
  return (
    <ODSTag {...props} className={classNames({ "*:text-neutral-900": props.variant === "info" }, props.className)} />
  );
};
