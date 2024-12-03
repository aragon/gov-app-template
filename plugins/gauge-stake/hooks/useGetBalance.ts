import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { type Token } from "../types/tokens";
import { getTokenContract } from "./useGetContract";

export function useGetBalance(token: Token) {
  const tokenContract = getTokenContract(token);
  const { address } = useAccount();

  return useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenContract,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: tokenContract,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenContract,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
    query: {
      enabled: !!address,
      select: (results) => {
        const [balance, decimals, symbol] = results;

        return {
          balance,
          decimals,
          symbol,
          formattedBalance: formatUnits(balance, decimals),
        };
      },
    },
  });
}
