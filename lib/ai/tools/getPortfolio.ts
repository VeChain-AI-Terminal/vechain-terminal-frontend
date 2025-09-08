import { tool } from "ai";
import { z } from "zod";
import { toUnits } from "@/lib/utils/to-units";

export const getPortfolio = tool({
  description:
    "Get the portfolio for a Core wallet with fungibleTokens, nfts, defi protocols stats and stakingPortfolio.",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("wallet address of the wallet to fetch portfolio for."),
  }),
  execute: async ({ walletAddress }) => {
    console.log("getting portolfio for wallet ", walletAddress);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const endpoints = {
      protocols: `${baseUrl}/api/portfolio/protocols?address=${walletAddress}`,
      staking: `${baseUrl}/api/portfolio/staking?address=${walletAddress}`,
      nfts: `${baseUrl}/api/portfolio/nfts?address=${walletAddress}`,
      tokens: `${baseUrl}/api/portfolio/tokens?address=${walletAddress}`,
    };

    async function getJson(url: string) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        // Turn non-OK into a rejection so allSettled captures it
        return "There was some error fetching porfolio, please try again.";
        // throw new Error(`HTTP ${res.status} for ${url}`);
      }
      return res.json();
    }

    const [protocolsR, stakingR, nftsR, tokensR] = await Promise.allSettled([
      getJson(endpoints.protocols),
      getJson(endpoints.staking),
      getJson(endpoints.nfts),
      getJson(endpoints.tokens),
    ]);

    // Helper to unwrap results safely
    const pick = <T>(
      r: PromiseSettledResult<T>,
      fallback: T,
      label: string
    ) => {
      if (r.status === "fulfilled") return r.value;
      console.warn(`${label} failed:`, r.reason);
      return fallback;
    };

    const protocols = pick(protocolsR, [], "protocols");
    const staking = pick(stakingR, [], "staking");
    const nfts = pick(nftsR, [], "nfts");
    const tokensData = pick(tokensR, { tokens: [] }, "tokens");

    console.log("protocols --- ", protocols);
    console.log("staking --- ", staking);
    console.log("nfts --- ", nfts);
    console.log("tokensData --- ", tokensData);

    const tokens = (tokensData?.tokens ?? []).map((t: any) => {
      const amount = toUnits(t.balance ?? "0", t.decimals ?? 18);
      const price = t.price ?? 0;
      const usdValue =
        typeof t.usd_value === "number" ? t.usd_value : amount * price;
      const change24hPercent =
        typeof t.price_24h_change === "number" ? t.price_24h_change * 100 : 0;

      return {
        token_address: t.token_address,
        logo: t.logo_url ?? null,
        name: t.name,
        symbol: t.symbol,
        price,
        amount,
        usdValue,
        change24hPercent,
      };
    });

    return {
      protocols,
      staking,
      nfts,
      tokens,
    };
  },
});
