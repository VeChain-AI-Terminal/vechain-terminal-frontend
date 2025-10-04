"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileQuestion className="h-16 w-16 text-primary" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/60 rounded-full animate-pulse delay-1000"></div>
            </div>
          </motion.div>

          <Badge variant="outline" className="mb-6">
            <span className="text-muted-foreground">Error 404</span>
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Page Not Found
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to exploring the VeChain AI Terminal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/docs">
                <Search className="mr-2 h-5 w-5" />
                Browse Docs
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-3 text-primary">Popular Pages</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About VeChain AI Terminal
                  </Link>
                </li>
                <li>
                  <Link href="/docs/getting-started" className="text-muted-foreground hover:text-foreground transition-colors">
                    Getting Started Guide
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                    Development Roadmap
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-3 text-primary">Documentation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs/api-reference" className="text-muted-foreground hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/docs/examples" className="text-muted-foreground hover:text-foreground transition-colors">
                    Code Examples
                  </Link>
                </li>
                <li>
                  <Link href="/docs/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-3 text-primary">Get Started</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                    Launch AI Terminal
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="text-muted-foreground hover:text-foreground transition-colors">
                    Upcoming Features
                  </Link>
                </li>
                <li>
                  <Link href="/docs/integration-guides" className="text-muted-foreground hover:text-foreground transition-colors">
                    Integration Guides
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}