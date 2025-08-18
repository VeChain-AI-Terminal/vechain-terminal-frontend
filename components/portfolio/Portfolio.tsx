// app/portfolio/[address]/page.tsx
"use client";

import React from "react";
import useSWR from "swr";
import { NFTData } from "@/app/api/portfolio/nfts/route";
import { useAppKitAccount } from "@reown/appkit/react";
import TokensSection from "@/components/portfolio/TokenList";
import ProtocolList from "@/components/portfolio/ProtocolList";
import { TotalChainBalance } from "@/components/portfolio/TotalChainBalance";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

function NFTsSection({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR<{ nfts: NFTData[] }>(
    `/api/portfolio/nfts?address=${address}`,
    fetcher
  );

  return (
    <section className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white px-4 py-4 rounded-lg w-full max-w-2xl">
      <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
        <h2 className="text-xl font-semibold">NFTs</h2>
        {!isLoading && (
          <span className="text-xs text-gray-500">
            {data?.nfts?.length ?? 0}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="py-4 text-sm text-gray-400">Loading NFTs...</div>
      )}
      {error && (
        <div className="py-4 text-sm text-red-500">Failed to load NFTs.</div>
      )}

      {!isLoading && !error && (
        <>
          {!data?.nfts || data.nfts.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 py-3">
              No NFTs found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              {data.nfts.map((nft) => (
                <div
                  key={`${nft.token_address}:${nft.token_id}`}
                  className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                >
                  <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800">
                    {nft.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nft.image_url}
                        alt={nft.name ?? "NFT"}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-gray-500 truncate">
                      {nft.collection?.name ?? "Collection"}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {nft.name ?? `#${nft.token_id}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function Portfolio() {
  const { isConnected, address } = useAppKitAccount();

  return (
    <div className="px-4 py-6 md:px-8 space-y-4">
      <div className="flex items-center gap-3 ">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        {isConnected && address && <TotalChainBalance address={address} />}
      </div>

      {address ? (
        <div className="flex flex-col gap-3">
          <TokensSection address={address} />
          <ProtocolList address={address} />
          <NFTsSection address={address} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          Loading portfolio...
        </div>
      )}
    </div>
  );
}
