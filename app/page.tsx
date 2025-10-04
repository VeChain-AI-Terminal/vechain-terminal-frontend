"use client";

import { ArrowRight, Brain, Shield, Zap, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import BeamsBackground from "@/components/ui/beams-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 -mb-4 px-4 pb-4">
        <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
        <div className="max-w-7xl relative mx-auto">
          <Navbar>
            <NavbarLeft>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <Image
                  src="/images/vechain.png"
                  alt="VeChain"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                VeChain AI Terminal
              </Link>
              <Navigation />
            </NavbarLeft>
            <NavbarRight>
              <Link
                href="/docs"
                className="hidden text-sm md:block hover:text-primary transition-colors"
              >
                Documentation
              </Link>
              <Button asChild variant="outline">
                <Link href="/chat">
                  Launch Terminal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                      <span>VeChain AI Terminal</span>
                    </Link>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                    <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                      Documentation
                    </Link>
                    <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                      Roadmap
                    </Link>
                    <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                      Portfolio
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </NavbarRight>
          </Navbar>
        </div>
      </header>

      {/* Hero Section with BeamsBackground */}
      <BeamsBackground intensity="medium">
        <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center min-h-screen justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 animate-pulse">
              <span className="text-muted-foreground">
                Powered by AI and VeChain blockchain
              </span>
              <ArrowRight className="ml-2 h-3 w-3" />
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              VeChain <span className="text-primary">AI</span> Terminal
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent AI co-pilot for the VeChain blockchain. 
              Analyze transactions, interact with smart contracts, and explore 
              the ecosystem with powerful AI assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  Launch Terminal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/docs">
                  <Github className="mr-2 h-5 w-5" />
                  Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </BeamsBackground>

      {/* Features Section */}
      <section className="py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Developers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build, analyze, and interact with the VeChain ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Get intelligent insights into blockchain data with natural language queries and AI-driven analysis
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Contract Tools</h3>
              <p className="text-muted-foreground">
                Verify, analyze, and interact with smart contracts using advanced tools and real-time data
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-time Insights</h3>
              <p className="text-muted-foreground">
                Monitor network activity, track transactions, and get live updates on blockchain metrics
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-primary/10 to-primary/5">
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
              Connect your wallet and start your journey with the most advanced VeChain terminal
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/vechain.png"
                  alt="VeChain"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">VeChain AI Terminal</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                The most advanced AI-powered terminal for VeChain blockchain development and analysis.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/VeChain-AI-Terminal" className="hover:text-foreground transition-colors flex items-center">
                    GitHub
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Discord</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 VeChain AI Terminal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}