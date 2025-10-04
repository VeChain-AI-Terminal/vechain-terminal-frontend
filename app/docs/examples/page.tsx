"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function ExamplesPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Examples</span>
        </Badge>
        
        <h1 className="text-4xl font-bold mb-4">Code Examples</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Real-world examples and code snippets to help you build with VeChain Terminal.
        </p>
      </motion.div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p>Code examples and tutorials coming soon...</p>
      </div>
    </div>
  );
}