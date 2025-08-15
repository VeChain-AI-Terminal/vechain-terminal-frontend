// app/api/portfolio/nfts/route.ts
import { CHAIN_ID } from "@/lib/constants";
import { NextResponse } from "next/server";

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

async function getNftsData(walletAddress: string): Promise<NFTData[]> {
  try {
    const url = `https://api.thirdweb.com/v1/wallets/${walletAddress}/nfts?chainId=${CHAIN_ID}&limit=20&page=1`;
    const res = await fetch(url, {
      headers: { "x-secret-key": process.env.THIRDWEB_SECRET_KEY as string },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`NFT fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const json = (await res.json()) as any;
    return (json?.result?.nfts ?? []) as NFTData[];
  } catch (err) {
    console.error("Error fetching NFT data:", err);
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address)
    return NextResponse.json({ error: "Missing address" }, { status: 400 });

  const nfts = await getNftsData(address);
  return NextResponse.json({ nfts });
}
