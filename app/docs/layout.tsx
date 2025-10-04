"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Code, 
  Server, 
  FileText, 
  Puzzle, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const docsNavigation = [
  {
    name: "Getting Started",
    href: "/docs/getting-started",
    icon: BookOpen,
    description: "Quick start guide and setup instructions"
  },
  {
    name: "Architecture",
    href: "/docs/architecture", 
    icon: Building2,
    description: "System design and technical overview"
  },
  {
    name: "MCP Server",
    href: "/docs/mcp-server",
    icon: Server,
    description: "MCP server setup and usage"
  },
  {
    name: "API Reference",
    href: "/docs/api-reference",
    icon: FileText,
    description: "Complete API documentation"
  },
  {
    name: "Integration Guides",
    href: "/docs/integration-guides", 
    icon: Puzzle,
    description: "How to integrate VeChain Terminal"
  },
  {
    name: "Examples",
    href: "/docs/examples",
    icon: Code,
    description: "Code examples and tutorials"
  },
  {
    name: "FAQ",
    href: "/docs/faq",
    icon: HelpCircle,
    description: "Frequently asked questions"
  }
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-card/30 backdrop-blur-sm fixed h-screen overflow-y-auto">
          <div className="h-full p-6 space-y-6">
            <div>
              <Link href="/docs" className="flex items-center gap-2 text-xl font-bold mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Documentation
              </Link>
              <p className="text-sm text-muted-foreground">
                Everything you need to build with VeChain Terminal
              </p>
            </div>

            <nav className="space-y-2">
              {docsNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link href="/chat">
                  Try VeChain Terminal
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <aside className="w-64 h-full bg-card border-r p-6 space-y-6">
              <div>
                <Link href="/docs" className="flex items-center gap-2 text-xl font-bold mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Documentation
                </Link>
                <p className="text-sm text-muted-foreground">
                  Everything you need to build with VeChain Terminal
                </p>
              </div>

              <nav className="space-y-2">
                {docsNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64 ml-0">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}