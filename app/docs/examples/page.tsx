"use client";

import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  Coins,
  Activity,
  Receipt,
  Code,
  Leaf,
  Image,
  ArrowRightLeft,
  Shield,
  Eye,
  Sparkles,
  Layers,
  Database,
  Network,
  Zap,
  Globe
} from "lucide-react";

// Import all the VeChain components
import VETVTHOBalance from "@/components/vechain-portfolio/VETVTHOBalance";
import AccountStats from "@/components/vechain-portfolio/AccountStats";
import TokenList from "@/components/vechain-tokens/TokenList";
import NetworkStats from "@/components/vechain-network/NetworkStats";
import TransactionInfo from "@/components/vechain-transactions/TransactionInfo";
import ContractInfo from "@/components/vechain-contracts/ContractInfo";
import ContractCode from "@/components/vechain-contracts/ContractCode";
import ContractVerification from "@/components/ContractVerification";
import AddressEmission from "@/components/vechain-carbon/AddressEmission";
import BlockEmission from "@/components/vechain-carbon/BlockEmission";
import TransactionEmission from "@/components/vechain-carbon/TransactionEmission";
import NetworkEmission from "@/components/vechain-carbon/NetworkEmission";
import NFTList from "@/components/vechain-nfts/NFTList";
import BridgeDashboard from "@/components/vechain-bridge/BridgeDashboard";
import BridgeQuotaAndFee from "@/components/vechain-bridge/BridgeQuotaAndFee";
import BridgeStatus from "@/components/vechain-bridge/BridgeStatus";
import BridgeTokenPairs from "@/components/vechain-bridge/BridgeTokenPairs";
import XFlowsQuote from "@/components/vechain-bridge/XFlowsQuote";
import StargateStakeInfo from "@/components/vechain-stargate/StargateStakeInfo";
import StargateStakingLevels from "@/components/vechain-stargate/StargateStakingLevels";
import StargateUserStakes from "@/components/vechain-stargate/StargateUserStakes";

// Mock data generators
const generateMockPortfolioData = () => ({
  success: true,
  data: {
    vet: (Math.random() * 100000 + 10000).toFixed(4),
    vet_staked: (Math.random() * 50000 + 5000).toFixed(4),
    vtho: (Math.random() * 200000 + 20000).toFixed(4)
  },
  meta: {
    address: "0x" + Math.random().toString(16).substring(2, 42),
    timestamp: new Date().toISOString()
  }
});

const generateMockAccountStats = () => ({
  success: true,
  data: {
    totalTransactions: Math.floor(Math.random() * 1000 + 100),
    totalVETTransferred: (Math.random() * 500000 + 50000).toFixed(4),
    totalVTHOTransferred: (Math.random() * 800000 + 80000).toFixed(4),
    firstTransactionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastTransactionDate: new Date().toISOString(),
    uniqueContractsInteracted: Math.floor(Math.random() * 50 + 10)
  },
  meta: {
    address: "0x" + Math.random().toString(16).substring(2, 42),
    timestamp: new Date().toISOString()
  }
});

const generateMockTokenData = () => ({
  success: true,
  data: Array.from({ length: 8 }, (_, i) => ({
    symbol: ['VET', 'VTHO', 'B3TR', 'WoV', 'SHA', 'VEED', 'OCE', 'PLA'][i] || `TK${i}`,
    name: [`VeChain Thor`, `VeThor Energy`, `Better Token`, `World of V`, `Safe Haven`, `VeVeed`, `OceanEx`, `PlayTable`][i] || `Token ${i}`,
    decimals: 18,
    address: "0x" + Math.random().toString(16).substring(2, 42),
    price: (Math.random() * 10 + 0.001).toFixed(6),
    circulating_supply: (Math.random() * 1000000000 + 100000000).toString(),
    total_supply: (Math.random() * 2000000000 + 1000000000).toString(),
    official: i < 4 // First 4 tokens are "official"
  })),
  meta: {
    timestamp: new Date().toISOString()
  }
});

const generateMockNetworkStats = () => ({
  success: true,
  data: {
    blockHeight: Math.floor(Math.random() * 1000000 + 15000000),
    avgBlockTime: Math.random() * 5 + 8,
    totalTransactions: Math.floor(Math.random() * 10000000 + 100000000),
    activeAddresses: Math.floor(Math.random() * 50000 + 200000),
    totalSupply: "86712634466.00",
    circulating: "73013670310.30"
  },
  meta: {
    network: "mainnet",
    timestamp: new Date().toISOString()
  }
});

