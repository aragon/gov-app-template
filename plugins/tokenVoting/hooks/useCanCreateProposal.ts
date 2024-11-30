import { Address } from "viem";
import { useState, useEffect } from "react";
import { useBalance, useAccount, useReadContracts } from "wagmi";
import { TokenVotingPluginAbi } from "../artifacts/TokenVoting.sol";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { ADDRESS_ZERO } from "@/utils/evm";
import { useChainIdTypesafe } from "@/utils/chains";

export function useCanCreateProposal() {
  const { address } = useAccount();
  const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
  const [votingToken, setVotingToken] = useState<Address>();
  const chainId = useChainIdTypesafe();
  const { data: balance } = useBalance({
    address,
    token: votingToken,
    chainId,
    query: {
      enabled: !!votingToken && votingToken !== ADDRESS_ZERO && !!address,
    },
  });

  const { data: contractReads } = useReadContracts({
    contracts: [
      {
        chainId,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
        abi: TokenVotingPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId,
        address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS[chainId],
        abi: TokenVotingPluginAbi,
        functionName: "getVotingToken",
      },
    ],
  });

  useEffect(() => {
    if (!contractReads?.length || contractReads?.length < 2) return;

    setMinProposerVotingPower(contractReads[0].result as bigint);
    setVotingToken(contractReads[1].result as Address);
  }, [contractReads?.[0]?.result, contractReads?.[1]?.result]);

  if (!address) return false;
  else if (!minProposerVotingPower) return true;
  else if (!balance) return false;
  else if (balance?.value >= minProposerVotingPower) return true;

  return false;
}
