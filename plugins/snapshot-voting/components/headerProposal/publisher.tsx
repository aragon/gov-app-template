import { formatHexString, isAddressEqual } from "@/utils/evm";
import { Link, type IPublisher } from "@aragon/ods";
import { useAccount } from "wagmi";

const MAX_PUBLISHERS_SHOWN = 3;

interface IPublisherProps {
  publisher: IPublisher[];
}

export const Publisher: React.FC<IPublisherProps> = (props) => {
  const { publisher } = props;
  const { address: connectedAddress } = useAccount();

  const showParsedPublisher = publisher.length <= MAX_PUBLISHERS_SHOWN;

  return (
    <div className="flex gap-x-0.5 text-base leading-tight">
      <div className="inline-grid auto-cols-auto grid-flow-col content-center gap-x-1 leading-tight">
        <span className="text-neutral-500">Published by</span>
        {showParsedPublisher === false && <button>3+ creators</button>}
        {showParsedPublisher &&
          publisher.map(({ address, name, link }, index) => {
            const label = name ?? (isAddressEqual(address, connectedAddress) ? "You" : formatHexString(address));

            return (
              <span key={label} className="truncate">
                {link != null && (
                  <Link href={link} target="_blank">
                    {label}
                  </Link>
                )}
                {link == null && <span className="truncate text-neutral-800">{label}</span>}
                {index < publisher.length - 1 && publisher.length > 2 && ","}
                {index === publisher.length - 2 && ` &`}
              </span>
            );
          })}
      </div>
    </div>
  );
};
