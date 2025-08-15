import React from "react";

type ColendRow = {
  symbol: string;
  poolMeta?: string | null;
  project: string;
  tvlUsd: number | null;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  apyMean30d: number | null;
  apyPct1D?: number | null;
  apyPct7D?: number | null;
};

interface ColendTableProps {
  data: ColendRow[];
}

const fmtPct = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined ? "—" : `${v.toFixed(digits)}%`;

const fmtUSD = (v: number | null | undefined) =>
  v === null || v === undefined
    ? "—"
    : v >= 1_000_000_000
    ? `$${(v / 1_000_000_000).toFixed(2)}b`
    : v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(2)}m`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(2)}k`
    : `$${v.toFixed(0)}`;

const ColendTable: React.FC<ColendTableProps> = ({ data }) => {
  // filter only items with APY > 0
  const filteredData = data.filter((r) => (r.apy ?? 0) > 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-theme-orange rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="rounded-lg text-sm">
            <tr className="bg-zinc-900 text-zinc-200 text-center text-sm">
              <th className="px-4 py-2 border-b border-zinc-800">Name</th>
              <th className="px-4 py-2 border-b border-zinc-800">Project</th>
              <th className="px-4 py-2 border-b border-zinc-800">TVL</th>
              <th className="px-4 py-2 border-b border-zinc-800">APY</th>
              <th className="px-4 py-2 border-b border-zinc-800">Base APY</th>
              <th className="px-4 py-2 border-b border-zinc-800">Reward APY</th>
              <th className="px-4 py-2 border-b border-zinc-800">
                30d Avg APY
              </th>
              <th className="px-4 py-2 border-b border-zinc-800">
                APY change 1d
              </th>
              <th className="px-4 py-2 border-b border-zinc-800">
                APY change 7d
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-900/50">
                <td className="px-4 py-2 border-b border-zinc-800">
                  {r.poolMeta || r.symbol}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {r.project}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtUSD(r.tvlUsd)}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtPct(r.apy)}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtPct(r.apyBase)}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtPct(r.apyReward)}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtPct(r.apyMean30d)}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtPct(r.apyPct1D)}
                </td>
                <td className="px-4 py-2 border-b border-zinc-800">
                  {fmtPct(r.apyPct7D)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ColendTable;
