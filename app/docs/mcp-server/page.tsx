"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Terminal, 
  Brain, 
  Code, 
  Shield, 
  Zap, 
  Globe, 
  Download,
  Settings,
  Check,
  ArrowRight,
  ExternalLink,
  Copy,
  Cpu,
  Database,
  Network,
  Lock,
  BookOpen,
  PlayCircle,
  GitBranch,
  Smartphone,
  Cloud
} from "lucide-react";
import Link from "next/link";

const supportedAIs = [
  {
    name: "Claude Desktop",
    description: "Native integration with Anthropic's Claude Desktop application",
    icon: Brain,
    configPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    setupCommand: "pnpm setup:claude"
  },
  {
    name: "Cursor Editor", 
    description: "AI-powered code editor with VeChain blockchain capabilities",
    icon: Code,
    configPath: "~/.cursor/mcp.json",
    setupCommand: "pnpm setup:cursor"
  },
  {
    name: "VS Code",
    description: "Microsoft Visual Studio Code with MCP integration",
    icon: Terminal,
    configPath: "~/Library/Application Support/Code/User/mcp.json", 
    setupCommand: "pnpm setup:code"
  }
];

const pluginCategories = [
  {
    name: "Token Operations",
    description: "VET, VTHO, and VIP-180 token management",
    icon: Zap,
    tools: 8,
    examples: ["Transfer 100 VET to address", "Check my VTHO balance", "Send B3TR tokens"]
  },
  {
    name: "DEX Trading",
    description: "Multi-DEX trading across VeChain ecosystem",
    icon: Globe,
    tools: 12,
    examples: ["Swap VET for VTHO on VeSwap", "Get best exchange rate", "Check liquidity pools"]
  },
  {
    name: "Cross-Chain Bridges",
    description: "WanBridge and XFlows protocol integration",
    icon: Network,
    tools: 10,
    examples: ["Bridge VET to Ethereum", "Check bridge status", "Get bridge fees"]
  },
  {
    name: "StarGate Staking",
    description: "NFT-based VET staking with 13 fully tested tools",
    icon: Shield,
    tools: 13,
    examples: ["Stake for Dawn NFT", "Claim VTHO rewards", "Check maturity status"]
  },
  {
    name: "NFT Management",
    description: "VIP-181 NFT operations and analytics",
    icon: Database,
    tools: 7,
    examples: ["Mint NFT with metadata", "Transfer NFT ownership", "Get collection stats"]
  },
  {
    name: "VeBetter DAO",
    description: "Sustainability rewards and governance",
    icon: Cloud,
    tools: 6,
    examples: ["Submit sustainable action", "Claim B3TR rewards", "Track impact"]
  }
];


