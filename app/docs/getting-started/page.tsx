"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  Wallet, 
  MessageSquare, 
  Search,
  Code,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Connect your VeChain wallet to access all features",
    icon: Wallet,
    details: [
      "VeChainThor Wallet (Recommended)",
      "Sync2 Wallet", 
      "VeWorld Mobile Wallet",
      "Hardware wallets (Ledger)"
    ]
  },
  {
    number: "02", 
    title: "Explore the Interface",
    description: "Familiarize yourself with the AI-powered chat interface",
    icon: MessageSquare,
    details: [
      "Natural language queries",
      "Real-time blockchain data",
      "Smart contract interactions",
      "Transaction analysis"
    ]
  },
  {
    number: "03",
    title: "Start Querying",
    description: "Begin exploring VeChain data with simple questions",
    icon: Search,
    details: [
      "Ask about account balances",
      "Analyze transaction history", 
      "Explore smart contracts",
      "Monitor network activity"
    ]
  }
];

const features = [
  {
    title: "Blockchain Analytics",
    description: "Get real-time insights into VeChain transactions, blocks, and network statistics"
  },
  {
    title: "Smart Contract Tools", 
    description: "Verify contracts, analyze code, and interact with deployed contracts"
  },
  {
    title: "AI-Powered Queries",
    description: "Ask questions in natural language and get intelligent blockchain insights"
  },
  {
    title: "Token Management",
    description: "Track VET and VTHO balances, transfers, and token interactions"
  }
];

export default function GettingStartedPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Getting Started</span>
        </Badge>
        
        <h1 className="text-4xl font-bold mb-4">Welcome to VeChain Terminal</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          VeChain Terminal is your AI-powered co-pilot for the VeChain blockchain. 
          This guide will help you get started in just a few minutes.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>
        
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                    {step.number}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Ready to start?
          </h4>
          <p className="text-muted-foreground mb-4">
            Launch VeChain Terminal and connect your wallet to begin exploring the VeChain ecosystem.
          </p>
          <Button asChild>
            <Link href="/chat">
              Launch VeChain Terminal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Example Queries */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Example Queries</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Here are some example questions you can ask VeChain Terminal:
        </p>
        
        <div className="space-y-4">
          {[
            "What's my VET balance?",
            "Show me the latest transactions on VeChain",
            "Analyze the smart contract at address 0x...",
            "What's the current VTHO generation rate?",
            "Find all transactions from my wallet in the last 7 days"
          ].map((query, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 border rounded-lg bg-card/30 backdrop-blur-sm font-mono text-sm"
            >
              <Code className="h-4 w-4 text-primary inline mr-2" />
              {query}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Now that you know the basics, explore these advanced topics:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/docs/examples" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Code className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Code Examples</div>
              <div className="text-sm text-muted-foreground">See real examples and tutorials</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
          
          <Link href="/docs/api-reference" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <ExternalLink className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">API Reference</div>
              <div className="text-sm text-muted-foreground">Complete API documentation</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}