// when adding/editing ABIs, add here only
//  functions/events that you are working with

export const PWN_TOKEN_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "votingContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "proposalRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
