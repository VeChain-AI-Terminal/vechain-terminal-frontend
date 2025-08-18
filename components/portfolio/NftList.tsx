"use client";

import useSWR from "swr";
import Image from "next/image";
import { NFTItem } from "@/app/api/portfolio/nfts/route";
import { fetcher } from "@/components/portfolio/Portfolio";

function shortAddr(addr: string, head = 6, tail = 4) {
  if (!addr) return "";
  return addr.length > head + tail
    ? `${addr.slice(0, head)}…${addr.slice(-tail)}`
    : addr;
}

function NFTCard({ nft }: { nft: NFTItem }) {
  const title =
    nft.name && nft.name.trim().length > 0 ? nft.name : `#${nft.inner_id}`;
  const thumb = nft.thumbnail_url || nft.content || ""; // Debank sometimes puts media in content

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-3 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700">
          {thumb ? (
            <Image
              src={thumb}
              alt={title}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">
              NFT
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {nft.detail_url ? (
              <a
                href={nft.detail_url}
                target="_blank"
                rel="noreferrer"
                className="truncate font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                title={title}
              >
                {title}
              </a>
            ) : (
              <div
                className="truncate font-medium text-zinc-900 dark:text-zinc-100"
                title={title}
              >
                {title}
              </div>
            )}

            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {nft.is_erc721 ? "ERC-721" : "NFT"}
            </span>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {nft.collection_name || nft.contract_name || "Unknown Collection"}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="tabular-nums">
              Qty:{" "}
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                {nft.amount}
              </span>
            </span>
            <span className="opacity-50">•</span>
            <span title={nft.contract_id}>
              Contract: {shortAddr(nft.contract_id)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NFTList({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR<NFTItem[]>(
    `/api/portfolio/nfts?address=${address}`,
    fetcher
  );

  if (isLoading) {
    return <div className="py-4 text-sm text-gray-400">Loading NFTs…</div>;
  }
  if (error) {
    return (
      <div className="py-4 text-sm text-red-500">Failed to load NFTs.</div>
    );
  }

  const nfts = data ?? [];

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">NFTs</h2>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {nfts.length} item{nfts.length === 1 ? "" : "s"}
        </div>
      </div>

      {nfts.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400 py-3">
          No NFTs found on this chain.
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nfts.map((nft) => (
            <NFTCard
              key={`${nft.id}-${nft.contract_id}-${nft.inner_id}`}
              nft={nft}
            />
          ))}
        </div>
      )}
    </section>
  );
}
