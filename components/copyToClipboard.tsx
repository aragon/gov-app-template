import { clipboardUtils, Icon, type IconSize, IconType } from "@aragon/ods";
import React, { useState } from "react";

export interface ICopyToClipBoard {
  value: string;
  size?: IconSize;
}
export const CopyToClipBoard: React.FC<ICopyToClipBoard> = (props) => {
  const { value, size } = props;

  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    clipboardUtils.copy(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
    });
  };

  return (
    <button onClick={handleClick} style={{ position: "relative" }}>
      <div
        style={{
          transition: "opacity 0.3s ease, transform 0.3s ease",
          opacity: copied ? 1 : 0,
          transform: copied ? "scale(1)" : "scale(0.5)",
          position: copied ? "relative" : "absolute",
        }}
      >
        {copied && <Icon icon={IconType.CHECKMARK} className="text-neutral-700" size={size ?? "md"} />}
      </div>
      <div
        style={{
          transition: "opacity 0.3s ease, transform 0.3s ease",
          opacity: copied ? 0 : 1,
          transform: copied ? "scale(0.5)" : "scale(1)",
          position: copied ? "absolute" : "relative",
        }}
      >
        {!copied && <Icon icon={IconType.COPY} className="text-neutral-700" size={size ?? "md"} />}
      </div>
    </button>
  );
};
