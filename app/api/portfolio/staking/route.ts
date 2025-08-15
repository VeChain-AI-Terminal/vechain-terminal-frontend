// app/api/portfolio/staking/route.ts
import { NextResponse } from "next/server";

export type CleanedStakingPortfolio = {
  stakedCORE: number;
  stakedHash: number;
  stakedBTC: number;

  pendingCOREReward: number;
  pendingHashReward: number;
  pendingBTCReward: number;

  claimedCOREReward: number;
  claimedHashReward: number;
  claimedBTCReward: number;

  totalPendingReward: number;
  totalClaimedReward: number;
};

type StakingPortfolioData = {
  stakedCoreAmount: string;
  stakedHashAmount: string;
  stakedBTCAmount: string;
  pendingCoreReward: string;
  pendingHashReward: string;
  pendingBTCReward: string;
  claimedCoreReward: string;
  claimedHashReward: string;
  claimedBTCReward: string;
};

async function getStakingPortfolio(
  walletAddress: string
): Promise<CleanedStakingPortfolio | null> {
  try {
    const url = new URL("https://staking-api.coredao.org/staking/summary/core");
    url.searchParams.set("coreAddress", walletAddress);
    url.searchParams.set("address", walletAddress);
    const apiKey = process.env.CORE_SCAN_API_KEY;
    if (apiKey) url.searchParams.set("apikey", apiKey);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "follow",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `Staking API request failed: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const json = (await res.json()) as {
      code: string;
      data: StakingPortfolioData | undefined;
      message: string;
    };

    const d = json?.data;
    if (!d) return null;

    const toUnit = (v?: string, decimals = 18) => {
      const s = v ?? "0";
      if (!/^\d+$/.test(s)) return 0;
      const int =
        s.length > decimals ? Number(s.slice(0, s.length - decimals)) : 0;
      const fracStr =
        s.length > decimals
          ? s.slice(s.length - decimals)
          : s.padStart(decimals, "0");
      const frac = Number(fracStr.replace(/0+$/, "")) / 10 ** fracStr.length;
      return int + frac;
    };

    return {
      stakedCORE: toUnit(d.stakedCoreAmount),
      stakedHash: toUnit(d.stakedHashAmount),
      stakedBTC: toUnit(d.stakedBTCAmount),
      pendingCOREReward: toUnit(d.pendingCoreReward),
      pendingHashReward: toUnit(d.pendingHashReward),
      pendingBTCReward: toUnit(d.pendingBTCReward),
      claimedCOREReward: toUnit(d.claimedCoreReward),
      claimedHashReward: toUnit(d.claimedHashReward),
      claimedBTCReward: toUnit(d.claimedBTCReward),
      totalPendingReward:
        toUnit(d.pendingCoreReward) +
        toUnit(d.pendingHashReward) +
        toUnit(d.pendingBTCReward),
      totalClaimedReward:
        toUnit(d.claimedCoreReward) +
        toUnit(d.claimedHashReward) +
        toUnit(d.claimedBTCReward),
    };
  } catch (err) {
    console.error("Failed to fetch staking summary:", err);
    return null;
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address)
    return NextResponse.json({ error: "Missing address" }, { status: 400 });

  const staking = await getStakingPortfolio(address);
  return NextResponse.json({ staking });
}
