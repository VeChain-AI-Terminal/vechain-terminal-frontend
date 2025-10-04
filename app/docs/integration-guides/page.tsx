"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function IntegrationGuidesPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Integration Guides</span>
        </Badge>
        
        <h1 className="text-4xl font-bold mb-4">Integration Guides</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Step-by-step guides for integrating VeChain Terminal into your applications.
        </p>
      </motion.div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p>Integration guides coming soon...</p>
      </div>
    </div>
  );
}