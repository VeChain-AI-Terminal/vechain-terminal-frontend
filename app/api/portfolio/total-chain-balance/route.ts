// app/api/portfolio/total/route.ts
import { NextResponse } from "next/server";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;
const DEBANK_CHAIN_ID = process.env.DEBANK_CHAIN_ID as string;

export interface ChainBalance {
  usd_value: number;
}

async function getChainBalance(address: string): Promise<ChainBalance | null> {
  try {
    const url = `${DEBANK_API_BASE_URL}/user/chain_balance?id=${address}&chain_id=${DEBANK_CHAIN_ID}`;
    const res = await fetch(url, {
      headers: { AccessKey: DEBANK_API_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `Debank chain_balance failed: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const json = (await res.json()) as ChainBalance;
    return json;
  } catch (err) {
    console.error("Error fetching chain balance from Debank:", err);
    return null;
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

  const balance = await getChainBalance(address);
  if (!balance) {
    return NextResponse.json(
      { error: "Failed to fetch total chain balance" },
      { status: 502 }
    );
  }

  // Pass through exactly what Debank returns (e.g., { usd_value: 15.77... })
  return NextResponse.json(balance);
}
