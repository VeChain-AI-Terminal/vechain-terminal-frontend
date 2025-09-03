// app/portfolio/[address]/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import dynamic from "next/dynamic";
import { TotalChainBalance } from "@/components/portfolio/TotalChainBalance";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

type TabKey = "tokens" | "protocols" | "nfts" | "staking" | "txnHistory";

const Tabs: { key: TabKey; label: string }[] = [
  { key: "tokens", label: "Tokens" },
  { key: "protocols", label: "Protocols" },
  { key: "nfts", label: "NFTs" },
  { key: "staking", label: "Core Staking" },
  { key: "txnHistory", label: "Transactions" },
];

// Lazy-load each section so we don’t even ship their code until needed.
const TokensSection = dynamic(
  () => import("@/components/portfolio/TokenList"),
  {
    ssr: false,
    loading: () => (
      <div className="py-4 text-sm text-gray-400">Loading Tokens…</div>
    ),
  }
);
const ProtocolList = dynamic(
  () => import("@/components/portfolio/ProtocolList"),
  {
    ssr: false,
    loading: () => (
      <div className="py-4 text-sm text-gray-400">Loading protocols…</div>
    ),
  }
);
const NFTList = dynamic(() => import("@/components/portfolio/NftList"), {
  ssr: false,
  loading: () => (
    <div className="py-4 text-sm text-gray-400">Loading NFTs…</div>
  ),
});
const CoreOfficialStakingStats = dynamic(
  () => import("@/components/portfolio/CoreOfficialStakingStats"),
  {
    ssr: false,
    loading: () => <div className="py-4 text-sm text-gray-400">Loading…</div>,
  }
);
const TransactionHistory = dynamic(
  () => import("@/components/portfolio/TransactionHistory"),
  {
    ssr: false,
    loading: () => (
      <div className="py-4 text-sm text-gray-400">
        Loading transaction history…
      </div>
    ),
  }
);

export default function Portfolio() {
  const { isConnected, address } = useAppKitAccount();

  // Default to "tokens"; you can also restore from URL hash if you want.
  const [active, setActive] = useState<TabKey>("tokens");

  // Render just the active pane (so only that component mounts & fetches).
  const ActivePane = useMemo(() => {
    if (!address) return null;
    switch (active) {
      case "tokens":
        return <TokensSection address={address} />;
      case "protocols":
        return <ProtocolList address={address} />;
      case "nfts":
        return <NFTList address={address} />;
      case "staking":
        return <CoreOfficialStakingStats address={address} />;
      case "txnHistory":
        return <TransactionHistory address={address} />;
      default:
        return null;
    }
  }, [active, address]);

  return (
    <div className="px-4 py-6 md:px-8 space-y-4">
      <div className="flex items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        {isConnected && address && <TotalChainBalance address={address} />}
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Portfolio sections"
        className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800"
      >
        {Tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              className={`px-3 py-2 text-sm rounded-t-md transition-colors
                ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-theme-orange dark:border-theme-orange border-b-transparent"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div role="tabpanel" className="mt-2">
        {address ? (
          ActivePane ?? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              Select a tab…
            </div>
          )
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            Connect your wallet to view the portfolio.
          </div>
        )}
      </div>
    </div>
  );
}
