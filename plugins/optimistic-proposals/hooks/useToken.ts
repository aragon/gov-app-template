import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { PUB_TOKEN_ADDRESS } from "@/constants";
import { useChainIdTypesafe } from "@/utils/chains";

export function useToken() {
  const chainId = useChainIdTypesafe();

  const {
    data: tokenSupply,
    isError: isError1,
    isLoading: isLoading1,
  } = useReadContract({
    address: PUB_TOKEN_ADDRESS[chainId],
    abi: erc20Abi,
    functionName: "totalSupply",
    chainId,
  });

  const {
    data: tokenSymbol,
    isError: isError2,
    isLoading: isLoading2,
  } = useReadContract({
    address: PUB_TOKEN_ADDRESS[chainId],
    abi: erc20Abi,
    functionName: "symbol",
    chainId,
  });

  return {
    address: PUB_TOKEN_ADDRESS[chainId],
    tokenSupply,
    symbol: tokenSymbol,
    status: {
      isLoading: isLoading1 || isLoading2,
      isError: isError1 || isError2,
    },
  };
}
