// app/portfolio/[address]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { TokenData } from "@/app/api/portfolio/tokens/route";
import { NFTData } from "@/app/api/portfolio/nfts/route";
import { CleanedStakingPortfolio } from "@/app/api/portfolio/staking/route";
import { useAppKitAccount } from "@reown/appkit/react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const getPercentChangeColor = (percentChange: number) => {
  if (percentChange > 0) return "text-green-700";
  if (percentChange < 0) return "text-red-700";
  return "text-gray-400";
};

function TokensSection({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR<{ tokens: TokenData[] }>(
    `/api/portfolio/tokens?address=${address}`,
    fetcher
  );

  const derived = useMemo(() => {
    const list = data?.tokens ?? [];
    return list
      .map((t) => {
        const price = t.price_data?.price_usd ?? 0;
        const usdValue =
          t.price_data?.usd_value ??
          (price > 0 && t.balanceHuman > 0 ? t.balanceHuman * price : 0);
        const change24hPercent = t.price_data?.percent_change_24h ?? 0;
        const marketCap = t.price_data?.market_cap_usd;
        return {
          key: `${t.chain_id}:${t.token_address}`,
          name: t.name,
          symbol: t.symbol,
          balanceHuman: t.balanceHuman,
          price,
          usdValue,
          change24hPercent,
          marketCap,
        };
      })
      .sort((a, b) => {
        if (b.usdValue !== a.usdValue) {
          return b.usdValue - a.usdValue; // sort by usdValue first
        }
        return b.balanceHuman - a.balanceHuman; // then by balanceHuman
      });
  }, [data]);

  const totals = useMemo(() => {
    const totalUSD = derived.reduce((s, t) => s + (t.usdValue || 0), 0);
    const weightedChangePercent =
      totalUSD > 0
        ? derived.reduce(
            (s, t) => s + (t.usdValue || 0) * (t.change24hPercent || 0),
            0
          ) / totalUSD
        : 0;
    const absoluteChange = (weightedChangePercent / 100) * totalUSD;
    return { totalUSD, weightedChangePercent, absoluteChange };
  }, [derived]);

  return (
    <section className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white px-4 py-4 rounded-lg w-full max-w-2xl">
      <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
        <h2 className="text-xl font-semibold">Tokens</h2>
        {totals.totalUSD > 0 && (
          <div className="text-theme-orange text-right">
            <div className="text-xl font-bold">
              ${totals.totalUSD.toFixed(2)}
            </div>
            <div className="text-xs">
              24h{" "}
              <span
                className={getPercentChangeColor(totals.weightedChangePercent)}
              >
                {totals.weightedChangePercent.toFixed(2)}% (
                {totals.absoluteChange.toFixed(2)} USD)
              </span>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="py-4 text-sm text-gray-400">Loading tokens...</div>
      )}
      {error && (
        <div className="py-4 text-sm text-red-500">Failed to load tokens.</div>
      )}

      {!isLoading && !error && (
        <div className=" overflow-y-auto pr-2 custom-scrollbar">
          {derived.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 py-3">
              No holdings available.
            </div>
          ) : (
            derived.map((t) => (
              <div
                key={t.key}
                className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-none"
              >
                <div className="flex flex-col">
                  <div className="font-medium">
                    {t.name}{" "}
                    {t.symbol && (
                      <span className="text-xs text-gray-500">
                        ({t.symbol})
                      </span>
                    )}
                  </div>
                  {t.balanceHuman > 0 && (
                    <div className="text-sm text-gray-500">
                      <span className="text-white">
                        {t.balanceHuman.toFixed(4)}
                      </span>{" "}
                      {t.symbol} @ ${t.price.toFixed(4)}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="font-semibold">${t.usdValue.toFixed(2)}</div>
                  <div
                    className={`text-xs ${getPercentChangeColor(
                      t.change24hPercent
                    )}`}
                  >
                    {t.change24hPercent.toFixed(2)}%
                  </div>
                  {typeof t.marketCap === "number" && t.marketCap > 0 && (
                    <div className="text-[10px] text-gray-400">
                      MC: ${t.marketCap.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

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

function StakingSection({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR<{
    staking: CleanedStakingPortfolio | null;
  }>(`/api/portfolio/staking?address=${address}`, fetcher);

  const staking = data?.staking ?? null;

  const fmt = (n?: number, digits = 4) =>
    typeof n === "number" && isFinite(n)
      ? n.toLocaleString(undefined, { maximumFractionDigits: digits })
      : "0";
  const fmtUSD = (n?: number) =>
    typeof n === "number" && isFinite(n)
      ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "$0.00";

  // You can compute USD totals here if you also fetch prices. For now we show amounts.
  return (
    <section className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white px-4 py-4 rounded-lg w-full max-w-2xl">
      <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
        <h2 className="text-xl font-semibold">Staked</h2>
      </div>

      {isLoading && (
        <div className="py-4 text-sm text-gray-400">Loading staking...</div>
      )}
      {error && (
        <div className="py-4 text-sm text-red-500">Failed to load staking.</div>
      )}

      {!isLoading && !error && (
        <>
          {!staking ? (
            <div className="text-gray-600 dark:text-gray-400 py-3">
              No staking data.
            </div>
          ) : (
            <div className="space-y-1 text-sm pt-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Staked CORE</span>
                <span className="font-medium">
                  {fmt(staking.stakedCORE, 4)} CORE
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Staked Hash</span>
                <span className="font-medium">
                  {fmt(staking.stakedHash, 4)}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-gray-400">Staked BTC</span>
                <span className="font-medium">
                  {fmt(staking.stakedBTC, 8)} BTC
                </span>
              </div>

              <div className="flex justify-between font-medium border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-2">
                <span>Pending Rewards</span>
                <span className="text-theme-orange">
                  {fmtUSD(staking.totalPendingReward)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CORE</span>
                <span>{fmt(staking.pendingCOREReward, 6)} CORE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hash</span>
                <span>{fmt(staking.pendingHashReward, 6)}</span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-gray-400">BTC</span>
                <span>{fmt(staking.pendingBTCReward, 8)} BTC</span>
              </div>

              <div className="flex justify-between font-medium border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-2">
                <span>Claimed Rewards</span>
                <span className="text-theme-orange">
                  {fmtUSD(staking.totalClaimedReward)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CORE</span>
                <span>{fmt(staking.claimedCOREReward, 6)} CORE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hash</span>
                <span>{fmt(staking.claimedHashReward, 6)}</span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-gray-400">BTC</span>
                <span>{fmt(staking.claimedBTCReward, 8)} BTC</span>
              </div>

              <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <span className="text-gray-400">Total Pending</span>
                <span className="font-semibold">
                  {fmt(staking.totalPendingReward, 6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Claimed</span>
                <span className="font-semibold">
                  {fmt(staking.totalClaimedReward, 6)}
                </span>
              </div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <div className="text-xs text-gray-500 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {address ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TokensSection address={address} />
          <StakingSection address={address} />
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
