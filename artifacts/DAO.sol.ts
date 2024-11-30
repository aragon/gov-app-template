// when adding/editing ABIs, add here only
//  functions/events that you are working with

export const DAO_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_where",
        type: "address",
      },
      {
        internalType: "address",
        name: "_who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_permissionId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "hasPermission",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
