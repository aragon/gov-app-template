export const ToucanRelayAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowInitializePath",
    inputs: [
      {
        name: "origin",
        type: "tuple",
        internalType: "struct Origin",
        components: [
          { name: "srcEid", type: "uint32", internalType: "uint32" },
          { name: "sender", type: "bytes32", internalType: "bytes32" },
          { name: "nonce", type: "uint64", internalType: "uint64" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canDispatch",
    inputs: [{ name: "_proposalId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
      { name: "", type: "uint8", internalType: "enum ToucanRelay.ErrReason" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canVote",
    inputs: [
      { name: "_proposalId", type: "uint256", internalType: "uint256" },
      { name: "_voter", type: "address", internalType: "address" },
      {
        name: "_voteOptions",
        type: "tuple",
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
      { name: "", type: "uint8", internalType: "enum ToucanRelay.ErrReason" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "composeMsgSender",
    inputs: [],
    outputs: [{ name: "sender", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "dao",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IDAO" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "dispatchVotes",
    inputs: [
      { name: "_proposalId", type: "uint256", internalType: "uint256" },
      {
        name: "_params",
        type: "tuple",
        internalType: "struct ToucanRelay.LzSendParams",
        components: [
          { name: "dstEid", type: "uint32", internalType: "uint32" },
          { name: "gasLimit", type: "uint128", internalType: "uint128" },
          {
            name: "fee",
            type: "tuple",
            internalType: "struct MessagingFee",
            components: [
              { name: "nativeFee", type: "uint256", internalType: "uint256" },
              { name: "lzTokenFee", type: "uint256", internalType: "uint256" },
            ],
          },
          { name: "options", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "endpoint",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract ILayerZeroEndpointV2" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVotes",
    inputs: [
      { name: "_proposalId", type: "uint256", internalType: "uint256" },
      { name: "_voter", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "guard",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_lzEndpoint", type: "address", internalType: "address" },
      { name: "_dao", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isProposalOpen",
    inputs: [{ name: "_proposalId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lzReceive",
    inputs: [
      {
        name: "_origin",
        type: "tuple",
        internalType: "struct Origin",
        components: [
          { name: "srcEid", type: "uint32", internalType: "uint32" },
          { name: "sender", type: "bytes32", internalType: "bytes32" },
          { name: "nonce", type: "uint64", internalType: "uint64" },
        ],
      },
      { name: "_guid", type: "bytes32", internalType: "bytes32" },
      { name: "_message", type: "bytes", internalType: "bytes" },
      { name: "_executor", type: "address", internalType: "address" },
      { name: "_extraData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "nextNonce",
    inputs: [
      { name: "", type: "uint32", internalType: "uint32" },
      { name: "", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "nonce", type: "uint64", internalType: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "oAppVersion",
    inputs: [],
    outputs: [
      { name: "senderVersion", type: "uint64", internalType: "uint64" },
      { name: "receiverVersion", type: "uint64", internalType: "uint64" },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "peers",
    inputs: [{ name: "eid", type: "uint32", internalType: "uint32" }],
    outputs: [{ name: "peer", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pluginType",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "enum IPlugin.PluginType" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proposals",
    inputs: [{ name: "proposalId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "tally",
        type: "tuple",
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "protocolVersion",
    inputs: [],
    outputs: [{ name: "", type: "uint8[3]", internalType: "uint8[3]" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "quote",
    inputs: [
      { name: "_proposalId", type: "uint256", internalType: "uint256" },
      { name: "_dstEid", type: "uint32", internalType: "uint32" },
      { name: "_gasLimit", type: "uint128", internalType: "uint128" },
    ],
    outputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct ToucanRelay.LzSendParams",
        components: [
          { name: "dstEid", type: "uint32", internalType: "uint32" },
          { name: "gasLimit", type: "uint128", internalType: "uint128" },
          {
            name: "fee",
            type: "tuple",
            internalType: "struct MessagingFee",
            components: [
              { name: "nativeFee", type: "uint256", internalType: "uint256" },
              { name: "lzTokenFee", type: "uint256", internalType: "uint256" },
            ],
          },
          { name: "options", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "refundAddress",
    inputs: [{ name: "_dstEid", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  { type: "function", name: "renounceOwnership", inputs: [], outputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "setDelegate",
    inputs: [{ name: "_delegate", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPeer",
    inputs: [
      { name: "_eid", type: "uint32", internalType: "uint32" },
      { name: "_peer", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "_interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IVotes" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeTo",
    inputs: [{ name: "newImplementation", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      { name: "newImplementation", type: "address", internalType: "address" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "vote",
    inputs: [
      { name: "_proposalId", type: "uint256", internalType: "uint256" },
      {
        name: "_voteOptions",
        type: "tuple",
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AdminChanged",
    inputs: [
      { name: "previousAdmin", type: "address", indexed: false, internalType: "address" },
      { name: "newAdmin", type: "address", indexed: false, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BeaconUpgraded",
    inputs: [{ name: "beacon", type: "address", indexed: true, internalType: "address" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [{ name: "version", type: "uint8", indexed: false, internalType: "uint8" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "previousOwner", type: "address", indexed: true, internalType: "address" },
      { name: "newOwner", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PeerSet",
    inputs: [
      { name: "eid", type: "uint32", indexed: false, internalType: "uint32" },
      { name: "peer", type: "bytes32", indexed: false, internalType: "bytes32" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [{ name: "implementation", type: "address", indexed: true, internalType: "address" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "voter", type: "address", indexed: false, internalType: "address" },
      {
        name: "voteOptions",
        type: "tuple",
        indexed: false,
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VotesDispatched",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true, internalType: "uint256" },
      {
        name: "votes",
        type: "tuple",
        indexed: false,
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "CannotDispatch",
    inputs: [
      { name: "proposalId", type: "uint256", internalType: "uint256" },
      { name: "reason", type: "uint8", internalType: "enum ToucanRelay.ErrReason" },
    ],
  },
  { type: "error", name: "CannotReceive", inputs: [] },
  {
    type: "error",
    name: "CannotVote",
    inputs: [
      { name: "proposalId", type: "uint256", internalType: "uint256" },
      { name: "voter", type: "address", internalType: "address" },
      {
        name: "voteOptions",
        type: "tuple",
        internalType: "struct IVoteContainer.Tally",
        components: [
          { name: "abstain", type: "uint256", internalType: "uint256" },
          { name: "yes", type: "uint256", internalType: "uint256" },
          { name: "no", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "reason", type: "uint8", internalType: "enum ToucanRelay.ErrReason" },
    ],
  },
  {
    type: "error",
    name: "DaoUnauthorized",
    inputs: [
      { name: "dao", type: "address", internalType: "address" },
      { name: "where", type: "address", internalType: "address" },
      { name: "who", type: "address", internalType: "address" },
      { name: "permissionId", type: "bytes32", internalType: "bytes32" },
    ],
  },
  { type: "error", name: "InvalidDelegate", inputs: [] },
  { type: "error", name: "InvalidEndpointCall", inputs: [] },
  {
    type: "error",
    name: "InvalidOptionType",
    inputs: [{ name: "optionType", type: "uint16", internalType: "uint16" }],
  },
  { type: "error", name: "InvalidToken", inputs: [] },
  { type: "error", name: "LzTokenUnavailable", inputs: [] },
  { type: "error", name: "NoPeer", inputs: [{ name: "eid", type: "uint32", internalType: "uint32" }] },
  { type: "error", name: "NoReentrant", inputs: [] },
  { type: "error", name: "NotEnoughNative", inputs: [{ name: "msgValue", type: "uint256", internalType: "uint256" }] },
  { type: "error", name: "OnlyEndpoint", inputs: [{ name: "addr", type: "address", internalType: "address" }] },
  {
    type: "error",
    name: "OnlyPeer",
    inputs: [
      { name: "eid", type: "uint32", internalType: "uint32" },
      { name: "sender", type: "bytes32", internalType: "bytes32" },
    ],
  },
] as const;