"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  Code, 
  Layers,
  GitBranch,
  Server,
  Smartphone,
  Cloud,
  Lock,
  ArrowRight,
  Check,
  Cpu,
  Network,
  Workflow
} from "lucide-react";

const architecturePhases = [
  {
    layer: "Presentation Layer",
    description: "Next.js 15 App Router with React 19 RC providing modern SSR/SSG capabilities",
    icon: Globe,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    components: [
      "Next.js App Router",
      "React Server Components", 
      "Static Generation",
      "Incremental Static Regeneration",
      "Edge Runtime Support"
    ]
  },
  {
    layer: "UI/UX Layer", 
    description: "Component-driven architecture with Tailwind CSS and Framer Motion animations",
    icon: Layers,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    components: [
      "Radix UI Primitives",
      "Tailwind CSS Utilities",
      "Framer Motion Animations", 
      "Dark/Light Theme System",
      "Responsive Design Patterns"
    ]
  },
  {
    layer: "AI Integration Layer",
    description: "Vercel AI SDK with streaming responses and 90+ blockchain operation tools",
    icon: Brain,
    color: "bg-green-500/10 text-green-500 border-green-500/20", 
    components: [
      "Vercel AI SDK 5.0",
      "OpenAI GPT Integration",
      "Tool Registry System",
      "Streaming AI Responses",
      "Context-Aware Processing"
    ]
  },
  {
    layer: "Blockchain Layer",
    description: "VeChain SDK integration with wallet connectivity and transaction management",
    icon: Shield,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    components: [
      "VeChain Kit 2.0",
      "DApp Kit React",
      "Thor Network Client",
      "Transaction Engine",
      "Fee Delegation Support"
    ]
  },
  {
    layer: "Data & Storage Layer",
    description: "Multi-database architecture with ORM, caching, and external API integrations",
    icon: Database,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    components: [
      "Drizzle ORM",
      "PostgreSQL/SQLite",
      "Redis Caching",
      "Vercel Blob Storage",
      "External API Gateway"
    ]
  }
];

const toolCategories = [
  {
    category: "Account Operations",
    count: 12,
    description: "Comprehensive wallet and account management tools",
    tools: ["Balance Queries", "Transaction History", "Token Transfers", "NFT Management"]
  },
  {
    category: "Token Operations", 
    count: 8,
    description: "VIP-180 token analysis and interaction tools",
    tools: ["Price Tracking", "Supply Analytics", "Holder Analysis", "Transfer Operations"]
  },
  {
    category: "Smart Contracts",
    count: 5, 
    description: "Contract verification and interaction capabilities",
    tools: ["Code Verification", "Metadata Analysis", "Statistics Tracking", "ABI Resolution"]
  },
  {
    category: "Cross-Chain Bridge",
    count: 10,
    description: "Multi-chain bridge operations and monitoring",
    tools: ["WanBridge Integration", "XFlows Protocol", "Status Tracking", "Fee Optimization"]
  },
  {
    category: "StarGate Staking",
    count: 6,
    description: "VET staking with NFT rewards system",
    tools: ["Stake Management", "Reward Claiming", "Maturity Tracking", "Tier Selection"]
  },
  {
    category: "Network Analytics",
    count: 15,
    description: "Real-time blockchain data and statistics",
    tools: ["Block Information", "Gas Analytics", "Authority Nodes", "Carbon Emissions"]
  }
];

const techStack = [
  {
    category: "Frontend Framework",
    technologies: [
      { name: "Next.js", version: "15.3.0", description: "React framework with App Router" },
      { name: "React", version: "19.0.0-rc", description: "UI library with concurrent features" },
      { name: "TypeScript", version: "5.6.3", description: "Type-safe development" }
    ]
  },
  {
    category: "AI & ML",
    technologies: [
      { name: "Vercel AI SDK", version: "5.0.0", description: "AI integration with streaming" },
      { name: "OpenAI", version: "2.0.4", description: "GPT models for blockchain context" },
      { name: "Tool Registry", version: "Custom", description: "90+ blockchain operation tools" }
    ]
  },
  {
    category: "Blockchain",
    technologies: [
      { name: "VeChain Kit", version: "2.0.0-rc.16", description: "Official wallet integration" },
      { name: "DApp Kit React", version: "2.0.4", description: "React blockchain hooks" },
      { name: "VeChain SDK", version: "2.0.5", description: "Core blockchain operations" }
    ]
  },
  {
    category: "Database & Storage",
    technologies: [
      { name: "Drizzle ORM", version: "0.34.0", description: "Type-safe database operations" },
      { name: "PostgreSQL", version: "Latest", description: "Production database" },
      { name: "Redis", version: "5.0.0", description: "Caching and sessions" }
    ]
  }
];