const generateMockTransactionData = () => ({
  success: true,
  data: {
    txID: "0x" + Math.random().toString(16).substring(2, 66),
    size: Math.floor(Math.random() * 1000 + 200),
    blockNumber: Math.floor(Math.random() * 1000000 + 15000000),
    timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400),
    gas: Math.floor(Math.random() * 1000000 + 21000),
    origin: "0x" + Math.random().toString(16).substring(2, 42),
    clauses: [{
      to: "0x" + Math.random().toString(16).substring(2, 42),
      value: (Math.random() * 1000).toFixed(18),
      data: "0x"
    }],
    gasUsed: Math.floor(Math.random() * 50000 + 21000),
    gasPayer: "0x" + Math.random().toString(16).substring(2, 42),
    paid: (Math.random() * 0.1).toFixed(18),
    receipt: {
      gasUsed: Math.floor(Math.random() * 50000 + 21000),
      reverted: false,
      outputs: []
    }
  },
  meta: {
    blockID: "0x" + Math.random().toString(16).substring(2, 66),
    blockNumber: Math.floor(Math.random() * 1000000 + 15000000),
    blockTimestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400)
  }
});

const generateMockContractData = () => ({
  success: true,
  data: {
    address: "0x" + Math.random().toString(16).substring(2, 42),
    balance: (Math.random() * 1000).toFixed(18),
    energy: (Math.random() * 10000).toFixed(18),
    hasCode: true,
    code: "0x608060405234801561001057600080fd5b50...",
    master: "0x" + Math.random().toString(16).substring(2, 42),
    sponsor: "0x" + Math.random().toString(16).substring(2, 42),
    isContract: true
  },
  meta: {
    blockNumber: Math.floor(Math.random() * 1000000 + 15000000),
    blockID: "0x" + Math.random().toString(16).substring(2, 66),
    timestamp: new Date().toISOString()
  }
});

const generateMockStargateData = () => ({
  success: true,
  data: {
    levels: [
      {
        id: 8,
        name: "Dawn",
        isX: false,
        vetAmountRequiredToStake: "1000000000000000000",
        vetRequiredFormatted: "1 VET",
        scaledRewardFactor: 1.2,
        maturityBlocks: 50400,
        maturityDays: 7,
        category: "Standard",
        description: "Entry-level StarGate NFT with 7-day maturity period"
      },
      {
        id: 9,
        name: "Lightning",
        isX: false,
        vetAmountRequiredToStake: "5000000000000000000",
        vetRequiredFormatted: "5 VET",
        scaledRewardFactor: 1.3,
        maturityBlocks: 100800,
        maturityDays: 14,
        category: "Standard",
        description: "Low-tier StarGate NFT with enhanced rewards"
      },
      {
        id: 4,
        name: "VeThorX",
        isX: true,
        vetAmountRequiredToStake: "100000000000000000000000",
        vetRequiredFormatted: "100,000 VET",
        scaledRewardFactor: 3.0,
        maturityBlocks: 0,
        maturityDays: 0,
        category: "X-Series",
        description: "Premium X-Series StarGate with no maturity period"
      }
    ],
    totalLevels: 10
  },
  meta: {
    network: "testnet",
    contractAddress: "0x1234567890123456789012345678901234567890",
    timestamp: new Date().toISOString()
  }
});

