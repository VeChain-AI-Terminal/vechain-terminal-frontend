"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function McpServerPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">MCP Server</span>
        </Badge>
        
        <h1 className="text-4xl font-bold mb-4">MCP Server Setup</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Model Context Protocol server setup and usage for advanced integrations.
        </p>
      </motion.div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p>MCP Server documentation coming soon...</p>
      </div>
    </div>
  );
}