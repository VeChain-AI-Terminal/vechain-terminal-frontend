"use client";

import { motion } from "motion/react";
import { Brain, Shield, Zap, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function AboutPage() {
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
              <span className="text-muted-foreground">About VeChain Terminal</span>
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Building the Future of Blockchain Intelligence
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              VeChain Terminal is an AI-powered platform that democratizes access to blockchain data 
              and smart contract interaction, making the VeChain ecosystem more accessible to developers 
              and businesses worldwide.
            </p>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Try VeChain Terminal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To bridge the gap between complex blockchain technology and everyday users by providing 
              intuitive AI-powered tools that make VeChain accessible, understandable, and actionable 
              for developers, businesses, and enthusiasts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Brain className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">AI-First Approach</h3>
              <p className="text-muted-foreground">
                Leveraging cutting-edge AI to interpret blockchain data and provide intelligent insights 
                that would take hours to discover manually.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Users className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Developer-Centric</h3>
              <p className="text-muted-foreground">
                Built by developers, for developers. Every feature is designed to streamline blockchain 
                development and reduce the complexity barrier.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm text-center"
            >
              <Globe className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">Open Ecosystem</h3>
              <p className="text-muted-foreground">
                Contributing to the VeChain ecosystem by making blockchain data more accessible 
                and fostering innovation through better tooling.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Security First</h3>
                  <p className="text-muted-foreground">
                    Every interaction with blockchain data is secured and verified. We never store 
                    private keys and always encourage best security practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Performance</h3>
                  <p className="text-muted-foreground">
                    Real-time data processing and lightning-fast responses. We optimize every query 
                    to ensure you get the information you need instantly.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Brain className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Intelligence</h3>
                  <p className="text-muted-foreground">
                    Advanced AI models that understand context, learn from patterns, and provide 
                    insights that go beyond simple data queries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    Built for and with the VeChain community. We listen to feedback and continuously 
                    improve based on real user needs and use cases.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Powered by Innovation</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              VeChain Terminal combines cutting-edge AI technology with deep blockchain expertise 
              to deliver unparalleled insights and functionality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 md:p-12 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Advanced AI Models</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our AI understands VeChain's unique features including dual-token economics, 
                  proof-of-authority consensus, and smart contract patterns. It can analyze 
                  complex transactions, identify patterns, and provide actionable insights.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Natural language processing for blockchain queries
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Smart contract analysis and verification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Real-time data processing and insights
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Brain className="h-24 w-24 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/60 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </motion.div>
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
              Ready to explore VeChain?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers and businesses already using VeChain Terminal 
              to build the future of blockchain applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Get Started Now
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