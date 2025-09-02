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

    const [protocolsRes, stakingRes, nftsRes, tokensRes] = await Promise.all([
      fetch(`${baseUrl}/api/portfolio/protocols?address=${walletAddress}`),
      fetch(`${baseUrl}/api/portfolio/staking?address=${walletAddress}`),
      fetch(`${baseUrl}/api/portfolio/nfts?address=${walletAddress}`),
      fetch(`${baseUrl}/api/portfolio/tokens?address=${walletAddress}`),
    ]);

    const [protocols, staking, nfts, tokensData] = await Promise.all([
      protocolsRes.json(),
      stakingRes.json(),
      nftsRes.json(),
      tokensRes.json(),
    ]);

    console.log("protocols --- ", protocols);
    console.log("staking --- ", staking);
    console.log("nfts --- ", nfts);
    console.log("tokensData --- ", tokensData);

    // Clean tokens
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

    console.log("toksnssss -", tokens);

    return {
      protocols,
      staking,
      nfts,
      tokens,
    };
  },
});
