export const QuadraticIncreasingEscrowAbi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "CURVE_ADMIN_ROLE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "_getCoefficients",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "int256[3]",
        internalType: "int256[3]",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "_getConstantCoeff",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "int256",
        internalType: "int256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "_isWarm",
    inputs: [
      {
        name: "_point",
        type: "tuple",
        internalType: "struct IEscrowCurveTokenStorage.TokenPoint",
        components: [
          {
            name: "bias",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "checkpointTs",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "writtenTs",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "coefficients",
            type: "int256[3]",
            internalType: "int256[3]",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "checkpoint",
    inputs: [
      {
        name: "_tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_oldLocked",
        type: "tuple",
        internalType: "struct ILockedBalanceIncreasing.LockedBalance",
        components: [
          {
            name: "amount",
            type: "uint208",
            internalType: "uint208",
          },
          {
            name: "start",
            type: "uint48",
            internalType: "uint48",
          },
        ],
      },
      {
        name: "_newLocked",
        type: "tuple",
        internalType: "struct ILockedBalanceIncreasing.LockedBalance",
        components: [
          {
            name: "amount",
            type: "uint208",
            internalType: "uint208",
          },
          {
            name: "start",
            type: "uint48",
            internalType: "uint48",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "clock",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "dao",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IDAO",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "escrow",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBias",
    inputs: [
      {
        name: "timeElapsed",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCoefficients",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "int256[3]",
        internalType: "int256[3]",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_escrow",
        type: "address",
        internalType: "address",
      },
      {
        name: "_dao",
        type: "address",
        internalType: "address",
      },
      {
        name: "_warmupPeriod",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "_clock",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isWarm",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewMaxBias",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setWarmupPeriod",
    inputs: [
      {
        name: "_warmupPeriod",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supplyAt",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "tokenPointHistory",
    inputs: [
      {
        name: "_tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_tokenInterval",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IEscrowCurveTokenStorage.TokenPoint",
        components: [
          {
            name: "bias",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "checkpointTs",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "writtenTs",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "coefficients",
            type: "int256[3]",
            internalType: "int256[3]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenPointIntervals",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "upgradeTo",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "votingPowerAt",
    inputs: [
      {
        name: "_tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_t",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "warmupPeriod",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "AdminChanged",
    inputs: [
      {
        name: "previousAdmin",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newAdmin",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BeaconUpgraded",
    inputs: [
      {
        name: "beacon",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WarmupSet",
    inputs: [
      {
        name: "warmup",
        type: "uint48",
        indexed: false,
        internalType: "uint48",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "DaoUnauthorized",
    inputs: [
      {
        name: "dao",
        type: "address",
        internalType: "address",
      },
      {
        name: "where",
        type: "address",
        internalType: "address",
      },
      {
        name: "who",
        type: "address",
        internalType: "address",
      },
      {
        name: "permissionId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidCheckpoint",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidTokenId",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyEscrow",
    inputs: [],
  },
] as const;
