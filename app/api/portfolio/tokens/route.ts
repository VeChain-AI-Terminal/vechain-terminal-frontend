// app/api/portfolio/tokens/route.ts
import { CHAIN_ID } from "@/lib/constants";
import { toUnits } from "@/lib/utils/to-units";
import { NextResponse } from "next/server";

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
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
  price_data?: TokenPriceData;
}

export interface TokenData extends RawTokenData {
  balanceHuman: number;
}

async function getTokensData(walletAddress: string): Promise<TokenData[]> {
  try {
    const url = `https://api.thirdweb.com/v1/wallets/${walletAddress}/tokens?chainId=${CHAIN_ID}&limit=20&page=1`;
    const res = await fetch(url, {
      headers: { "x-secret-key": process.env.THIRDWEB_SECRET_KEY as string },
      cache: "no-store",
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
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address)
    return NextResponse.json({ error: "Missing address" }, { status: 400 });

  const tokens = await getTokensData(address);
  return NextResponse.json({ tokens });
}
