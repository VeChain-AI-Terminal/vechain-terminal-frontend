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
    title: "🖥️ Desktop Application",
    description: "Breaking free from browsers with native desktop apps for enhanced performance",
    icon: Code,
    category: "Post-Website Era",
    eta: "Q1 2025",
    highlights: [
      "Native Windows, Mac, Linux applications",
      "Enhanced performance vs web version",
      "Offline transaction building and signing",
      "Direct hardware wallet integration"
    ]
  },
  {
    title: "🤖 Local AI Operation",
    description: "Your AI, your control - run VeChain AI Terminal completely locally",
    icon: Brain,
    category: "Privacy & Control",
    eta: "Q1 2025", 
    highlights: [
      "Local AI operation using Ollama",
      "No OpenAI API keys required",
      "Complete privacy and data control",
      "Offline AI processing capabilities"
    ]
  },
  {
    title: "🔌 Plugin Marketplace",
    description: "The ChatGPT moment for blockchain - any VeChain project can integrate",
    icon: Globe,
    category: "Ecosystem",
    eta: "Q2 2025",
    highlights: [
      "Plugin marketplace and discovery",
      "Easy integration SDK for projects", 
      "Revenue sharing for plugin creators",
      "One interface, infinite protocols"
    ]
  },
  {
    title: "💰 User Rewards System",
    description: "Get rewarded for using VeChain - make blockchain interaction profitable",
    icon: Target,
    category: "Rewards",
    eta: "Q2 2025",
    highlights: [
      "Earn tokens for platform engagement",
      "Cross-protocol reward aggregation",
      "Community governance participation",
      "Incentivized ecosystem growth"
    ]
  },
  {
    title: "🏢 Enterprise Solutions",
    description: "White-label AI interfaces for any VeChain project to offer their users",
    icon: Users,
    category: "B2B",
    eta: "Q3 2025",
    highlights: [
      "White-label conversational interfaces",
      "Custom plugin development",
      "Enterprise API access",
      "Infrastructure for the post-website era"
    ]
  },
  {
    title: "🌐 Multi-Chain Expansion", 
    description: "While VeChain remains home, expand to support the entire blockchain ecosystem",
    icon: Rocket,
    category: "Platform",
    eta: "Q3 2025",
    highlights: [
      "Ethereum and Polygon support",
      "Universal blockchain interface",
      "Cross-chain operation management",
      "One AI for all blockchains"
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
              The Next Revolution
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We've shipped 64+ working tools. Now comes the infrastructure for the post-website era: 
              Desktop apps, local AI, plugin marketplaces, and user rewards. The future is almost here.
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Building the Post-Website Era</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond working tools - we're building the infrastructure where blockchain becomes as easy as conversation
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why We're Different</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              While others promise, we ship. 64+ tools already live. The post-website era is here.
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
              <h3 className="font-semibold text-lg mb-2">Already Shipping</h3>
              <p className="text-muted-foreground text-sm">
                64+ blockchain operations working today - not promises for tomorrow
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
              <h3 className="font-semibold text-lg mb-2">Plugin Ecosystem</h3>
              <p className="text-muted-foreground text-sm">
                Any VeChain project can integrate - building the ChatGPT moment for blockchain
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
              <h3 className="font-semibold text-lg mb-2">Local Operation</h3>
              <p className="text-muted-foreground text-sm">
                Desktop apps with local AI - no OpenAI required, complete privacy control
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
              Ready to Stop Visiting Websites?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the post-website era today. 64+ operations through conversation. 
              Bridge to 25+ chains. Desktop apps coming Q1 2025.
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