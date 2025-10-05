"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { 
  Coins, 
  Gift, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Users,
  TrendingUp,
  Wallet,
  Globe,
  Code,
  Leaf,
  Shield,
  ExternalLink,
  CheckCircle,
  PlusCircle,
  DollarSign,
  Puzzle
} from "lucide-react";

export default function EarnDocsPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <Coins className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">Rewards & Incentives</span>
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Earn While You Build
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
          VeChain AI Terminal revolutionizes blockchain interaction by rewarding every action you take. 
          Earn real value while building, transacting, and contributing to the ecosystem.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-400">Every</div>
            <div className="text-sm text-muted-foreground">Write Operation</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-400">Multi</div>
            <div className="text-sm text-muted-foreground">Ecosystem</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-400">Auto</div>
            <div className="text-sm text-muted-foreground">Rewards</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary">Real</div>
            <div className="text-sm text-muted-foreground">Value</div>
          </div>
        </div>
      </motion.div>

      {/* VeBetter Integration Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-500/20">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-20 h-20">
              <Image
                src="/images/vebetter.png"
                alt="VeBetter"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">VeBetter Ecosystem Integration</h2>
              <p className="text-muted-foreground text-lg">
                Seamlessly integrated with VeBetter's sustainability rewards platform
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-400" />
                Sustainable Rewards
              </h3>
              <p className="text-muted-foreground mb-4">
                VeBetter rewards users for taking actions that contribute to sustainability and environmental good. 
                Every blockchain interaction through VeChain AI Terminal automatically qualifies for VeBetter rewards.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Carbon-negative blockchain actions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Sustainable transaction patterns
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Ecosystem contribution rewards
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                Reward Mechanisms
              </h3>
              <p className="text-muted-foreground mb-4">
                Earn B3TR tokens and other ecosystem rewards for every qualifying action. 
                The more you build and transact, the more you earn.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  B3TR token rewards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  Ecosystem-specific tokens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  NFT achievements and badges
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="https://vebetter.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit VeBetter
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/earn">
                <Sparkles className="w-4 h-4 mr-2" />
                Try Earning Now
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">How Earning Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Take Action</h3>
            <p className="text-muted-foreground">
              Perform any write operation through VeChain AI Terminal - send tokens, stake VET, bridge assets, 
              or interact with smart contracts.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Auto-Qualification</h3>
            <p className="text-muted-foreground">
              Our system automatically detects qualifying actions and submits them to relevant reward ecosystems 
              without any additional effort from you.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Earn Rewards</h3>
            <p className="text-muted-foreground">
              Receive rewards directly in your wallet. Track your earnings through the VeChain AI Terminal 
              dashboard and claim when ready.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* Qualifying Actions */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Qualifying Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              Token Operations
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                VET and VTHO transfers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                VIP-180 token transactions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Cross-chain bridge operations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                DEX swaps and liquidity provision
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              Staking & DeFi
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                StarGate VET staking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                VTHO reward claims
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Yield farming participation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Governance voting
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-red-400" />
              Smart Contracts
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Contract deployments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Contract verifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Function executions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                DApp interactions
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              NFT & Social
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                NFT minting and transfers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Marketplace interactions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Community participation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Referral activities
              </li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* Plugin Ecosystem */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Puzzle className="w-8 h-8 text-purple-400" />
              Plugin Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expand your earning potential by connecting to multiple reward ecosystems simultaneously
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-400" />
                Multi-Ecosystem Rewards
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect to any ecosystem that offers token rewards. When you perform actions, 
                you automatically earn from all connected ecosystems that support those actions.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>VeBetter (B3TR tokens)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Ecosystem-specific reward tokens</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Governance tokens</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Loyalty points and NFTs</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Cross-Chain Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Our plugin system supports rewards from ecosystems across multiple blockchains. 
                Bridge to Ethereum, Polygon, or BSC and still earn rewards.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>VeChain native rewards</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Ethereum ecosystem tokens</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Layer 2 solution rewards</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Cross-chain bridge incentives</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-background/50 rounded-lg border border-border/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              How Plugin Rewards Work
            </h4>
            <p className="text-sm text-muted-foreground">
              When you perform an action, our system checks all connected ecosystems to see which ones offer rewards 
              for that specific action. You automatically earn from all applicable ecosystems without any additional 
              setup or manual claiming. Rewards are tracked in real-time and can be claimed when you're ready.
            </p>
          </div>
        </Card>
      </motion.section>

      {/* Getting Started */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect your wallet and start earning rewards for every blockchain action you take. 
            No setup required - rewards are automatic and immediate.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">1</span>
              </div>
              <p className="text-sm text-muted-foreground">Connect VeChain wallet</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">2</span>
              </div>
              <p className="text-sm text-muted-foreground">Perform any write operation</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">3</span>
              </div>
              <p className="text-sm text-muted-foreground">Earn rewards automatically</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/earn">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Earning Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/chat">
                <ArrowRight className="w-5 h-5 mr-2" />
                Try VeChain Terminal
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}