export default function ArchitecturePage() {
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
          <Code className="mr-2 h-3 w-3" />
          <span className="text-muted-foreground">System Architecture</span>
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Post-Website Era Architecture
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
          VeChain AI Terminal employs a sophisticated multi-layer architecture designed for the post-website era. 
          Our system combines modern web technologies, AI processing, and blockchain integration to deliver 
          conversational blockchain operations at enterprise scale.
        </p>
      </motion.div>

      {/* System Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Workflow className="h-8 w-8 text-primary" />
          System Overview
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Conversational Interface</h3>
                <p className="text-muted-foreground">
                  Natural language processing transforms user intent into blockchain operations through 
                  our AI-powered tool registry with 90+ specialized functions.
                </p>
              </div>
              
              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Real-time Processing</h3>
                <p className="text-muted-foreground">
                  Streaming AI responses with progressive data loading ensure immediate feedback 
                  while complex blockchain operations execute in the background.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Client-side wallet integration, secure transaction signing, and comprehensive 
                  input validation protect user assets and data integrity.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur-3xl"></div>
            <Card className="relative p-8 bg-card/80 backdrop-blur border-primary/20">
              <div className="text-center space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">Web Frontend</div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">AI Processing</div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">VeChain SDK</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl">
                  <Zap className="h-10 w-10 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Conversational Blockchain Operations</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Architecture Layers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          Architecture Layers
        </h2>
        
        <div className="space-y-6">
          {architecturePhases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.layer}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 border rounded-xl ${phase.color} bg-card/50 backdrop-blur`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{phase.layer}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Layer {index + 1}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {phase.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {phase.components.map((component, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Tool Registry */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="h-8 w-8 text-primary" />
          AI Tool Registry
        </h2>
        
        <div className="mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our AI system leverages 90+ specialized tools organized into functional categories. 
            Each tool is designed for specific blockchain operations with intelligent error handling and validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{category.category}</h3>
                <Badge variant="outline" className="text-xs">
                  {category.count} tools
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>
              
              <div className="space-y-2">
                {category.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Server className="h-8 w-8 text-primary" />
          Technology Stack
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">{stack.category}</h3>
              
              <div className="space-y-3">
                {stack.technologies.map((tech, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-card/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{tech.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        v{tech.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security & Performance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="h-8 w-8 text-primary" />
          Security & Performance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Security Measures
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Client-Side Wallet Integration</div>
                  <div className="text-sm text-muted-foreground">No private keys stored on servers</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Input Validation & Sanitization</div>
                  <div className="text-sm text-muted-foreground">Comprehensive data validation pipeline</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Content Security Policy</div>
                  <div className="text-sm text-muted-foreground">XSS and injection attack prevention</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Network Isolation</div>
                  <div className="text-sm text-muted-foreground">Testnet/mainnet separation</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Performance Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Edge Runtime Support</div>
                  <div className="text-sm text-muted-foreground">Global distribution and low latency</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Streaming AI Responses</div>
                  <div className="text-sm text-muted-foreground">Real-time data processing and display</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Redis Caching Layer</div>
                  <div className="text-sm text-muted-foreground">Optimized data retrieval and sessions</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Progressive Enhancement</div>
                  <div className="text-sm text-muted-foreground">Graceful degradation and error handling</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Data Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          Data Flow Architecture
        </h2>
        
        <Card className="p-8 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">User Input</h3>
              <p className="text-sm text-muted-foreground">
                Natural language commands processed through multimodal input interface
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">AI Processing</h3>
              <p className="text-sm text-muted-foreground">
                OpenAI GPT models analyze intent and select appropriate blockchain tools
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-orange-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Blockchain Execution</h3>
              <p className="text-sm text-muted-foreground">
                VeChain SDK executes operations with secure wallet integration
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Response</h3>
              <p className="text-sm text-muted-foreground">
                Streaming results with progressive data loading and visual feedback
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {step}
                  </div>
                  {index < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}