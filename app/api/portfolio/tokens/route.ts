// app/api/portfolio/tokens/route.ts
import { NextResponse } from "next/server";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;
const DEBANK_CHAIN_ID = process.env.DEBANK_CHAIN_ID as string;

export interface TokenData {
  token_address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo_url?: string | null;
  balance: string; // raw_amount as string
  price?: number;
  price_24h_change?: number | null;
  total_supply?: number;
  usd_value?: number;
}

async function getTokensData(walletAddress: string): Promise<TokenData[]> {
  try {
    const url = `${DEBANK_API_BASE_URL}/user/token_list?id=${walletAddress}&chain_id=${DEBANK_CHAIN_ID}&is_all=true`;
    const res = await fetch(url, {
      headers: { AccessKey: DEBANK_API_KEY },
    });

    const rawTokens = await res.json();
    console.log("rawtokens", rawTokens);
    if (!rawTokens || rawTokens.length === 0) {
      return [];
    }

    return rawTokens.map((t: any) => ({
      token_address: t.id,
      name: t.name,
      symbol: t.symbol,
      decimals: t.decimals,
      logo_url: t.logo_url,
      balance: String(t.raw_amount ?? "0"),
      price: t.price,
      price_24h_change: t.price_24h_change,
      total_supply: t.total_supply,
      usd_value: (t.amount ?? 0) * (t.price ?? 0),
    }));
  } catch (err) {
    console.error("Error fetching token data from Debank:", err);
    return [];
  }
}

export async function GET(req: Request) {
  if (!DEBANK_API_BASE_URL || !DEBANK_API_KEY || !DEBANK_CHAIN_ID) {
    return NextResponse.json(
      { error: "Missing environment configuration" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const tokens = await getTokensData(address);
  return NextResponse.json({ tokens });
}
