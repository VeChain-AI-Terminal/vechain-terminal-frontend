"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Navbar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex h-16 w-full items-center justify-between bg-background/50 backdrop-blur-md border-b border-border/50",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

export function NavbarLeft({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function NavbarRight({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}