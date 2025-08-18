import { useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import { toUnits } from "@/lib/utils/to-units";
import { fetcher } from "@/components/portfolio/Portfolio";

type TokenData = {
  token_address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo_url?: string | null;
  balance: string; // raw_amount
  price?: number;
  price_24h_change?: number | null; // fraction. ex: -0.0226 => -2.26%
  total_supply?: number;
  usd_value?: number;
};

const fmtNum = (n: number, d = 4) =>
  n >= 1
    ? n.toLocaleString(undefined, { maximumFractionDigits: 4 })
    : n.toFixed(d);

const fmtCompact = (n: number, d = 2) => {
  if (n === 0) return "0";
  if (Math.abs(n) < 1000) return n.toFixed(d);

  const units = ["", "k", "M", "B", "T"];
  let idx = 0;
  let val = n;

  while (Math.abs(val) >= 1000 && idx < units.length - 1) {
    val /= 1000;
    idx++;
  }

  return `${val.toFixed(d)}${units[idx]}`;
};

const changeColor = (p: number) =>
  p > 0 ? "text-green-600" : p < 0 ? "text-red-600" : "text-gray-400";

function TokensSection({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR<{ tokens: TokenData[] }>(
    `/api/portfolio/tokens?address=${address}`,
    fetcher
  );

  // console.log("data --- ", data);

  const derived = useMemo(() => {
    const list = data?.tokens ?? [];
    return list
      .map((t) => {
        const amount = toUnits(t.balance ?? "0", t.decimals ?? 18);
        const price = t.price ?? 0;
        const usdValue =
          typeof t.usd_value === "number" ? t.usd_value : amount * price;

        const change24hPercent =
          typeof t.price_24h_change === "number" ? t.price_24h_change * 100 : 0;

        return {
          key: t.token_address,
          logo: t.logo_url ?? null,
          name: t.name,
          symbol: t.symbol,
          price,
          amount,
          usdValue,
          change24hPercent,
        };
      })
      .sort((a, b) => {
        if (b.usdValue !== a.usdValue) return b.usdValue - a.usdValue;
        return b.amount - a.amount;
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
    <section className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-4 w-full">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300">
            {/* wallet glyph */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 7a3 3 0 0 1 3-3h12v2H6a1 1 0 0 0-1 1v1h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm16 5h-3a1 1 0 1 0 0 2h3v-2Z" />
            </svg>
          </span>
          <h2 className="text-xl font-semibold">Wallet</h2>
        </div>
        <div className="text-right text-zinc-900 dark:text-zinc-100 font-semibold">
          {fmtCompact(totals.totalUSD)}
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr,0.8fr] text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg px-4 py-2">
        <div>Token</div>
        <div>Price</div>
        <div>Amount</div>
        <div>USD Value</div>
        <div>24h</div>
      </div>

      {isLoading && (
        <div className="py-4 text-sm text-gray-400">Loading tokens...</div>
      )}
      {error && (
        <div className="py-4 text-sm text-red-500">Failed to load tokens.</div>
      )}

      {!isLoading && !error && (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {derived.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 py-3 px-4">
              No holdings available.
            </div>
          ) : (
            derived.map((t) => (
              <div
                key={t.key}
                className="grid grid-cols-[1.5fr,1fr,1fr,1fr,0.8fr] items-center md:px-4 lg:px-4 py-3 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Token cell */}
                <div className="flex items-center gap-3">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 dark:ring-zinc-700">
                    {t.logo ? (
                      <Image
                        src={t.logo}
                        alt={t.symbol || t.name}
                        fill
                        sizes="28px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs">
                        {t.symbol?.slice(0, 3) ?? "TOK"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="hidden md:block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                      {t.symbol}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-sm text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {fmtCompact(t.price)}
                </div>

                {/* Amount */}
                <div className="text-sm text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {fmtNum(t.amount)}
                </div>

                {/* USD Value */}
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {fmtCompact(t.usdValue)}
                </div>

                {/* 24h Change */}
                <div
                  className={`text-sm font-medium tabular-nums ${changeColor(
                    t.change24hPercent
                  )}`}
                >
                  {t.change24hPercent.toFixed(2)}%
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default TokensSection;
