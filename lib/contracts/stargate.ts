// StarGate NFT Staking Contract Configuration
export const stargateContract = {
  address: {
    mainnet: "0x1856c533ac2d94340aaa8544d35a5c1d4a21dee7",
    testnet: "0x1ec1d168574603ec35b9d229843b7c2b44bcb770"
  },
  abi: [
    // View functions for levels
    {
      "inputs": [],
      "name": "getLevelIds",
      "outputs": [
        {
          "internalType": "uint8[]",
          "name": "",
          "type": "uint8[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_levelId",
          "type": "uint8"
        }
      ],
      "name": "getLevel",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isX",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "id",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "maturityBlocks",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "scaledRewardFactor",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "vetAmountRequiredToStake",
              "type": "uint256"
            }
          ],
          "internalType": "struct DataTypes.Level",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLevels",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isX",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "id",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "maturityBlocks",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "scaledRewardFactor",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "vetAmountRequiredToStake",
              "type": "uint256"
            }
          ],
          "internalType": "struct DataTypes.Level[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    // Token functions
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "idsOwnedBy",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getToken",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "levelId",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "mintedAtBlock",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "vetAmountStaked",
              "type": "uint256"
            },
            {
              "internalType": "uint48",
              "name": "lastVthoClaimTimestamp",
              "type": "uint48"
            }
          ],
          "internalType": "struct DataTypes.Token",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "tokensOwnedBy",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "levelId",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "mintedAtBlock",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "vetAmountStaked",
              "type": "uint256"
            },
            {
              "internalType": "uint48",
              "name": "lastVthoClaimTimestamp",
              "type": "uint48"
            }
          ],
          "internalType": "struct DataTypes.Token[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "canTransfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    // VTHO functions
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "claimableVetGeneratedVtho",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "claimVetGeneratedVtho",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    // Staking functions
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_levelId",
          "type": "uint8"
        }
      ],
      "name": "stake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_levelId",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "_autorenew",
          "type": "bool"
        }
      ],
      "name": "stakeAndDelegate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const
};

// StarGate level configuration - fallback data if contract calls fail
export const stargateStaticLevels = [
  {
    id: 1,
    name: "Dawn",
    isX: false,
    vetAmountRequiredToStake: "600000000000000000000000", // 600,000 VET
    vetRequiredFormatted: "600,000 VET",
    scaledRewardFactor: 100, // 1x multiplier (scaled by 100)
    maturityBlocks: 172800, // ~20 days
    maturityDays: 20,
    maxSupply: 30000,
    category: "eco",
    description: "Entry-level node requiring 600,000 VET with 20-day maturity period and 1x reward multiplier."
  },
  {
    id: 2,
    name: "Lightning",
    isX: false,
    vetAmountRequiredToStake: "1500000000000000000000000", // 1.5M VET
    vetRequiredFormatted: "1,500,000 VET",
    scaledRewardFactor: 200, // 2x multiplier
    maturityBlocks: 259200, // ~30 days
    maturityDays: 30,
    maxSupply: 10000,
    category: "eco",
    description: "Mid-tier node requiring 1.5M VET with 30-day maturity period and 2x reward multiplier."
  },
  {
    id: 3,
    name: "Flash",
    isX: false,
    vetAmountRequiredToStake: "5000000000000000000000000", // 5M VET
    vetRequiredFormatted: "5,000,000 VET",
    scaledRewardFactor: 400, // 4x multiplier
    maturityBlocks: 432000, // ~50 days
    maturityDays: 50,
    maxSupply: 3000,
    category: "eco",
    description: "High-tier node requiring 5M VET with 50-day maturity period and 4x reward multiplier."
  },
  {
    id: 4,
    name: "Strength",
    isX: true,
    vetAmountRequiredToStake: "15600000000000000000000000", // 15.6M VET
    vetRequiredFormatted: "15,600,000 VET",
    scaledRewardFactor: 600, // 6x multiplier
    maturityBlocks: 0, // No maturity period for X nodes
    maturityDays: 0,
    maxSupply: 1000,
    category: "x",
    description: "X-Series node with 6x reward multiplier. No maturity period."
  },
  {
    id: 5,
    name: "Thunder",
    isX: true,
    vetAmountRequiredToStake: "56000000000000000000000000", // 56M VET
    vetRequiredFormatted: "56,000,000 VET",
    scaledRewardFactor: 1200, // 12x multiplier
    maturityBlocks: 0, // No maturity period for X nodes
    maturityDays: 0,
    maxSupply: 500,
    category: "x",
    description: "Elite X-Series node with 12x reward multiplier. No maturity period."
  },
  {
    id: 6,
    name: "Mjolnir",
    isX: true,
    vetAmountRequiredToStake: "156000000000000000000000000", // 156M VET
    vetRequiredFormatted: "156,000,000 VET",
    scaledRewardFactor: 2400, // 24x multiplier
    maturityBlocks: 0, // No maturity period for X nodes
    maturityDays: 0,
    maxSupply: 100,
    category: "x",
    description: "Ultimate X-Series node with 24x reward multiplier. No maturity period."
  }
];