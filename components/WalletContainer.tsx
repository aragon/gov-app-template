import { PUB_CHAIN, PUB_RPC_URL } from "@/constants";
import { formatHexString } from "@/utils/evm";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import classNames from "classnames";
import { useEffect } from "react";
import { createClient, http } from "viem";
import { createConfig, useAccount, useEnsName, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";

const config = createConfig({
  chains: [PUB_CHAIN],
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(PUB_RPC_URL, { batch: true }),
    });
  },
});

// TODO: update with ODS wallet module - [https://linear.app/aragon/issue/RD-198/create-ods-walletmodule]
const WalletContainer = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const { data: ensName } = useEnsName({
    config,
    chainId: mainnet.id,
    address: address,
  });

  useEffect(() => {
    if (!chainId) return;
    else if (chainId === PUB_CHAIN.id) return;

    switchChain({ chainId: PUB_CHAIN.id });
  }, [chainId]);

  return (
    <button
      className={classNames(
        "shrink-none border-gray group flex h-8 w-[137px] items-center border bg-neutral-0 leading-tight text-neutral-500",
        "leading-none font-screener px-2 text-sm",
        "outline-none focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset", // focus styles
        "hover:border-primary-400 hover:text-primary-400" // hover styles
      )}
      onClick={() => open()}
    >
      <svg
        className="w-5 group-hover:fill-primary-400"
        width="100%"
        height="100%"
        viewBox="0 0 18 14"
        fill="var(--guk-color-neutral-800)"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 6L10 7L9 8L8 7L9 6Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 4V1L16 0H1L0 1V13L1 14H16L17 13V10H18V4H17ZM16 1.41421L15.5858 1H1.41421L1 1.41421V12.5858L1.41421 13H15.5858L16 12.5858V10H7L6 9V5L7 4H16V1.41421ZM17 5H7.41421L7 5.41421V8.58579L7.41421 9H17V5Z"
        />
      </svg>
      <div className="w-full pl-2 text-center text-xs" style={{ marginBottom: "-2px" }}>
        {isConnected && address ? (ensName ? ensName.substring(0, 12) : formatHexString(address)) : "Connect"}
      </div>
    </button>
  );
};

export default WalletContainer;
