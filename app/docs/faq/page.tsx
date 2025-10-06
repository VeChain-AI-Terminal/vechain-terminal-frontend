"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight,
  HelpCircle,
  Wallet,
  Coins,
  Shield,
  Code,
  ArrowRightLeft,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "getting-started",
    question: "What is VeChain AI Terminal?",
    answer: "VeChain AI Terminal is an AI-powered blockchain interface that allows you to interact with VeChain using natural language. Instead of navigating complex interfaces, you simply tell the AI what you want to accomplish - like 'check my VET balance' or 'bridge 1000 VET to Ethereum' - and it handles the technical complexity for you."
  },
  {
    category: "getting-started",
    question: "How do I get started with VeChain AI Terminal?",
    answer: "Getting started is simple: 1) Connect your VeChain wallet (VeWorld or compatible), 2) Start typing what you want to do in natural language, 3) The AI will guide you through each step and handle the blockchain interactions. No technical knowledge required!"
  },
  {
    category: "getting-started",
    question: "What wallets are supported?",
    answer: "VeChain AI Terminal supports VeWorld (the official VeChain wallet) and other VeChain-compatible wallets through VeChain DApp Kit integration. Make sure your wallet is connected to the correct network (mainnet or testnet)."
  },
  {
    category: "getting-started",
    question: "Is VeChain AI Terminal free to use?",
    answer: "Yes, VeChain AI Terminal is free to use. You only pay standard VeChain network fees (in VTHO) for transactions you choose to execute. The AI interface and all tools are provided at no additional cost."
  },

  // Wallet & Transactions
  {
    category: "wallet",
    question: "How do I check my VET and VTHO balance?",
    answer: "Simply ask: 'What's my VET and VTHO balance?' or 'Show my wallet balance'. The AI will instantly fetch and display your current native token balances, including any staked VET."
  },
  {
    category: "wallet",
    question: "Can I send VET and VTHO to other addresses?",
    answer: "Yes! Just say something like 'Send 100 VET to [address]' or 'Transfer 500 VTHO to my friend'. The AI will check your balance, calculate fees, and create the transaction for you to approve."
  },
  {
    category: "wallet",
    question: "What about VIP-180 tokens like B3TR or WoV?",
    answer: "VeChain AI Terminal supports all VIP-180 tokens. Try: 'Send 50 B3TR to [address]' or 'What's the price of WoV?'. The AI automatically handles token contracts, decimals, and approvals."
  },
  {
    category: "wallet",
    question: "How does gas fee management work?",
    answer: "The AI automatically reserves VTHO for gas fees and will never let you spend 100% of your balance. It calculates optimal gas amounts and warns you if you have insufficient VTHO for transactions."
  },

  // Cross-Chain Bridge
  {
    category: "bridge",
    question: "What blockchains can I bridge to from VeChain?",
    answer: "VeChain AI Terminal supports bridging to 25+ blockchains including Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, Avalanche, and many more. Ask 'What chains can I bridge to?' to see all available options."
  },
  {
    category: "bridge",
    question: "How do I bridge VET to another blockchain?",
    answer: "Just say 'Bridge 1000 VET to Ethereum' or your desired destination. The AI will check bridge quotas, calculate fees, and guide you through the approval and bridging process step by step."
  },
  {
    category: "bridge",
    question: "What's the difference between WanBridge and XFlows?",
    answer: "WanBridge is for direct token transfers between chains. XFlows adds DEX integration for swap+bridge combinations - like 'Swap VET for ETH on Ethereum'. XFlows offers 6 different work modes for various cross-chain strategies."
  },
  {
    category: "bridge",
    question: "How long do bridge transactions take?",
    answer: "Bridge times vary by destination chain and network congestion. Typically 5-30 minutes. The AI will provide real-time status updates and notify you when transfers complete. You can ask 'Check my bridge transaction status' anytime."
  },
  {
    category: "bridge",
    question: "Are there limits on bridge amounts?",
    answer: "Yes, each bridge route has minimum and maximum limits that change based on liquidity. The AI will check current quotas and fees before creating transactions, ensuring your amount is within valid ranges."
  },

  // StarGate Staking
  {
    category: "staking",
    question: "What is StarGate staking?",
    answer: "StarGate is VeChain's official VET staking protocol that mints NFTs representing your stake. There are 10 testnet levels from Dawn (1 VET) to Mjolnir X (1560 VET), with different tiers: New Eco, Eco, and X-Series, each with different reward multipliers and maturity periods."
  },
  {
    category: "staking",
    question: "How do I stake VET with StarGate?",
    answer: "Say 'Stake 5 VET for Lightning level' or 'Show me staking options'. The AI will display all levels, requirements, and rewards, then help you create the staking transaction to mint your StarGate NFT."
  },
  {
    category: "staking",
    question: "What are X-Series staking levels?",
    answer: "X-Series levels (VeThor X, Strength X, Thunder X, Mjolnir X) have no maturity period and can be unstaked immediately. They offer higher reward multipliers but require more VET (60, 160, 560, 1560 VET respectively on testnet)."
  },
  {
    category: "staking",
    question: "How do I claim staking rewards?",
    answer: "Ask 'Claim my staking rewards' or 'Show my StarGate stakes'. The AI will display all your stakes, claimable VTHO amounts, and create claiming transactions for any mature rewards."
  },
  {
    category: "staking",
    question: "When can I unstake my VET?",
    answer: "Standard levels (Dawn, Lightning, Flash) have maturity periods (20-50 days). X-Series can be unstaked anytime. Check with 'Show my stakes' - the AI will indicate which are ready for unstaking."
  },

  // Smart Contracts
  {
    category: "contracts",
    question: "Can I verify smart contracts?",
    answer: "Yes! Upload your source code and say 'Verify my smart contract'. The AI supports both standard JSON input and metadata-based verification. It handles compiler versions, optimization settings, and submission to VeChainStats."
  },
  {
    category: "contracts",
    question: "How do I interact with custom smart contracts?",
    answer: "Describe what you want to do: 'Call the transfer function on contract [address]' or 'Execute mint function with parameters'. The AI will help build the transaction with proper function signatures and parameters."
  },
  {
    category: "contracts",
    question: "Can I view contract source code?",
    answer: "For verified contracts, ask 'Show me the source code for [contract address]'. The AI will fetch verification details, source files, compiler settings, and ABI information from VeChainStats."
  },

  // NFTs
  {
    category: "nfts",
    question: "How do I manage my VeChain NFTs?",
    answer: "Ask 'What NFTs do I own?' or 'Show my NFT collections'. The AI will display all your VIP-181 NFTs with collection details, floor prices, and transfer history."
  },
  {
    category: "nfts",
    question: "Can I transfer NFTs?",
    answer: "Yes, say 'Transfer my NFT [token ID] to [address]' or 'Send my VeChain Punk to my friend'. The AI will verify ownership and create the transfer transaction."
  },
  {
    category: "nfts",
    question: "How do I track NFT trading activity?",
    answer: "Use 'Show my NFT transfer history' to see all your NFT trades, purchases, and sales. The AI provides detailed transaction history with timestamps and values."
  },

  // Analytics & Data
  {
    category: "analytics",
    question: "How do I check VeChain network status?",
    answer: "Ask 'What's the VeChain network status?' for real-time metrics including block height, transaction volume, active addresses, and authority node performance."
  },
  {
    category: "analytics",
    question: "Can I track my carbon footprint?",
    answer: "Yes! VeChain AI Terminal calculates carbon emissions for your blockchain activities. Ask 'What's my carbon footprint?' to see environmental impact analysis of your transactions."
  },
  {
    category: "analytics",
    question: "How do I analyze transaction details?",
    answer: "Provide any transaction hash: 'Analyze transaction 0x...' and get detailed information including gas usage, events, clauses, and success/failure status."
  },

  // Troubleshooting
  {
    category: "troubleshooting",
    question: "Why isn't my wallet connecting?",
    answer: "Common solutions: 1) Ensure VeWorld or your wallet is installed and unlocked, 2) Check you're on the correct network (mainnet/testnet), 3) Refresh the page and try reconnecting, 4) Clear browser cache if issues persist."
  },
  {
    category: "troubleshooting",
    question: "Transaction failed - what went wrong?",
    answer: "Provide the transaction hash and ask 'Why did my transaction fail?'. The AI will analyze the transaction, check for revert reasons, insufficient gas, or balance issues and explain what happened."
  },
  {
    category: "troubleshooting",
    question: "I have insufficient VTHO for transactions",
    answer: "VTHO is generated automatically by holding VET. If you need VTHO immediately: 1) Wait for natural generation, 2) Swap for VTHO on a DEX, or 3) Ask 'How can I get more VTHO?' for current options."
  },
  {
    category: "troubleshooting",
    question: "Bridge transaction is stuck",
    answer: "Bridge transactions can take time. Check status with 'Check my bridge transaction [hash]'. If stuck >1 hour, the AI can help you contact bridge support or check for refund options."
  },
  {
    category: "troubleshooting",
    question: "AI doesn't understand my request",
    answer: "Try rephrasing more simply: instead of complex technical terms, use plain language like 'send tokens', 'check balance', or 'stake VET'. The AI is trained on natural language patterns."
  },

  // Advanced Features
  {
    category: "advanced",
    question: "What's the difference between mainnet and testnet?",
    answer: "Mainnet uses real VET/VTHO with value. Testnet uses test tokens for development. VeChain AI Terminal works on both - it automatically detects your network and adjusts accordingly."
  },
  {
    category: "advanced",
    question: "Can I batch multiple transactions?",
    answer: "Currently, transactions are processed individually for safety. However, you can queue multiple requests: 'Send VET to Alice, then check my balance, then stake 1M VET' and the AI will handle them sequentially."
  },
  {
    category: "advanced",
    question: "How does the AI ensure transaction safety?",
    answer: "The AI implements multiple safety checks: balance verification, gas fee reserves, address validation, amount limits, and always requires your explicit approval before executing any transaction."
  },
  {
    category: "advanced",
    question: "What data does VeChain AI Terminal access?",
    answer: "Only public blockchain data (balances, transactions, contracts) and what you explicitly share. Your private keys never leave your wallet. The AI cannot access private information or execute transactions without your approval."
  }
];

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: HelpCircle,
    description: "Basic questions about VeChain AI Terminal"
  },
  {
    id: "wallet",
    name: "Wallet & Transactions",
    icon: Wallet,
    description: "Managing balances, sending tokens, and transactions"
  },
  {
    id: "bridge",
    name: "Cross-Chain Bridge",
    icon: ArrowRightLeft,
    description: "Bridging assets to other blockchains"
  },
  {
    id: "staking",
    name: "StarGate Staking",
    icon: Shield,
    description: "VET staking and NFT rewards"
  },
  {
    id: "contracts",
    name: "Smart Contracts",
    icon: Code,
    description: "Contract verification and interactions"
  },
  {
    id: "nfts",
    name: "NFTs",
    icon: Activity,
    description: "VIP-181 NFT management"
  },
  {
    id: "analytics",
    name: "Analytics & Data",
    icon: Activity,
    description: "Network stats and analytics"
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    icon: AlertCircle,
    description: "Common issues and solutions"
  },
  {
    id: "advanced",
    name: "Advanced Features",
    icon: Zap,
    description: "Technical details and advanced usage"
  }
];

function FAQCategory({ category, items }: { category: typeof categories[0], items: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <category.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);
            return (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto text-left bg-muted/50 hover:bg-muted/70 rounded-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </Button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 bg-background"
                  >
                    <div className="pt-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

  const filteredFAQs = faqData.filter(faq => faq.category === selectedCategory);
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <HelpCircle className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">FAQ</span>
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
          Find answers to common questions about VeChain AI Terminal. From basic wallet operations to advanced cross-chain bridging, 
          we've got you covered.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{faqData.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">90+</div>
            <div className="text-sm text-muted-foreground">AI Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
        </div>
      </motion.div>

      <div className="w-full">
        <div className="bg-muted/50 rounded-lg p-2 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-md h-auto flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FAQCategory 
            category={categories.find(cat => cat.id === selectedCategory)!} 
            items={faqData.filter(faq => faq.category === selectedCategory)} 
          />
        </motion.div>
      </div>

      {/* Help CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Try asking VeChain AI Terminal directly - 
            it's designed to understand and answer questions in natural language.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <HelpCircle className="w-4 h-4 mr-2" />
              Try VeChain AI Terminal
            </Button>
            <Button variant="outline">
              <Info className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}