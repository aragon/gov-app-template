import { PUB_CHAIN } from "@/constants";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSwitchChain } from "wagmi";

export const useForceChain = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  function forceChain(chainId: number = PUB_CHAIN.id): Promise<any> {
    if (!isConnected) {
      return open();
    }

    return new Promise<any>((resolve, reject) => {
      switchChain(
        { chainId },
        {
          onSuccess() {
            resolve(undefined);
          },
          onError(error) {
            reject(error);
          },
        }
      );
    });
  }

  return { forceChain };
};
