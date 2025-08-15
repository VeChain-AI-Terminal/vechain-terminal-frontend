import { tool } from "ai";
import { z } from "zod";

const CHAIN_ID = 1116;

// ---------- types ----------
export interface TokenPriceData {
  price_usd?: number;
  volume_24h_usd?: number;
  market_cap_usd?: number;
  circulating_supply?: number;
  total_supply?: number;
  percent_change_24h?: number;
  price_timestamp?: string;
  usd_value?: number;
}

interface RawTokenData {
  chain_id: number;
  token_address: string;
  owner_address: string;
  balance: string; // raw string from API
  name: string;
  symbol: string;
  decimals: number;
  price_data?: TokenPriceData;
}

// Add balanceHuman to TokenData
export interface TokenData extends RawTokenData {
  balanceHuman: number; // parsed using decimals
}

export interface NFTAttribute {
  display_type?: string;
  trait_type?: string;
  value?: any;
}

export interface NFTCollection {
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
}

export interface NFTData {
  animation_url?: string | null;
  attributes?: NFTAttribute[];
  chain_id: number;
  collection?: NFTCollection;
  description?: string | null;
  external_url?: string | null;
  image_url?: string | null;
  metadata?: Record<string, any>;
  name?: string | null;
  token_address: string;
  token_id: string;
}

export interface PortfolioData {
  chainId: number;
  walletAddress: string;
  fungibleTokens: TokenData[];
  nfts: NFTData[];
  totalPortfolioValueUSD: number;
  stakingPortfolio?: any;
  totalStakedValue: number;
  totalClaimedValue: number;
  totalPendingValue: number;
}

