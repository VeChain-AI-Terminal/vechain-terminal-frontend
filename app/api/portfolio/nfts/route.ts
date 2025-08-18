// app/api/portfolio/nfts/route.ts
import { NextResponse } from "next/server";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;
const DEBANK_CHAIN_ID = process.env.DEBANK_CHAIN_ID as string;

export interface NFTItem {
  id: string;
  contract_id: string;
  inner_id: string;
  chain: string;
  name: string | null;
  description: string | null;
  content_type: string | null;
  content: string;
  thumbnail_url: string;
  total_supply: number;
  detail_url: string | null;
  attributes: any[];
  collection_id: string;
  is_core: boolean;
  credit_score: number;
  collection_name: string;
  contract_name: string;
  is_erc721: boolean;
  amount: number;
}

async function getNFTs(address: string): Promise<NFTItem[] | null> {
  try {
    const url = `${DEBANK_API_BASE_URL}/user/nft_list?id=${address}&chain_id=${DEBANK_CHAIN_ID}`;
    const res = await fetch(url, {
      headers: { AccessKey: DEBANK_API_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Debank nft_list failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = (await res.json()) as NFTItem[];
    return json;
  } catch (err) {
    console.error("Error fetching nft_list from Debank:", err);
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

  const nfts = await getNFTs(address);
  if (!nfts) {
    return NextResponse.json(
      { error: "Failed to fetch NFTs" },
      { status: 502 }
    );
  }

  return NextResponse.json(nfts);
}
