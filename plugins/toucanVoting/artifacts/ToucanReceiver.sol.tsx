export const ToucanReceiverAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "error",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "votingChainId", internalType: "uint256", type: "uint256" },
      {
        name: "votes",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
      {
        name: "reason",
        internalType: "enum ToucanReceiver.ErrReason",
        type: "uint8",
      },
    ],
    name: "CannotReceiveVotes",
  },
  {
    type: "error",
    inputs: [
      { name: "dao", internalType: "address", type: "address" },
      { name: "where", internalType: "address", type: "address" },
      { name: "who", internalType: "address", type: "address" },
      { name: "permissionId", internalType: "bytes32", type: "bytes32" },
    ],
    name: "DaoUnauthorized",
  },
  { type: "error", inputs: [], name: "InvalidDelegate" },
  { type: "error", inputs: [], name: "InvalidEndpointCall" },
  {
    type: "error",
    inputs: [{ name: "proposalRef", internalType: "uint256", type: "uint256" }],
    name: "InvalidProposalReference",
  },
  { type: "error", inputs: [], name: "LzTokenUnavailable" },
  {
    type: "error",
    inputs: [{ name: "eid", internalType: "uint32", type: "uint32" }],
    name: "NoPeer",
  },
  {
    type: "error",
    inputs: [{ name: "proposalId", internalType: "uint256", type: "uint256" }],
    name: "NoVotesToSubmit",
  },
  {
    type: "error",
    inputs: [{ name: "msgValue", internalType: "uint256", type: "uint256" }],
    name: "NotEnoughNative",
  },
  {
    type: "error",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "dao", internalType: "address", type: "address" },
    ],
    name: "NothingToRefund",
  },
  {
    type: "error",
    inputs: [{ name: "addr", internalType: "address", type: "address" }],
    name: "OnlyEndpoint",
  },
  {
    type: "error",
    inputs: [
      { name: "eid", internalType: "uint32", type: "uint32" },
      { name: "sender", internalType: "bytes32", type: "bytes32" },
    ],
    name: "OnlyPeer",
  },
  {
    type: "error",
    inputs: [
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "token", internalType: "address", type: "address" },
      { name: "dao", internalType: "address", type: "address" },
    ],
    name: "RefundFailed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "previousAdmin",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "newAdmin",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "AdminChanged",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "beacon",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "BeaconUpgraded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [{ name: "version", internalType: "uint8", type: "uint8", indexed: false }],
    name: "Initialized",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "plugin",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "caller",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "NewVotingPluginSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "eid", internalType: "uint32", type: "uint32", indexed: false },
      {
        name: "peer",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
    ],
    name: "PeerSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "votingChainId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "plugin",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "votes",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
        indexed: false,
      },
      {
        name: "revertData",
        internalType: "bytes",
        type: "bytes",
        indexed: false,
      },
    ],
    name: "SubmitVoteFailed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "plugin",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "votes",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
        indexed: false,
      },
    ],
    name: "SubmitVoteSuccess",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "implementation",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Upgraded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "votingChainId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "plugin",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "votes",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
        indexed: false,
      },
    ],
    name: "VotesReceived",
  },
  {
    type: "function",
    inputs: [],
    name: "OAPP_ADMINISTRATOR_ID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "SWEEP_COLLECTOR_ID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "origin",
        internalType: "struct Origin",
        type: "tuple",
        components: [
          { name: "srcEid", internalType: "uint32", type: "uint32" },
          { name: "sender", internalType: "bytes32", type: "bytes32" },
          { name: "nonce", internalType: "uint64", type: "uint64" },
        ],
      },
    ],
    name: "allowInitializePath",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalId", internalType: "uint256", type: "uint256" },
      {
        name: "_tally",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    name: "canReceiveVotes",
    outputs: [
      { name: "", internalType: "bool", type: "bool" },
      {
        name: "",
        internalType: "enum ToucanReceiver.ErrReason",
        type: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "composeMsgSender",
    outputs: [{ name: "sender", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "dao",
    outputs: [{ name: "", internalType: "contract IDAO", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "endpoint",
    outputs: [
      {
        name: "",
        internalType: "contract ILayerZeroEndpointV2",
        type: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalId", internalType: "uint256", type: "uint256" }],
    name: "getProposalParams",
    outputs: [
      {
        name: "",
        internalType: "struct IToucanVoting.ProposalParameters",
        type: "tuple",
        components: [
          {
            name: "votingMode",
            internalType: "enum IToucanVoting.VotingMode",
            type: "uint8",
          },
          { name: "supportThreshold", internalType: "uint32", type: "uint32" },
          { name: "startDate", internalType: "uint32", type: "uint32" },
          { name: "endDate", internalType: "uint32", type: "uint32" },
          { name: "snapshotBlock", internalType: "uint32", type: "uint32" },
          { name: "snapshotTimestamp", internalType: "uint32", type: "uint32" },
          { name: "minVotingPower", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalId", internalType: "uint256", type: "uint256" }],
    name: "getProposalRef",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalId", internalType: "uint256", type: "uint256" },
      {
        name: "_params",
        internalType: "struct IToucanVoting.ProposalParameters",
        type: "tuple",
        components: [
          {
            name: "votingMode",
            internalType: "enum IToucanVoting.VotingMode",
            type: "uint8",
          },
          { name: "supportThreshold", internalType: "uint32", type: "uint32" },
          { name: "startDate", internalType: "uint32", type: "uint32" },
          { name: "endDate", internalType: "uint32", type: "uint32" },
          { name: "snapshotBlock", internalType: "uint32", type: "uint32" },
          { name: "snapshotTimestamp", internalType: "uint32", type: "uint32" },
          { name: "minVotingPower", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    name: "getProposalRef",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "governanceToken",
    outputs: [{ name: "", internalType: "contract IVotes", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalId", internalType: "uint256", type: "uint256" },
      {
        name: "_tally",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    name: "hasEnoughVotingPowerForNewVotes",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "implementation",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_governanceToken", internalType: "address", type: "address" },
      { name: "_lzEndpoint", internalType: "address", type: "address" },
      { name: "_dao", internalType: "address", type: "address" },
      { name: "_votingPlugin", internalType: "address", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalId", internalType: "uint256", type: "uint256" }],
    name: "isProposalOpen",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalRef", internalType: "uint256", type: "uint256" }],
    name: "isProposalRefValid",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "_origin",
        internalType: "struct Origin",
        type: "tuple",
        components: [
          { name: "srcEid", internalType: "uint32", type: "uint32" },
          { name: "sender", internalType: "bytes32", type: "bytes32" },
          { name: "nonce", internalType: "uint64", type: "uint64" },
        ],
      },
      { name: "_guid", internalType: "bytes32", type: "bytes32" },
      { name: "_message", internalType: "bytes", type: "bytes" },
      { name: "_executor", internalType: "address", type: "address" },
      { name: "_extraData", internalType: "bytes", type: "bytes" },
    ],
    name: "lzReceive",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "uint32", type: "uint32" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "nextNonce",
    outputs: [{ name: "nonce", internalType: "uint64", type: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "oAppVersion",
    outputs: [
      { name: "senderVersion", internalType: "uint64", type: "uint64" },
      { name: "receiverVersion", internalType: "uint64", type: "uint64" },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "uint32", type: "uint32" }],
    name: "peers",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "pluginType",
    outputs: [{ name: "", internalType: "enum IPlugin.PluginType", type: "uint8" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_delegate", internalType: "address", type: "address" }],
    name: "setDelegate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "_eid", internalType: "uint32", type: "uint32" },
      { name: "_peer", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setPeer",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_plugin", internalType: "address", type: "address" }],
    name: "setVotingPlugin",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalId", internalType: "uint256", type: "uint256" }],
    name: "submitVotes",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "sweepNative",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_token", internalType: "address", type: "address" }],
    name: "sweepToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newImplementation", internalType: "address", type: "address" }],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newImplementation", internalType: "address", type: "address" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalId", internalType: "uint256", type: "uint256" }],
    name: "votes",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalId", internalType: "uint256", type: "uint256" },
      { name: "_votingChainId", internalType: "uint256", type: "uint256" },
    ],
    name: "votes",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalId", internalType: "uint256", type: "uint256" },
      { name: "_votingChainId", internalType: "uint256", type: "uint256" },
      { name: "_votingPlugin", internalType: "address", type: "address" },
    ],
    name: "votes",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingPlugin",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  { type: "receive", stateMutability: "payable" },
] as const;
