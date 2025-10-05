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
    title: "Foundation & Core Features",
    status: "completed",
    timeframe: "Q4 2024",
    description: "Establish the fundamental platform and core AI capabilities",
    milestones: [
      {
        title: "AI Chat Interface",
        description: "Natural language blockchain queries and responses",
        status: "completed",
        icon: Brain
      },
      {
        title: "Wallet Integration", 
        description: "Connect VeChain wallets and access account data",
        status: "completed",
        icon: Shield
      },
      {
        title: "Basic Analytics",
        description: "Transaction history and balance tracking",
        status: "completed", 
        icon: Zap
      },
      {
        title: "Smart Contract Tools",
        description: "Contract verification and basic interaction",
        status: "in-progress",
        icon: Code
      }
    ]
  },
  {
    phase: "Phase 2", 
    title: "Advanced Analytics & Tools",
    status: "in-progress",
    timeframe: "Q1 2025",
    description: "Enhanced analytics capabilities and developer tools",
    milestones: [
      {
        title: "Advanced Contract Analysis",
        description: "Deep code analysis and security auditing", 
        status: "in-progress",
        icon: Shield
      },
      {
        title: "Portfolio Management",
        description: "Comprehensive asset tracking and insights",
        status: "planned",
        icon: Target
      },
      {
        title: "API Access",
        description: "RESTful API for third-party integrations",
        status: "planned",
        icon: Code
      },
      {
        title: "Real-time Monitoring",
        description: "Live network and transaction monitoring",
        status: "planned",
        icon: Zap
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Enterprise & Integrations", 
    status: "planned",
    timeframe: "Q2 2025",
    description: "Enterprise features and ecosystem integrations",
    milestones: [
      {
        title: "MCP Server",
        description: "Model Context Protocol server for AI integrations",
        status: "planned",
        icon: Brain
      },
      {
        title: "Multi-user Support",
        description: "Team collaboration and role management",
        status: "planned", 
        icon: Users
      },
      {
        title: "Custom Dashboards",
        description: "Personalized analytics and reporting",
        status: "planned",
        icon: Target
      },
      {
        title: "Third-party Integrations",
        description: "Connect with popular DeFi and NFT platforms",
        status: "planned",
        icon: Globe
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Ecosystem Expansion",
    status: "planned", 
    timeframe: "Q3-Q4 2025",
    description: "Platform expansion and community features",
    milestones: [
      {
        title: "Mobile Application",
        description: "Native iOS and Android applications",
        status: "planned",
        icon: Rocket
      },
      {
        title: "Developer SDK",
        description: "Software development kit for building on VeChain Terminal",
        status: "planned",
        icon: Code
      },
      {
        title: "Community Features",
        description: "Shared insights and collaborative analytics",
        status: "planned",
        icon: Users
      },
      {
        title: "Advanced AI Models",
        description: "Specialized models for VeChain ecosystem analysis",
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
              Building the Future
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Our roadmap outlines the journey to make VeChain Terminal the most powerful 
              and intuitive blockchain development platform. Here's what we're building.
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Development Roadmap</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our phased approach to building the most comprehensive VeChain development platform
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Shape the Future</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              VeChain Terminal is built for the community. Your feedback and suggestions 
              help us prioritize features and build what developers actually need.
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