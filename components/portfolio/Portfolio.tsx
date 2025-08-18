// app/portfolio/[address]/page.tsx
"use client";

import React from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import TokensSection from "@/components/portfolio/TokenList";
import ProtocolList from "@/components/portfolio/ProtocolList";
import { TotalChainBalance } from "@/components/portfolio/TotalChainBalance";
import NFTList from "@/components/portfolio/NftList";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Portfolio() {
  const { isConnected, address } = useAppKitAccount();

  return (
    <div className="px-4 py-6 md:px-8 space-y-4">
      <div className="flex items-center gap-3 ">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        {isConnected && address && <TotalChainBalance address={address} />}
      </div>

      {address ? (
        <div className="flex flex-col gap-5">
          <TokensSection address={address} />
          <ProtocolList address={address} />
          <NFTList address={address} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          Loading portfolio...
        </div>
      )}
    </div>
  );
}
