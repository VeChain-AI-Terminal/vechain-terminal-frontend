"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  ArrowRight,
  Brain,
  Shield,
  Zap,
  Code,
  Globe,
  Users,
  Target,
  Rocket
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Foundation ✅ COMPLETED",
    status: "completed",
    timeframe: "SHIPPED",
    description: "64+ AI tools for VeChain operations - we've built what everyone else is promising",
    milestones: [
      {
        title: "64+ Live Operations",
        description: "VET transfers, StarGate staking, cross-chain bridges, NFT management",
        status: "completed",
        icon: Brain
      },
      {
        title: "25+ Bridge Destinations", 
        description: "Connect VeChain to entire crypto ecosystem via WanBridge & XFlows",
        status: "completed",
        icon: Globe
      },
      {
        title: "Real-time AI Streaming",
        description: "Live blockchain data with progressive AI responses",
        status: "completed", 
        icon: Zap
      },
      {
        title: "Web Interface",
        description: "Full-featured web app with wallet connectivity",
        status: "completed",
        icon: Code
      }
    ]
  },
  {
    phase: "Phase 2", 
    title: "Plugin Ecosystem 🚧 IN PROGRESS",
    status: "in-progress",
    timeframe: "Q1 2025",
    description: "Building the ChatGPT plugin moment for blockchain - any VeChain project can integrate",
    milestones: [
      {
        title: "MCP Integration",
        description: "Model Context Protocol for seamless AI tool integration", 
        status: "in-progress",
        icon: Shield
      },
      {
        title: "Open Plugin Registry",
        description: "Any VeChain project can add their tools to our AI",
        status: "in-progress",
        icon: Target
      },
      {
        title: "Plugin Marketplace",
        description: "Discover and install new protocol integrations",
        status: "planned",
        icon: Code
      },
      {
        title: "VeBetter DAO Integration",
        description: "Sustainability rewards through simple conversation",
        status: "planned",
        icon: Zap
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Desktop & Local Operation 🎯 Q1 2025", 
    status: "planned",
    timeframe: "Q1 2025",
    description: "Breaking free from browsers and OpenAI dependency",
    milestones: [
      {
        title: "Native Desktop App",
        description: "Windows, Mac, Linux apps with enhanced performance",
        status: "planned",
        icon: Brain
      },
      {
        title: "Local AI with Ollama",
        description: "No OpenAI API required - run everything locally",
        status: "planned", 
        icon: Users
      },
      {
        title: "Enhanced Security",
        description: "Advanced security features for desktop operations",
        status: "planned",
        icon: Target
      },
      {
        title: "Performance Optimization",
        description: "Native performance benefits over web version",
        status: "planned",
        icon: Globe
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Reward Economy 🔮 Q2 2025",
    status: "planned", 
    timeframe: "Q2 2025",
    description: "Making blockchain interaction profitable, not just functional",
    milestones: [
      {
        title: "User Rewards System",
        description: "Earn tokens for platform engagement and usage",
        status: "planned",
        icon: Rocket
      },
      {
        title: "Developer Incentives",
        description: "Revenue sharing for plugin creators and contributors",
        status: "planned",
        icon: Code
      },
      {
        title: "Ecosystem Acceleration",
        description: "Making VeChain accessible through reward incentives",
        status: "planned",
        icon: Users
      },
      {
        title: "Cross-Protocol Rewards",
        description: "Earn from multiple VeChain projects through one interface",
        status: "planned",
        icon: Brain
      }
    ]
  }
];

const statusColors = {
  completed: "bg-green-500",
  "in-progress": "bg-blue-500", 
  planned: "bg-gray-400"
};

const statusIcons = {
  completed: CheckCircle,
  "in-progress": Clock,
  planned: Calendar
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6">
              <span className="text-muted-foreground">Product Roadmap</span>
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Building the VeChain Operating System
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We've already shipped 64+ working tools. Now we're building the plugin ecosystem, 
              desktop apps, and reward systems that will make VeChain accessible to everyone.
            </p>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Try Current Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">From Working Tools to Operating System</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Phase 1 is complete - we've shipped what others promise. Now we're building the infrastructure for the post-website era.
            </p>
          </motion.div>

          <div className="space-y-16">
            {roadmapPhases.map((phase, phaseIndex) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: phaseIndex * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Phase Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    phase.status === 'completed' ? 'bg-green-500' : 
                    phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {phase.phase.split(' ')[1]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold">{phase.title}</h3>
                      <Badge variant={phase.status === 'completed' ? 'default' : 'secondary'}>
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="text-sm font-medium">{phase.timeframe}</span>
                      <span className="text-sm">•</span>
                      <span className="text-sm">{phase.description}</span>
                    </div>
                  </div>
                </div>

                {/* Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-22">
                  {phase.milestones.map((milestone, milestoneIndex) => {
                    const Icon = milestone.icon;
                    const StatusIcon = statusIcons[milestone.status as keyof typeof statusIcons];
                    
                    return (
                      <motion.div
                        key={milestone.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 + milestoneIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{milestone.title}</h4>
                              <StatusIcon className={`h-4 w-4 ${
                                milestone.status === 'completed' ? 'text-green-500' :
                                milestone.status === 'in-progress' ? 'text-blue-500' : 'text-gray-400'
                              }`} />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Phase Connector */}
                {phaseIndex < roadmapPhases.length - 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary/50 to-muted"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Post-Website Era</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're not waiting for the future - we're building it. 64+ tools already live. 
              Plugin ecosystem in development. Desktop apps coming soon. The revolution is here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Try VeChain Terminal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}