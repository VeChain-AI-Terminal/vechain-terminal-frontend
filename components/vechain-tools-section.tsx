"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const tools = [
  {
    id: "vechain-stats",
    name: "VeChain Stats",
    description: "Real-time blockchain analytics",
    image: "/images/vechain-stats.png",
    href: "https://vechainstats.com/",
  },
  {
    id: "vechain-kit",
    name: "VeChainKit",
    description: "Comprehensive SDK for VeChain development",
    image: "/images/vechain-kit.png",
    href: "https://vechainkit.vechain.org/",
  },
  {
    id: "wanchain",
    name: "WanChain",
    description: "Cross-chain bridge protocol",
    image: "/images/wanchain.avif",
    href: "https://docs.wanchain.org/developers/",
  },
];

export default function VeChainToolsSection() {
  return (
    <section className="py-32 bg-background/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet VeChain AI Terminal Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools integrated into your AI terminal for seamless VeChain development
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 border rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Tool Logo */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <Image
                        src={tool.image}
                        alt={tool.name}
                        width={80}
                        height={80}
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Tool Name */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Additional Tools Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Stargate (Staking) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <a
                href="https://docs.stargate.vechain.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 border rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <Image
                      src="/images/stargate.png"
                      alt="Stargate"
                      width={80}
                      height={80}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Stargate
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      VET staking protocol
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* VeChain SDK Core */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <a
                href="https://docs.vechain.org/developer-resources/sdks-and-providers/sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 border rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-mono text-primary">{`{ }`}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors font-mono">
                      vechain/sdk-core
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Core SDK library
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* VeBetter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="group"
            >
              <a
                href="https://vebetter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 border rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <Image
                      src="/images/vebetter.png"
                      alt="VeBetter"
                      width={80}
                      height={80}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      VeBetter
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Sustainability rewards platform
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            All tools are seamlessly integrated into your AI terminal experience
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Explore all tools in the terminal
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