//staking portfolio type
export type StakingPortfolioData = {
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

// staking portfolio type (cleaned, human units)
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

async function getStakingPortfolio(
  walletAddress: string
): Promise<CleanedStakingPortfolio | null> {
  try {
    const url = new URL("https://staking-api.coredao.org/staking/summary/core");

    // Some deployments use `address`, others `coreAddress`. Set both to be safe.
    url.searchParams.set("coreAddress", walletAddress);
    url.searchParams.set("address", walletAddress);

    const apiKey = process.env.CORE_SCAN_API_KEY;
    if (apiKey) url.searchParams.set("apikey", apiKey);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "follow",
    });

    if (!res.ok) {
      console.error(
        `Staking API request failed: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const json = (await res.json()) as {
      code: string;
      data: StakingPortfolioData;
      message: string;
    };

    const d = json?.data;
    if (!d) return null;

    // Convert 18-decimal bigints to human numbers
    const toUnit = (v?: string, decimals = 18) => {
      const s = v ?? "0";
      if (!/^\d+$/.test(s)) return 0;
      // Avoid precision loss for UI numbers at normal magnitudes:
      // use Number for convenience; if you expect >1e15 CORE, switch to decimal.js
      const int =
        s.length > decimals ? Number(s.slice(0, s.length - decimals)) : 0;
      const fracStr =
        s.length > decimals
          ? s.slice(s.length - decimals)
          : s.padStart(decimals, "0");
      const frac = Number(fracStr.replace(/0+$/, "")) / 10 ** fracStr.length;
      return int + frac;
    };

    const cleaned: CleanedStakingPortfolio = {
      stakedCORE: toUnit(d.stakedCoreAmount),
      stakedHash: toUnit(d.stakedHashAmount),
      stakedBTC: toUnit(d.stakedBTCAmount),

      pendingCOREReward: toUnit(d.pendingCoreReward),
      pendingHashReward: toUnit(d.pendingHashReward),
      pendingBTCReward: toUnit(d.pendingBTCReward),

      claimedCOREReward: toUnit(d.claimedCoreReward),
      claimedHashReward: toUnit(d.claimedHashReward),
      claimedBTCReward: toUnit(d.claimedBTCReward),
      // convenience totals
      totalPendingReward:
        toUnit(d.pendingCoreReward) +
        toUnit(d.pendingHashReward) +
        toUnit(d.pendingBTCReward),
      totalClaimedReward:
        toUnit(d.claimedCoreReward) +
        toUnit(d.claimedHashReward) +
        toUnit(d.claimedBTCReward),
    };

    return cleaned;
  } catch (err) {
    console.error("Failed to fetch staking summary:", err);
    return null;
  }
}

/** ---------- Fetch helpers (try/catch) ---------- */

async function getTokensData(walletAddress: string): Promise<TokenData[]> {
  try {
    const url = `https://api.thirdweb.com/v1/wallets/${walletAddress}/tokens?chainId=${CHAIN_ID}&limit=20&page=1`;
    const res = await fetch(url, {
      headers: { "x-secret-key": process.env.THIRDWEB_SECRET_KEY as string },
    });

    if (!res.ok) {
      console.error(`Token fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = (await res.json()) as any;
    const rawTokens: RawTokenData[] = (json?.result?.tokens ??
      []) as RawTokenData[];

    const tokens: TokenData[] = rawTokens.map((t) => {
      const decimals = typeof t.decimals === "number" ? t.decimals : 18;
      const balanceHuman = toUnits(t.balance, decimals);
      return { ...t, balanceHuman };
    });

    return tokens;
  } catch (err) {
    console.error("Error fetching token data:", err);
    return [];
  }
}

async function getNftsData(walletAddress: string): Promise<NFTData[]> {
  try {
    const url = `https://api.thirdweb.com/v1/wallets/${walletAddress}/nfts?chainId=${CHAIN_ID}&limit=20&page=1`;
    const res = await fetch(url, {
      headers: { "x-secret-key": process.env.THIRDWEB_SECRET_KEY as string },
    });
    console.log(url, process.env.THIRDWEB_SECRET_KEY);
    if (!res.ok) {
      console.error(`NFT fetch failed: ${res.status} ${res.statusText}`);
      return {
        //@ts-ignore
        error: `NFT fetch failed: ${res.status} ${res.statusText}`,
      };
    }
    const json = (await res.json()) as any;
    return (json?.result?.nfts ?? []) as NFTData[];
  } catch (err) {
    console.error("Error fetching NFT data:", err);
    return [];
  }
}

/** ---------- Tool ---------- */
export const getPortfolio = tool({
  description:
    "Get the portfolio for a Core wallet with chainId, walletAddress, fungibleTokens, nfts, totalPortfolioValueUSD, and optional stakingPortfolio.",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("wallet address of the wallet to fetch portfolio for."),
  }),
  execute: async ({ walletAddress }: { walletAddress: string }) => {
    console.log("fetching portfolio for", walletAddress);

    const [fungibleTokens, nfts, stakingPortfolio] = await Promise.all([
      getTokensData(walletAddress),
      getNftsData(walletAddress),
      getStakingPortfolio(walletAddress),
    ]);

    // helper to get price from token symbol
    const getPrice = (symbol: string) => {
      const token = fungibleTokens.find(
        (t) => t.symbol?.toUpperCase() === symbol.toUpperCase()
      );
      return token?.price_data?.price_usd ?? 0;
    };

    // Sum using provided usd_value when available
    const totalPortfolioValueUSD = fungibleTokens.reduce((sum, t) => {
      return sum + (t.price_data?.usd_value ?? 0);
    }, 0);

    let totalStakedValue = 0;
    let totalClaimedValue = 0;
    let totalPendingValue = 0;

    if (stakingPortfolio) {
      // Staked
      totalStakedValue +=
        (stakingPortfolio.stakedCORE ?? 0) * getPrice("CORE") +
        (stakingPortfolio.stakedHash ?? 0) * getPrice("HASH") +
        (stakingPortfolio.stakedBTC ?? 0) * getPrice("BTC");

      // Claimed rewards
      totalClaimedValue +=
        (stakingPortfolio.claimedCOREReward ?? 0) * getPrice("CORE") +
        (stakingPortfolio.claimedHashReward ?? 0) * getPrice("HASH") +
        (stakingPortfolio.claimedBTCReward ?? 0) * getPrice("BTC");

      // Pending rewards
      totalPendingValue +=
        (stakingPortfolio.pendingCOREReward ?? 0) * getPrice("CORE") +
        (stakingPortfolio.pendingHashReward ?? 0) * getPrice("HASH") +
        (stakingPortfolio.pendingBTCReward ?? 0) * getPrice("BTC");
    }

    const portfolioData: PortfolioData & {
      totalStakedValue: number;
      totalClaimedValue: number;
      totalPendingValue: number;
    } = {
      chainId: CHAIN_ID,
      walletAddress,
      fungibleTokens,
      nfts,
      totalPortfolioValueUSD,
      stakingPortfolio,
      totalStakedValue,
      totalClaimedValue,
      totalPendingValue,
    };

    return portfolioData;
  },
});