export default function McpServerPage() {
  const configExample = `{
  "mcpServers": {
    "vechain-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/vechain-mcp-server/dist/index.js"],
      "env": {
        "WALLET_MNEMONIC": "your twelve word mnemonic phrase here",
        "VECHAIN_NETWORK": "testnet",
        "VECHAINSTATS_API_KEY": "your_vechainstats_api_key",
        "VEBETTER_REWARDS_POOL_ADDRESS": "0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38",
        "VEBETTER_B3TR_TOKEN_ADDRESS": "0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F",
        "VEBETTER_APPS_REGISTRY_ADDRESS": "0xcB23Eb1bBD5c07553795b9538b1061D0f4ABA153",
        "VEBETTER_APP_ID": "your_app_id_here",
        "BRIDGE_API_URL": "https://bridge-api.wanchain.org/api",
        "BRIDGE_PARTNER": "vechain-ai-superapp"
      }
    }
  }
}`;

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
          <Terminal className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">Model Context Protocol</span>
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          VeChain MCP Server
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mb-8">
          The Model Context Protocol server that brings VeChain blockchain operations to Claude Desktop, Cursor, and VS Code. 
          Stop visiting websites - start talking to VeChain through your favorite AI assistant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="https://github.com/VeChain-AI-Terminal/vechain-mcp-server" target="_blank">
              <Download className="mr-2 h-5 w-5" />
              Get MCP Server
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <BookOpen className="mr-2 h-5 w-5" />
            Quick Start Guide
          </Button>
        </div>
      </motion.div>

      {/* What is MCP Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          The Post-Website Era for Blockchain
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              VeChain MCP Server enables AI assistants to interact directly with VeChain blockchain through natural language. 
              Instead of navigating complex DApps, users simply tell their AI what they want to do.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>90+ blockchain operation tools</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Claude Desktop, Cursor, VS Code support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Natural language blockchain operations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Complete StarGate staking integration</span>
              </div>
            </div>
          </div>

          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <h3 className="text-xl font-semibold mb-4">Example Conversation</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <span className="font-medium text-blue-400">You:</span> "Stake 10,000 VET for a Dawn tier StarGate NFT"
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <span className="font-medium text-green-400">Claude:</span> "I'll help you stake 10,000 VET for a Dawn tier StarGate NFT. This requires a 7-day maturity period and provides 1.2x VTHO rewards..."
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <span className="font-medium text-purple-400">Result:</span> "✅ Transaction successful! Your Dawn StarGate NFT #123456 has been minted."
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Supported AI Applications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="h-8 w-8 text-primary" />
          Supported AI Applications
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportedAIs.map((ai, index) => {
            const Icon = ai.icon;
            return (
              <motion.div
                key={ai.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{ai.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{ai.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <strong>Config Path:</strong>
                    <code className="block bg-muted/50 p-1 rounded mt-1 text-xs break-all">
                      {ai.configPath}
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Setup Command:</strong>
                    <code className="block bg-muted/50 p-1 rounded mt-1 text-xs">
                      {ai.setupCommand}
                    </code>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Plugin Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-primary" />
          Blockchain Operation Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pluginCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.tools} tools
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Examples</h4>
                  {category.examples.map((example, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      "{example}"
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Installation Guide */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Quick Installation
        </h2>
        
        <div className="space-y-8">
          {/* Automated Setup */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-green-500" />
              Automated Setup (Recommended)
            </h3>
            <div className="space-y-4">
              <div className="bg-muted/30 border rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-foreground">
{`git clone https://github.com/VeChain-AI-Terminal/vechain-mcp-server
cd vechain-mcp-server
pnpm install && pnpm build
cp .env.example .env`}
                    <span className="text-primary font-semibold">
{`
pnpm setup`}
                    </span>
                  </code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                The setup script will automatically configure your preferred AI application with the correct paths and environment variables.
              </p>
            </div>
          </Card>

          {/* Application-Specific Setup */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-500" />
              Application-Specific Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-blue-600">Claude Desktop</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:claude</code>
              </div>
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-purple-600">Cursor Editor</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:cursor</code>
              </div>
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-orange-600">VS Code</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:code</code>
              </div>
            </div>
          </Card>

          {/* Configuration Example */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                Configuration Example
              </h3>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Configuration
              </Button>
            </div>
            <div className="bg-muted/30 border rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                <code className="text-foreground whitespace-pre-wrap">
{`{
  "mcpServers": {
    "vechain-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/vechain-mcp-server/dist/index.js"],
      "env": {
        "WALLET_MNEMONIC": "your twelve word mnemonic phrase here",
        "VECHAIN_NETWORK": "testnet",
        "VECHAINSTATS_API_KEY": "your_vechainstats_api_key",
        "VEBETTER_REWARDS_POOL_ADDRESS": "0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38",
        "VEBETTER_B3TR_TOKEN_ADDRESS": "0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F",
        "VEBETTER_APPS_REGISTRY_ADDRESS": "0xcB23Eb1bBD5c07553795b9538b1061D0f4ABA153",
        "VEBETTER_APP_ID": "your_app_id_here",
        "BRIDGE_API_URL": "https://bridge-api.wanchain.org/api",
        "BRIDGE_PARTNER": "vechain-ai-superapp"
      }
    }
  }
}`}
                </code>
              </pre>
            </div>
          </Card>
        </div>
      </motion.section>


      {/* Security & Requirements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="h-8 w-8 text-primary" />
          Security & Requirements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Security Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Local Environment Variables</div>
                  <div className="text-sm text-muted-foreground">Private keys never leave your machine</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Testnet Support</div>
                  <div className="text-sm text-muted-foreground">Safe testing environment included</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Parameter Validation</div>
                  <div className="text-sm text-muted-foreground">Comprehensive input validation and error handling</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Node.js 18+</div>
                  <div className="text-sm text-muted-foreground">Modern JavaScript runtime required</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">pnpm Package Manager</div>
                  <div className="text-sm text-muted-foreground">Fast, efficient dependency management</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">VeChain Wallet</div>
                  <div className="text-sm text-muted-foreground">Private key or mnemonic phrase required</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Stop Visiting Websites?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Install VeChain MCP Server and experience blockchain operations through natural conversation. 
            The post-website era starts with your next command.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="https://github.com/VeChain-AI-Terminal/vechain-mcp-server" target="_blank">
                <Download className="mr-2 h-5 w-5" />
                Download MCP Server
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/docs/getting-started">
                <PlayCircle className="mr-2 h-5 w-5" />
                Getting Started Guide
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}