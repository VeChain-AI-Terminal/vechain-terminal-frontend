"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { 
  Rocket, 
  Brain, 
  Smartphone, 
  Globe, 
  Users, 
  Zap,
  Shield,
  Code,
  Target,
  Calendar,
  ArrowRight,
  Bell,
  Star
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

const upcomingFeatures = [
  {
    title: "Mobile Application",
    description: "Native iOS and Android apps for VeChain Terminal with full feature parity",
    icon: Smartphone,
    category: "Platform",
    eta: "Q3 2025",
    highlights: [
      "Native mobile UI optimized for blockchain interactions",
      "Push notifications for transaction updates",
      "Offline data caching and sync",
      "Biometric authentication"
    ]
  },
  {
    title: "Advanced AI Models",
    description: "Specialized AI models trained specifically on VeChain ecosystem data",
    icon: Brain,
    category: "AI/ML",
    eta: "Q2 2025", 
    highlights: [
      "VeChain-specific smart contract analysis",
      "Predictive analytics for token movements",
      "Automated security audit reports",
      "Natural language contract deployment"
    ]
  },
  {
    title: "Developer SDK",
    description: "Complete software development kit for building on VeChain Terminal",
    icon: Code,
    category: "Developer Tools",
    eta: "Q4 2025",
    highlights: [
      "JavaScript/TypeScript SDK",
      "React components library", 
      "Webhook integrations",
      "Custom dashboard embedding"
    ]
  },
  {
    title: "Community Features",
    description: "Collaborative analytics and shared insights within the VeChain community",
    icon: Users,
    category: "Social",
    eta: "Q3 2025",
    highlights: [
      "Shared watchlists and portfolios",
      "Community-driven research reports",
      "Social trading signals",
      "Collaborative contract auditing"
    ]
  },
  {
    title: "Multi-Chain Support",
    description: "Expand beyond VeChain to support multiple blockchain networks",
    icon: Globe,
    category: "Platform",
    eta: "Q1 2026",
    highlights: [
      "Ethereum and Polygon integration",
      "Cross-chain analytics",
      "Multi-wallet management",
      "Cross-chain bridge monitoring"
    ]
  },
  {
    title: "Enterprise Dashboard",
    description: "Advanced analytics and reporting tools for enterprise customers",
    icon: Target,
    category: "Enterprise",
    eta: "Q2 2025",
    highlights: [
      "Custom KPI tracking",
      "White-label solutions",
      "Advanced user management",
      "Compliance reporting tools"
    ]
  }
];

const categories = ["All", "Platform", "AI/ML", "Developer Tools", "Social", "Enterprise"];

export default function ComingSoonPage() {
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
              <Rocket className="mr-2 h-3 w-3" />
              <span className="text-muted-foreground">Coming Soon</span>
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              The Future is Bright
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get a sneak peek at the exciting features we're building for VeChain Terminal. 
              From mobile apps to advanced AI capabilities, here's what's coming next.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Try Current Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/roadmap">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Full Roadmap
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionary features that will transform how you interact with the VeChain ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 border rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {feature.category}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {feature.eta}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Key Highlights
                    </h4>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Exclusive Preview</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get early access to beta features and help shape the future of VeChain Terminal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Early Access</h3>
              <p className="text-muted-foreground text-sm">
                Be the first to try new features before they're publicly released
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Feedback</h3>
              <p className="text-muted-foreground text-sm">
                Your input directly influences feature development and priorities
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cutting Edge</h3>
              <p className="text-muted-foreground text-sm">
                Experience the latest advancements in blockchain technology and AI
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join the Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start using VeChain Terminal today and be part of the community shaping 
              the future of blockchain development tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}