// Component categories
const componentCategories = [
  {
    id: "portfolio",
    name: "Portfolio & Balances",
    description: "Wallet balance and account statistics components",
    icon: Wallet,
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    components: [
      {
        name: "VET/VTHO Balance",
        description: "Display VET and VTHO token balances with staking info",
        component: VETVTHOBalance,
        mockData: generateMockPortfolioData
      },
      {
        name: "Account Statistics", 
        description: "Comprehensive account analytics and transaction history",
        component: AccountStats,
        mockData: generateMockAccountStats
      }
    ]
  },
  {
    id: "tokens",
    name: "Token Operations",
    description: "VIP-180 token management and analytics",
    icon: Coins,
    color: "from-green-500/20 to-green-600/10",
    borderColor: "border-green-500/30",
    components: [
      {
        name: "Token Portfolio",
        description: "Complete token portfolio with balances and values",
        component: TokenList,
        mockData: generateMockTokenData
      }
    ]
  },
  {
    id: "network",
    name: "Network Analytics",
    description: "Real-time VeChain network statistics and metrics",
    icon: Activity,
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/30",
    components: [
      {
        name: "Network Statistics",
        description: "Live blockchain metrics and network performance",
        component: NetworkStats,
        mockData: generateMockNetworkStats
      }
    ]
  },
  {
    id: "transactions",
    name: "Transaction Details",
    description: "Detailed transaction information and analysis",
    icon: Receipt,
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "border-orange-500/30",
    components: [
      {
        name: "Transaction Info",
        description: "Complete transaction details with gas and receipt info",
        component: TransactionInfo,
        mockData: generateMockTransactionData
      }
    ]
  },
  {
    id: "contracts",
    name: "Smart Contracts",
    description: "Contract verification and code analysis tools",
    icon: Code,
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/30",
    components: [
      {
        name: "Contract Information",
        description: "Smart contract details and verification status",
        component: ContractInfo,
        mockData: generateMockContractData
      },
      {
        name: "Contract Code",
        description: "Contract bytecode and source code viewer",
        component: ContractCode,
        mockData: () => ({
          success: true,
          data: {
            code: "0x608060405234801561001057600080fd5b50600436106100415760003560e01c8063445df0ac146100465780638da5cb5b14610064578063fdacd57614610082575b600080fd5b61004e610098565b60405161005b9190610123565b60405180910390f35b61006c6100a1565b6040516100799190610142565b60405180910390f35b61009660048036038101906100919190610188565b6100c5565b005b60008054905090565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b8060008190555050565b6000819050919050565b6100e2816100cf565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610113826100e8565b9050919050565b61012381610108565b82525050565b600060208201905061013e60008301846100d9565b92915050565b600060208201905061015960008301846101...",
            bytecode: "608060405234801561001057600080fd5b50...",
            hasCode: true,
            isVerified: Math.random() > 0.5,
            sourceName: "SimpleStorage.sol",
            compilerVersion: "0.8.19+commit.7dd6d404"
          },
          meta: {
            contractAddress: "0x" + Math.random().toString(16).substring(2, 42),
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "Contract Verification",
        description: "Verify smart contracts with source code and compilation details",
        component: ContractVerification,
        mockData: () => ({
          onVerify: (data: any) => {
            console.log('Mock verification:', data);
            // Simulate verification process in the example
          }
        })
      }
    ]
  },
  {
    id: "carbon",
    name: "Carbon Emissions",
    description: "Environmental impact tracking and carbon footprint analysis",
    icon: Leaf,
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    components: [
      {
        name: "Address Emission",
        description: "Carbon footprint analysis for wallet addresses",
        component: AddressEmission,
        mockData: () => ({
          success: true,
          data: {
            address: "0x" + Math.random().toString(16).substring(2, 42),
            totalEmissions: (Math.random() * 100 + 10).toFixed(6),
            transactionCount: Math.floor(Math.random() * 500 + 50),
            avgEmissionPerTx: (Math.random() * 0.5 + 0.01).toFixed(6),
            period: "30 days"
          },
          meta: {
            timestamp: new Date().toISOString(),
            unit: "kg CO2"
          }
        })
      },
      {
        name: "Block Emission",
        description: "Carbon emissions analysis for specific blocks",
        component: BlockEmission,
        mockData: () => ({
          success: true,
          data: {
            blockNumber: Math.floor(Math.random() * 1000000 + 15000000),
            totalEmissions: (Math.random() * 5 + 0.5).toFixed(6),
            transactionCount: Math.floor(Math.random() * 100 + 10),
            timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400)
          },
          meta: {
            unit: "kg CO2",
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "Transaction Emission",
        description: "Individual transaction carbon footprint calculation",
        component: TransactionEmission,
        mockData: () => ({
          success: true,
          data: {
            txID: "0x" + Math.random().toString(16).substring(2, 66),
            emissions: (Math.random() * 0.1 + 0.001).toFixed(6),
            gasUsed: Math.floor(Math.random() * 50000 + 21000),
            emissionFactor: (Math.random() * 0.000005 + 0.000001).toFixed(9)
          },
          meta: {
            unit: "kg CO2",
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "Network Emission",
        description: "Overall VeChain network carbon emissions statistics",
        component: NetworkEmission,
        mockData: () => ({
          success: true,
          data: {
            totalNetworkEmissions: (Math.random() * 1000000 + 100000).toFixed(2),
            dailyEmissions: (Math.random() * 5000 + 500).toFixed(2),
            emissionTrend: Math.random() > 0.5 ? "decreasing" : "increasing",
            efficiencyRating: Math.random() * 5 + 7
          },
          meta: {
            unit: "kg CO2",
            period: "24 hours",
            timestamp: new Date().toISOString()
          }
        })
      }
    ]
  },
  {
    id: "nfts",
    name: "NFT Management",
    description: "VIP-181 NFT operations and collection analytics",
    icon: Image,
    color: "from-pink-500/20 to-pink-600/10",
    borderColor: "border-pink-500/30",
    components: [
      {
        name: "NFT Collections",
        description: "VeChain NFT collections and contract information",
        component: NFTList,
        mockData: () => ({
          success: true,
          data: Array.from({ length: 6 }, (_, i) => ({
            contract: "0x" + Math.random().toString(16).substring(2, 42),
            name: [
              "VeChain Punks", 
              "Thor Genesis", 
              "VeChain Heroes", 
              "Digital Assets", 
              "NFT Collectibles", 
              "Rare Items"
            ][i] || `Collection ${i + 1}`,
            symbol: [`VPUNK`, `THOR`, `HERO`, `DIGI`, `NFTC`, `RARE`][i] || `NFT${i}`,
            type: ["VIP181", "ERC721", "VIP181", "ERC1155", "VIP181", "ERC721"][i] || "VIP181",
            nft: Math.floor(Math.random() * 10000 + 100),
            official: i < 3, // First 3 are official
            verified: Math.random() > 0.3 // Most are verified
          })),
          meta: {
            timestamp: new Date().toISOString()
          }
        })
      }
    ]
  },
  {
    id: "bridge",
    name: "Cross-Chain Bridge",
    description: "Multi-chain asset transfers and bridge operations",
    icon: ArrowRightLeft,
    color: "from-cyan-500/20 to-cyan-600/10",
    borderColor: "border-cyan-500/30",
    components: [
      {
        name: "Bridge Dashboard",
        description: "Overview of cross-chain bridge operations and status",
        component: BridgeDashboard,
        mockData: () => ({
          success: true,
          data: {
            totalBridges: Math.floor(Math.random() * 1000 + 500),
            totalVolume: (Math.random() * 10000000 + 1000000).toFixed(2),
            activeBridges: Math.floor(Math.random() * 50 + 20),
            supportedChains: 25,
            recentTransactions: Array.from({ length: 5 }, (_, i) => ({
              txHash: "0x" + Math.random().toString(16).substring(2, 66),
              fromChain: "VeChain",
              toChain: ["Ethereum", "Polygon", "BSC", "Avalanche"][Math.floor(Math.random() * 4)],
              amount: (Math.random() * 1000 + 100).toFixed(4),
              token: "VET",
              status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)]
            }))
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "Token Pairs",
        description: "Available token pairs for cross-chain bridging",
        component: BridgeTokenPairs,
        mockData: () => ({
          success: true,
          data: {
            pairs: Array.from({ length: 8 }, (_, i) => ({
              fromToken: "VET",
              toToken: ["ETH", "MATIC", "BNB", "AVAX", "FTM", "ONE", "MOVR", "GLMR"][i],
              fromChain: "VeChain",
              toChain: ["Ethereum", "Polygon", "BSC", "Avalanche", "Fantom", "Harmony", "Moonriver", "Moonbeam"][i],
              minAmount: (Math.random() * 10 + 1).toFixed(4),
              maxAmount: (Math.random() * 100000 + 10000).toFixed(4),
              fee: (Math.random() * 0.01 + 0.001).toFixed(4),
              isActive: Math.random() > 0.2
            }))
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "Bridge Status",
        description: "Real-time bridge transaction status tracking",
        component: BridgeStatus,
        mockData: () => ({
          success: true,
          data: {
            txHash: "0x" + Math.random().toString(16).substring(2, 66),
            status: ["pending", "confirmed", "completed", "failed"][Math.floor(Math.random() * 4)],
            fromChain: "VeChain",
            toChain: "Ethereum",
            amount: (Math.random() * 1000 + 100).toFixed(4),
            token: "VET",
            confirmations: Math.floor(Math.random() * 20 + 1),
            requiredConfirmations: 20,
            estimatedTime: Math.floor(Math.random() * 30 + 5) + " minutes"
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "Quote & Fees",
        description: "Bridge operation quotes and fee calculations",
        component: BridgeQuotaAndFee,
        mockData: () => ({
          success: true,
          data: {
            amount: (Math.random() * 1000 + 100).toFixed(4),
            fromToken: "VET",
            toToken: "ETH",
            exchangeRate: (Math.random() * 0.001 + 0.0001).toFixed(6),
            bridgeFee: (Math.random() * 10 + 1).toFixed(4),
            networkFee: (Math.random() * 0.01 + 0.001).toFixed(6),
            totalFee: (Math.random() * 15 + 2).toFixed(4),
            estimatedReceived: (Math.random() * 985 + 85).toFixed(4),
            processingTime: Math.floor(Math.random() * 30 + 10) + " minutes"
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        })
      },
      {
        name: "XFlows Quote",
        description: "Advanced cross-chain swap quotes with optimal routing",
        component: XFlowsQuote,
        mockData: () => ({
          success: true,
          data: {
            inputAmount: (Math.random() * 1000 + 100).toFixed(4),
            inputToken: "VET",
            outputToken: "USDC",
            outputAmount: (Math.random() * 50 + 10).toFixed(6),
            route: ["VeChain", "Ethereum", "Polygon"],
            priceImpact: (Math.random() * 0.05 + 0.001).toFixed(4),
            slippage: "0.5%",
            gasEstimate: (Math.random() * 0.01 + 0.005).toFixed(6),
            executionTime: Math.floor(Math.random() * 45 + 15) + " minutes"
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        })
      }
    ]
  },
  {
    id: "stargate",
    name: "StarGate Staking",
    description: "NFT-based VET staking system with tier rewards",
    icon: Shield,
    color: "from-yellow-500/20 to-yellow-600/10",
    borderColor: "border-yellow-500/30",
    components: [
      {
        name: "Staking Levels",
        description: "All available StarGate staking tiers and requirements",
        component: StargateStakingLevels,
        mockData: generateMockStargateData
      },
      {
        name: "Stake Information",
        description: "Individual StarGate NFT details and rewards",
        component: StargateStakeInfo,
        mockData: () => ({
          success: true,
          data: {
            tokenId: "123456",
            levelId: 8,
            levelName: "Dawn",
            isX: false,
            vetStaked: "1000000000000000000",
            vetStakedFormatted: "1 VET",
            maturityBlock: Math.floor(Math.random() * 1000000 + 15000000),
            isMature: Math.random() > 0.5,
            canTransfer: Math.random() > 0.3,
            claimableVTHO: (Math.random() * 100).toFixed(18),
            ownerAddress: "0x" + Math.random().toString(16).substring(2, 42)
          }
        })
      },
      {
        name: "User Stakes",
        description: "Portfolio of user's StarGate NFT stakes",
        component: StargateUserStakes,
        mockData: () => ({
          success: true,
          data: {
            stakes: Array.from({ length: 3 }, (_, i) => ({
              tokenId: (123456 + i).toString(),
              levelId: [8, 9, 4][i],
              levelName: ["Dawn", "Lightning", "VeThorX"][i],
              isX: i === 2,
              vetStaked: ["1", "5", "100000"][i] + "000000000000000000",
              vetStakedFormatted: ["1 VET", "5 VET", "100,000 VET"][i],
              maturityBlock: Math.floor(Math.random() * 1000000 + 15000000),
              isMature: i < 2,
              canTransfer: i < 2,
              claimableVTHO: (Math.random() * 100).toFixed(18)
            })),
            totalStakes: 3,
            totalVETStaked: "100006000000000000000000",
            totalClaimableVTHO: (Math.random() * 300).toFixed(18)
          }
        })
      }
    ]
  }
];

// Carousel component
function ComponentCarousel({ category }: { category: typeof componentCategories[0] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mockData, setMockData] = useState<any>({});

  useEffect(() => {
    // Generate initial mock data for all components
    const initialData: any = {};
    category.components.forEach((comp, index) => {
      initialData[index] = comp.mockData();
    });
    setMockData(initialData);
  }, [category]);

  const refreshMockData = (componentIndex: number) => {
    setMockData((prev: any) => ({
      ...prev,
      [componentIndex]: category.components[componentIndex].mockData()
    }));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % category.components.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + category.components.length) % category.components.length);
  };

  const currentComponent = category.components[currentIndex];
  const CurrentComponent = currentComponent?.component;

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} border ${category.borderColor}`}>
            <category.icon className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{category.name}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {category.components.length} component{category.components.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Component Navigation */}
      {category.components.length > 1 && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={category.components.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <h4 className="font-semibold">{currentComponent?.name}</h4>
            <p className="text-sm text-muted-foreground">{currentComponent?.description}</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={category.components.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Component Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category.id}-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Demo Controls */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Live Demo</span>
                <Badge variant="secondary" className="text-xs">Mock Data</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshMockData(currentIndex)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>

            {/* Component Demo */}
            <div className="p-6 bg-background border rounded-lg">
              {CurrentComponent && mockData[currentIndex] && (
                currentComponent?.name === "Contract Verification" ? (
                  <CurrentComponent 
                    onVerify={mockData[currentIndex].onVerify}
                  />
                ) : (
                  <CurrentComponent 
                    data={mockData[currentIndex]} 
                    isLoading={false}
                  />
                )
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        {category.components.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {category.components.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// AI Prompts and Tools Documentation Component
function AIPromptsAndTools() {
  const [selectedCategory, setSelectedCategory] = useState("wallet");

  const promptCategories = [
    {
      id: "wallet",
      name: "Wallet & Account",
      icon: Wallet,
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      description: "Manage wallet connections and account information",
      prompts: [
        {
          title: "Check My Balance",
          example: "What's my VET and VTHO balance?",
          description: "Get your current native token balances",
          tools: ["getUserWalletInfo", "getVETVTHOBalance"]
        },
        {
          title: "Account Statistics",
          example: "Show me my account stats and transaction history",
          description: "Comprehensive account analytics and activity metrics",
          tools: ["getAccountStats", "getAccountInfo"]
        },
        {
          title: "Connect Wallet",
          example: "Help me connect my VeChain wallet",
          description: "Connect to VeWorld or other VeChain wallets",
          tools: ["getUserWalletInfo"]
        }
      ]
    },
    {
      id: "tokens",
      name: "Token Operations",
      icon: Coins,
      color: "from-green-500/20 to-green-600/10",
      borderColor: "border-green-500/30",
      description: "VIP-180 token management and transfers",
      prompts: [
        {
          title: "Send VET/VTHO",
          example: "Send 100 VET to 0x1234...5678",
          description: "Transfer native VET and VTHO tokens",
          tools: ["makeSendTransaction", "getVETVTHOBalance"]
        },
        {
          title: "Token Transfer",
          example: "Send 50 B3TR tokens to my friend",
          description: "Transfer VIP-180 tokens with automatic balance checking",
          tools: ["makeTokenTransfer", "getTokenInfo", "getVIP180Balance"]
        },
        {
          title: "Check Token Price",
          example: "What's the current price of B3TR?",
          description: "Get real-time token prices and market data",
          tools: ["getTokenPrice", "getTokenList"]
        },
        {
          title: "Discover Tokens",
          example: "Show me all available VeChain tokens",
          description: "Browse popular VIP-180 tokens on VeChain",
          tools: ["getTokenList", "getTokenInfo"]
        }
      ]
    },
    {
      id: "nfts",
      name: "NFT Management",
      icon: Image,
      color: "from-pink-500/20 to-pink-600/10",
      borderColor: "border-pink-500/30",
      description: "VIP-181 NFT operations and analytics",
      prompts: [
        {
          title: "Check My NFTs",
          example: "What NFTs do I own?",
          description: "View your VIP-181 NFT collections",
          tools: ["getVIP181Balance", "getNFTInfo"]
        },
        {
          title: "NFT Transfer History",
          example: "Show me my recent NFT trades",
          description: "Track NFT transfer history and trading activity",
          tools: ["getNFTTransfers"]
        },
        {
          title: "NFT Collection Info",
          example: "Tell me about VeChain Punks collection",
          description: "Get detailed information about NFT collections",
          tools: ["getNFTInfo"]
        }
      ]
    },
    {
      id: "transactions",
      name: "Transactions",
      icon: Receipt,
      color: "from-orange-500/20 to-orange-600/10",
      borderColor: "border-orange-500/30",
      description: "Transaction monitoring and analysis",
      prompts: [
        {
          title: "Check Transaction",
          example: "What's the status of transaction 0xabc123...?",
          description: "Get detailed transaction information and status",
          tools: ["getTransactionInfo", "getTransactionStatus"]
        },
        {
          title: "Transaction History",
          example: "Show me my recent transactions",
          description: "View account transaction history with details",
          tools: ["getAccountStats", "getTransactionInfo"]
        },
        {
          title: "Gas Analysis",
          example: "How much gas did my last transaction use?",
          description: "Analyze transaction gas usage and fees",
          tools: ["getTransactionInfo"]
        }
      ]
    },
    {
      id: "bridge",
      name: "Cross-Chain Bridge",
      icon: ArrowRightLeft,
      color: "from-cyan-500/20 to-cyan-600/10",
      borderColor: "border-cyan-500/30",
      description: "Multi-chain asset transfers",
      prompts: [
        {
          title: "Bridge to Ethereum",
          example: "Bridge 1000 VET to Ethereum",
          description: "Transfer VET/VTHO to 25+ supported blockchains",
          tools: ["makeBridgeTransaction", "getTokenPairs", "getQuotaAndFee"]
        },
        {
          title: "Check Bridge Routes",
          example: "What tokens can I bridge from VeChain?",
          description: "Discover 300+ available bridge token pairs",
          tools: ["getTokenPairs"]
        },
        {
          title: "Bridge Status",
          example: "Check my bridge transaction status",
          description: "Monitor cross-chain transfer progress",
          tools: ["checkBridgeStatus"]
        },
        {
          title: "XFlows Swap",
          example: "Swap VET for ETH on Ethereum",
          description: "Advanced swap+bridge combinations with DEX integration",
          tools: ["getXFlowsQuote", "buildXFlowsTransaction", "checkXFlowsStatus"]
        }
      ]
    },
    {
      id: "staking",
      name: "StarGate Staking",
      icon: Shield,
      color: "from-yellow-500/20 to-yellow-600/10",
      borderColor: "border-yellow-500/30",
      description: "VET staking with NFT rewards",
      prompts: [
        {
          title: "Stake VET",
          example: "Stake 1.5M VET for Lightning level",
          description: "Mint StarGate NFTs by staking VET (6 levels available)",
          tools: ["stakeVET", "getStakingLevels"]
        },
        {
          title: "Check My Stakes",
          example: "Show me all my StarGate stakes",
          description: "View your complete staking portfolio and rewards",
          tools: ["getUserStakes", "getStakeInfo"]
        },
        {
          title: "Claim Rewards",
          example: "Claim VTHO rewards from my stakes",
          description: "Claim accumulated VTHO from staking rewards",
          tools: ["claimVTHORewards", "getStakeInfo"]
        },
        {
          title: "Unstake VET",
          example: "Unstake my mature Lightning NFT",
          description: "Retrieve staked VET after maturity period",
          tools: ["unstakeStargate", "getUserStakes"]
        }
      ]
    },
    {
      id: "contracts",
      name: "Smart Contracts",
      icon: Code,
      color: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-500/30",
      description: "Contract verification and interactions",
      prompts: [
        {
          title: "Verify Contract",
          example: "Verify my smart contract with source code",
          description: "Submit contracts for verification on VeChain",
          tools: ["verifyContract", "verifyContractMetadata"]
        },
        {
          title: "Contract Information",
          example: "Tell me about contract 0x1234...5678",
          description: "Get contract details and verification status",
          tools: ["getContractInfo", "getContractCode"]
        },
        {
          title: "Interact with Contract",
          example: "Call the transfer function on token contract",
          description: "Create custom smart contract interactions",
          tools: ["makeContractTransaction"]
        }
      ]
    },
    {
      id: "analytics",
      name: "Blockchain Analytics",
      icon: Activity,
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      description: "Network statistics and analysis",
      prompts: [
        {
          title: "Network Stats",
          example: "What's the current VeChain network status?",
          description: "Real-time blockchain metrics and performance",
          tools: ["getNetworkStats", "getAuthorityNodes"]
        },
        {
          title: "Block Information",
          example: "Show me details for block 15000000",
          description: "Get detailed information about VeChain blocks",
          tools: ["getBlockInfo"]
        },
        {
          title: "Carbon Footprint",
          example: "What's my carbon emission impact?",
          description: "Calculate environmental impact of blockchain activities",
          tools: ["getAddressEmission", "getTransactionEmission"]
        }
      ]
    },
    {
      id: "utilities",
      name: "Utilities",
      icon: Zap,
      color: "from-indigo-500/20 to-indigo-600/10",
      borderColor: "border-indigo-500/30",
      description: "Helper tools and conversions",
      prompts: [
        {
          title: "Sign Message",
          example: "Sign this message with my wallet",
          description: "Create message signatures for authentication",
          tools: ["signMessage"]
        },
        {
          title: "Convert Values",
          example: "Convert 0x1234 to decimal",
          description: "Convert between hexadecimal and decimal values",
          tools: ["convertHexToDecimal"]
        }
      ]
    }
  ];

  const currentCategory = promptCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">VeChain AI Terminal Capabilities</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover what you can accomplish with VeChain AI Terminal. From simple balance checks to complex cross-chain operations, 
          our AI understands natural language and handles the technical complexity for you.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">90+</div>
            <div className="text-sm text-muted-foreground">AI Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">25+</div>
            <div className="text-sm text-muted-foreground">Blockchains</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">300+</div>
            <div className="text-sm text-muted-foreground">Token Pairs</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Natural Language</div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promptCategories.map((category) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-xl border text-left transition-all duration-300 ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} ${category.borderColor} scale-105`
                : 'bg-card/50 border-border hover:bg-card/70 hover:scale-102'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <category.icon className="h-6 w-6" />
              <h3 className="font-semibold">{category.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
            <Badge variant="outline" className="text-xs">
              {category.prompts.length} example{category.prompts.length !== 1 ? 's' : ''}
            </Badge>
          </motion.button>
        ))}
      </div>

      {/* Selected Category Details */}
      {currentCategory && (
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-full bg-gradient-to-r ${currentCategory.color} border ${currentCategory.borderColor}`}>
                <currentCategory.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentCategory.name}</h3>
                <p className="text-muted-foreground">{currentCategory.description}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {currentCategory.prompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-zinc-800/50 rounded-lg border border-zinc-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">{prompt.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{prompt.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-zinc-400">Example Prompt</span>
                    </div>
                    <code className="text-green-400 font-mono">{prompt.example}</code>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-zinc-400">Uses tools:</span>
                    {prompt.tools.map((tool, toolIndex) => (
                      <Badge key={toolIndex} variant="outline" className="text-xs font-mono">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Start CTA */}
      <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Try VeChain AI Terminal?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Start with any of these examples or simply describe what you want to accomplish. 
          Our AI will guide you through the process step by step.
        </p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Try Now
          </Button>
          <Button variant="outline">
            <Code className="w-4 h-4 mr-2" />
            View API Docs
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Badge variant="outline" className="mb-4">
          <Layers className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">Interactive Examples & AI Documentation</span>
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          VeChain AI Terminal
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mb-8">
          Experience the "Post-Website Era" where blockchain operations become as simple as conversation. 
          Explore our components and discover what VeChain AI can do for you.
        </p>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 mb-12">
          <TabsTrigger value="components" className="data-[state=active]:bg-zinc-700 text-lg py-3">
            <Layers className="w-5 h-5 mr-2" />
            Component Showcase
          </TabsTrigger>
          <TabsTrigger value="prompts" className="data-[state=active]:bg-zinc-700 text-lg py-3">
            <Sparkles className="w-5 h-5 mr-2" />
            AI Prompts & Tools
          </TabsTrigger>
        </TabsList>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Interactive Component Library</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Explore our comprehensive collection of VeChain blockchain components with live mock data.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-card/50 rounded-lg border">
                <div className="text-2xl font-bold text-primary">{componentCategories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border">
                <div className="text-2xl font-bold text-primary">
                  {componentCategories.reduce((acc, cat) => acc + cat.components.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border">
                <div className="text-2xl font-bold text-primary">90+</div>
                <div className="text-sm text-muted-foreground">AI Tools</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Tested</div>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              Component Categories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {componentCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(index)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    selectedCategory === index
                      ? `bg-gradient-to-r ${category.color} ${category.borderColor} scale-105`
                      : 'bg-card/50 border-border hover:bg-card/70 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className="h-6 w-6" />
                    <h4 className="font-semibold">{category.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {category.components.length} component{category.components.length !== 1 ? 's' : ''}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Component Showcase */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="p-8">
              <ComponentCarousel category={componentCategories[selectedCategory]} />
            </Card>
          </motion.section>
        </TabsContent>

        {/* AI Prompts & Tools Tab */}
        <TabsContent value="prompts">
          <AIPromptsAndTools />
        </TabsContent>
      </Tabs>

      {/* Post-Website Era CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center mt-16"
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Experience the Post-Website Era</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            These components and AI tools power conversational blockchain operations. Instead of navigating complex interfaces, 
            users simply tell AI what they want to accomplish.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Zap className="mr-2 h-5 w-5" />
              Try VeChain Terminal
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Globe className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}