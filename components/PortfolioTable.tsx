import React from "react";
import {
  TokenData,
  NFTData,
  PortfolioData,
  CleanedStakingPortfolio,
} from "@/lib/ai/tools/getPortfolio";

const getPercentChangeColor = (percentChange: number) => {
  if (percentChange > 0) return "text-green-700";
  if (percentChange < 0) return "text-red-700";
  return "text-gray-400";
};

// Convert wei-like string to human units without external libs
function toUnits(balanceStr: string, decimals: number): number {
  try {
    const b = BigInt(balanceStr);
    const base = 10n ** BigInt(decimals);
    const whole = b / base;
    const frac = b % base;
    return Number(whole) + Number(frac) / Number(base);
  } catch {
    // Fallback (precision may be off for very large numbers)
    return parseFloat(balanceStr) / Math.pow(10, decimals);
  }
}

const PortfolioTable: React.FC<PortfolioData> = ({
  chainId,
  walletAddress,
  fungibleTokens,
  nfts,
  totalPortfolioValueUSD,
  stakingPortfolio,
  totalStakedValue,
  totalClaimedValue,
  totalPendingValue,
}) => {
  // console.log("staking portfolio ,", stakingPortfolio);
  const derived = (fungibleTokens ?? []).map((t) => {
    const balanceHuman =
      t.balance && typeof t.decimals === "number"
        ? toUnits(t.balance, t.decimals)
        : 0;

    const price = t.price_data?.price_usd ?? 0;
    const usdValue =
      t.price_data?.usd_value ??
      (price > 0 && balanceHuman > 0 ? balanceHuman * price : 0);

    const change24hPercent = t.price_data?.percent_change_24h ?? 0;
    const marketCap = t.price_data?.market_cap_usd;

    return {
      key: t.token_address,
      name: t.name,
      symbol: t.symbol,
      balanceHuman,
      price,
      usdValue,
      change24hPercent,
      marketCap,
    };
  });

  const totalUSD =
    typeof totalPortfolioValueUSD === "number"
      ? totalPortfolioValueUSD
      : derived.reduce((s, t) => s + (t.usdValue || 0), 0);

  const weightedChangePercent =
    totalUSD > 0
      ? derived.reduce(
          (s, t) => s + (t.usdValue || 0) * (t.change24hPercent || 0),
          0
        ) / totalUSD
      : 0;

  const absoluteChange = (weightedChangePercent / 100) * totalUSD;

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white px-4 py-4 rounded-lg w-full max-w-md mt-2 md:mt-0">
      {/* Portfolio Header */}
      <div className="flex flex-col pb-2 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-row gap-1 justify-between">
          <h2 className="text-xl font-semibold">Portfolio</h2>
          {totalUSD > 0 && (
            <div className="text-theme-orange">
              <span className="text-xl font-bold ">
                ${totalUSD.toFixed(2)}{" "}
              </span>
              <span className="text-sm">USD</span>
            </div>
          )}
        </div>

        {(chainId || walletAddress || (nfts?.length ?? 0) > 0) && (
          <div className="mt-1 text-xs text-gray-500">
            {chainId ? (
              <>
                Chain ID: <span className="font-mono">{chainId}</span>
              </>
            ) : null}
            {walletAddress ? (
              <>
                <span className="mx-2">|</span>
                Wallet:{" "}
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </>
            ) : null}
            {nfts && nfts.length > 0 ? (
              <>
                <span className="mx-2">|</span>
                NFTs: <span>{nfts.length}</span>
              </>
            ) : null}
          </div>
        )}

        {totalUSD > 0 ? (
          <span className="text-sm text-gray-400 mt-1">
            24h Change:{" "}
            <span className={getPercentChangeColor(weightedChangePercent)}>
              {weightedChangePercent.toFixed(2)}% &#x28;
              {absoluteChange.toFixed(2)} USD&#x29;
            </span>
          </span>
        ) : null}
      </div>

      {/* Tokens */}
      <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {derived.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">
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
                    <span className="text-xs text-gray-500">({t.symbol})</span>
                  )}
                </div>
                {t.balanceHuman > 0 && (
                  <div className="text-sm text-gray-500">
                    {t.balanceHuman.toFixed(4)} {t.symbol} @ $
                    {t.price.toFixed(4)}
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  ${t.usdValue >= 0 ? t.usdValue.toFixed(2) : "0.00"}
                </div>

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

      {/* Staking Portfolio */}
      {stakingPortfolio && (
        <div className="mt-4 border-t border-neutral-200 dark:border-neutral-700 pt-3">
          {/* Header */}
          <div className="flex flex-row gap-1 justify-between mb-2">
            <h2 className="text-xl font-semibold">Staked</h2>
            {totalStakedValue > 0 && (
              <div className="text-theme-orange">
                <span className="text-xl font-bold">
                  ${totalStakedValue.toFixed(2)}
                </span>{" "}
                <span className="text-sm">USD</span>
              </div>
            )}
          </div>

          {(() => {
            const fmt = (n?: number, digits = 4) =>
              typeof n === "number" && isFinite(n)
                ? n.toLocaleString(undefined, { maximumFractionDigits: digits })
                : "0";

            const fmtUSD = (n?: number) =>
              typeof n === "number" && isFinite(n)
                ? `$${n.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`
                : "$0.00";

            return (
              <div className="space-y-1 text-sm">
                {/* Staked */}
                <div className="flex justify-between">
                  <span className="text-gray-400">Staked CORE</span>
                  <span className="font-medium">
                    {fmt(stakingPortfolio.stakedCORE, 4)} CORE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Staked Hash</span>
                  <span className="font-medium">
                    {fmt(stakingPortfolio.stakedHash, 4)}
                  </span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-gray-400">Staked BTC</span>
                  <span className="font-medium">
                    {fmt(stakingPortfolio.stakedBTC, 8)} BTC
                  </span>
                </div>

                {/* Pending */}
                <div className="flex justify-between font-medium border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-2">
                  <span>Pending Rewards</span>
                  <span className="text-theme-orange">
                    {fmtUSD(totalPendingValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CORE</span>
                  <span>{fmt(stakingPortfolio.pendingCOREReward, 6)} CORE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hash</span>
                  <span>{fmt(stakingPortfolio.pendingHashReward, 6)}</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-gray-400">BTC</span>
                  <span>{fmt(stakingPortfolio.pendingBTCReward, 8)} BTC</span>
                </div>

                {/* Claimed */}
                <div className="flex justify-between font-medium border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-2">
                  <span>Claimed Rewards</span>
                  <span className="text-theme-orange">
                    {fmtUSD(totalClaimedValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CORE</span>
                  <span>{fmt(stakingPortfolio.claimedCOREReward, 6)} CORE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hash</span>
                  <span>{fmt(stakingPortfolio.claimedHashReward, 6)}</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-gray-400">BTC</span>
                  <span>{fmt(stakingPortfolio.claimedBTCReward, 8)} BTC</span>
                </div>

                {/* Totals */}
                <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-3 ">
                  <span className="text-gray-400">Total Pending</span>
                  <span className="font-semibold">
                    {fmt(stakingPortfolio.totalPendingReward, 6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Claimed</span>
                  <span className="font-semibold">
                    {fmt(stakingPortfolio.totalClaimedReward, 6)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default PortfolioTable;
