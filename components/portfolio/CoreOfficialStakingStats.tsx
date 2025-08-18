import { CleanedStakingPortfolio } from "@/app/api/portfolio/staking/route";
import { fetcher } from "@/components/portfolio/Portfolio";
import useSWR from "swr";

export default function CoreOfficialStakingStats({
  address,
}: {
  address: string;
}) {
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
