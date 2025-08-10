import React from "react";
import { PortfolioDataType } from "@/lib/types/portfolio-data";

const getPercentChangeColor = (percentChange: number) => {
  if (percentChange > 0) return "text-green-700";
  if (percentChange < 0) return "text-red-700";
  return "text-gray-400";
};

const PortfolioTable: React.FC<PortfolioDataType> = ({
  chainId,
  walletAddress,
  fungibleTokens,
  nfts,
  totalPortfolioValueUSD,
}) => {
  const totalUSD =
    typeof totalPortfolioValueUSD === "number"
      ? totalPortfolioValueUSD
      : fungibleTokens.reduce((sum, t) => sum + t.usdValue, 0);

  const weightedChangePercent =
    totalUSD > 0
      ? fungibleTokens.reduce(
          (sum, t) => sum + t.usdValue * t.change24hPercent,
          0
        ) / totalUSD
      : 0;

  const absoluteChange = (weightedChangePercent / 100) * totalUSD;

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white px-4 py-4 rounded-lg w-full max-w-md mt-2 md:mt-0">
      {/* Portfolio Header */}
      <div className="flex flex-col pb-2 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-row gap-1 justify-between">
          <h2 className="text-xl font-semibold ">Portfolio</h2>
          {totalUSD > 0 && (
            <div className="text-theme-orange">
              <span className="text-xl font-bold ">
                ${totalUSD.toFixed(2)}{" "}
              </span>
              <span className="text-sm">USD</span>
            </div>
          )}
        </div>

        {(chainId || walletAddress || nfts.length > 0) && (
          <div className="mt-1 text-xs text-gray-500">
            {chainId && (
              <>
                Chain ID: <span className="font-mono">{chainId}</span>
              </>
            )}
            {walletAddress && (
              <>
                <span className="mx-2">|</span>
                Wallet:{" "}
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </>
            )}
            {nfts.length > 0 && (
              <>
                <span className="mx-2">|</span>
                NFTs: <span>{nfts.length}</span>
              </>
            )}
          </div>
        )}

        {totalUSD > 0 && weightedChangePercent ? (
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
        {fungibleTokens.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">
            No holdings available.
          </div>
        ) : (
          fungibleTokens.map((t) => (
            <div
              key={t.tokenAddress}
              className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-none"
            >
              <div className="flex flex-col">
                <div className="font-medium">
                  {t.name}{" "}
                  {t.symbol && (
                    <span className="text-xs text-gray-500">({t.symbol})</span>
                  )}
                </div>
                {t.balance > 0 && (
                  <div className="text-sm text-gray-500">
                    {t.balance.toFixed(4)} {t.symbol} @ $
                    {t.currentPrice.toFixed(4)}
                  </div>
                )}
              </div>

              <div className="text-right">
                {t.usdValue >= 0 && (
                  <div className="font-semibold">${t.usdValue.toFixed(2)}</div>
                )}

                {t.change24hPercent ? (
                  <div
                    className={`text-xs ${getPercentChangeColor(
                      t.change24hPercent
                    )}`}
                  >
                    {t.change24hPercent.toFixed(2)}%
                  </div>
                ) : null}

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
    </div>
  );
};

export default PortfolioTable;
