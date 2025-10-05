"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { 
  Coins, 
  Gift, 
  Zap, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Users,
  TrendingUp,
  Wallet,
  BarChart3,
  Settings,
  DollarSign,
  PieChart,
  Activity,
  Calendar,
  CreditCard
} from "lucide-react";

export default function EarnPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header Navigation */}
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
                    <Link href="/earn" className="text-muted-foreground hover:text-foreground">
                      Earn
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

      {/* Backdrop/Background - Content Being Reviewed */}
      <div className="absolute inset-0 z-0">
        {/* Main backdrop content that looks like it's underneath */}
        <div className="absolute inset-0 pt-20">
          <div className="container mx-auto px-4 py-8 opacity-20">
            {/* Simulated dashboard/content that appears to be underneath */}
            <div className="space-y-8">
              {/* Header area */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg w-64"></div>
                  <div className="h-4 bg-white/40 rounded w-96"></div>
                </div>
                <div className="h-10 bg-white/30 rounded-lg w-32"></div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <div className="space-y-1">
                      <div className="h-3 bg-white/60 rounded w-20"></div>
                      <div className="h-5 bg-green-400/80 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-8 h-8 text-blue-400" />
                    <div className="space-y-1">
                      <div className="h-3 bg-white/60 rounded w-24"></div>
                      <div className="h-5 bg-blue-400/80 rounded w-12"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                    <div className="space-y-1">
                      <div className="h-3 bg-white/60 rounded w-16"></div>
                      <div className="h-5 bg-purple-400/80 rounded w-20"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                    <div className="space-y-1">
                      <div className="h-3 bg-white/60 rounded w-18"></div>
                      <div className="h-5 bg-yellow-400/80 rounded w-14"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and tables area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <PieChart className="w-6 h-6 text-cyan-400" />
                    <div className="h-4 bg-white/60 rounded w-32"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gradient-to-r from-cyan-400/60 to-transparent rounded w-full"></div>
                    <div className="h-3 bg-gradient-to-r from-green-400/60 to-transparent rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-blue-400/60 to-transparent rounded w-1/2"></div>
                    <div className="h-3 bg-gradient-to-r from-purple-400/60 to-transparent rounded w-2/3"></div>
                  </div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-orange-400" />
                    <div className="h-4 bg-white/60 rounded w-40"></div>
                  </div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400/60 to-blue-400/60 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-white/60 rounded w-3/4"></div>
                          <div className="h-2 bg-white/40 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-green-400/60 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transaction history area */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-indigo-400" />
                  <div className="h-4 bg-white/60 rounded w-48"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400/60 to-emerald-400/60 rounded-full"></div>
                        <div className="space-y-1">
                          <div className="h-3 bg-white/60 rounded w-32"></div>
                          <div className="h-2 bg-white/40 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="h-3 bg-green-400/60 rounded w-16"></div>
                        <div className="h-2 bg-white/40 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay with blur effect to show content is being reviewed */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-md"></div>

        {/* Additional floating elements */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm border-primary/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Earn While You Build
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Earn Rewards
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            We don't just make blockchain interactions effortless — we reward you for every action too.
            <br />
            <span className="text-lg text-muted-foreground/80">
              Experience the future where building on VeChain pays you back.
            </span>
          </p>

          {/* Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-4 mx-auto">
                <Coins className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Write Operations</h3>
              <p className="text-sm text-muted-foreground">
                Every transaction you make earns you VeBetter rewards
              </p>
            </Card>

            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto">
                <Gift className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ecosystem Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn from multiple ecosystems simultaneously
              </p>
            </Card>

            <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4 mx-auto">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Plugin System</h3>
              <p className="text-sm text-muted-foreground">
                Connect to any reward-enabled ecosystem
              </p>
            </Card>
          </motion.div>

          {/* VeBetter Integration Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative w-16 h-16">
                  <Image
                    src="/images/vebetter.png"
                    alt="VeBetter"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="text-2xl font-bold text-muted-foreground">×</div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-8 h-8 text-primary" />
                  <span className="text-xl font-bold">VeChain AI Terminal</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Powered by VeBetter Ecosystem</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Seamlessly integrated with VeBetter's sustainability rewards platform. 
                Every interaction contributes to a better world while earning you valuable rewards.
              </p>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/docs/earn">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border/50 hover:border-primary/30">
                <Link href="/chat">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try VeChain Terminal
                </Link>
              </Button>
            </div>

            <div className="text-3xl font-bold text-muted-foreground/60">
              Coming Soon
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom floating elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </div>
  );
}