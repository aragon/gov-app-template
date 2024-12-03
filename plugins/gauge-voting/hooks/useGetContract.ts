import { VotingEscrowAbi } from "@/artifacts/VotingEscrow.sol";
import { useReadContracts } from "wagmi";
import { TOKEN_1_ESCROW_CONTRACT, TOKEN_1_CONTRACT, TOKEN_2_ESCROW_CONTRACT, TOKEN_2_CONTRACT } from "../constants";
import { Token } from "../types/tokens";

export function getEscrowContract(token: Token) {
  return token === Token.TOKEN_1 ? TOKEN_1_ESCROW_CONTRACT : TOKEN_2_ESCROW_CONTRACT;
}

export function getTokenContract(token: Token) {
  return token === Token.TOKEN_1 ? TOKEN_1_CONTRACT : TOKEN_2_CONTRACT;
}

export function useGetContracts(token: Token) {
  const escrowContract = getEscrowContract(token);

  const votingEscrowContract = {
    address: escrowContract,
    abi: VotingEscrowAbi,
  } as const;

  const res = useReadContracts({
    contracts: [
      {
        ...votingEscrowContract,
        functionName: "token",
      },
      {
        ...votingEscrowContract,
        functionName: "voter",
      },
      {
        ...votingEscrowContract,
        functionName: "curve",
      },
      {
        ...votingEscrowContract,
        functionName: "queue",
      },
      {
        ...votingEscrowContract,
        functionName: "clock",
      },
      {
        ...votingEscrowContract,
        functionName: "lockNFT",
      },
    ],
    query: {
      select(data) {
        return {
          tokenContract: data[0],
          voterContract: data[1],
          curveContract: data[2],
          queueContract: data[3],
          clockContract: data[4],
          lockNFTContract: data[5],
        };
      },
      gcTime: Infinity,
      staleTime: 60 * 60 * 1000,
    },
  });

  return res;
}
