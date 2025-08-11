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

export interface TokenData {
  chain_id: number;
  token_address: string;
  owner_address: string;
  balance: string; // raw string from API
  name: string;
  symbol: string;
  decimals: number;
  price_data?: TokenPriceData;
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
      return {
        //@ts-ignore
        error: `Token fetch failed: ${res.status} ${res.statusText}`,
      };
    }
    const json = (await res.json()) as any;
    return (json?.result?.tokens ?? []) as TokenData[];
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

// ---------- Tool ----------
/** ---------- Tool ---------- */
export const getPortfolio = tool({
  description:
    "Create a PortfolioData object for a Core wallet with chainId, walletAddress, fungibleTokens, nfts, totalPortfolioValueUSD, and optional stakingPortfolio.",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("wallet address of the wallet to fetch portfolio for."),
  }),
  execute: async ({ walletAddress }: { walletAddress: string }) => {
    console.log("fetching portfolio for", walletAddress);

    const [fungibleTokens, nfts] = await Promise.all([
      getTokensData(walletAddress),
      getNftsData(walletAddress),
    ]);

    // Sum using provided usd_value when available
    const totalPortfolioValueUSD = fungibleTokens.reduce((sum, t) => {
      return sum + (t.price_data?.usd_value ?? 0);
    }, 0);

    const portfolioData: PortfolioData = {
      chainId: CHAIN_ID,
      walletAddress,
      fungibleTokens,
      nfts,
      totalPortfolioValueUSD,
    };

    return portfolioData;
  },
});
