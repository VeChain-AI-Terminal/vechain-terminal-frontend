// app/api/portfolio/tokens/route.ts
import { TransactionHistory } from "@/lib/types/debank";
import { NextResponse } from "next/server";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;
const DEBANK_CHAIN_ID = process.env.DEBANK_CHAIN_ID as string;

async function getTransactionHistory(
  walletAddress: string,
  number_of_items: string
): Promise<TransactionHistory | null> {
  try {
    const url = `${DEBANK_API_BASE_URL}/user/all_history_list?id=${walletAddress}&chain_ids=${DEBANK_CHAIN_ID}&page_count=${number_of_items}`;
    const res = await fetch(url, {
      headers: { AccessKey: DEBANK_API_KEY },
    });

    if (!res.ok) {
      console.error("Debank API error:", res.status, res.statusText);
      return null;
    }

    const txnHistory: TransactionHistory = await res.json();
    console.log("txnHistory", txnHistory);
    return txnHistory;
  } catch (err) {
    console.error("Error fetching token data from Debank:", err);
    return null;
  }
}

export async function GET(req: Request) {
  console.log("fetching transaction history ... ");

  if (!DEBANK_API_BASE_URL || !DEBANK_API_KEY || !DEBANK_CHAIN_ID) {
    return NextResponse.json(
      { error: "Missing environment configuration" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const number_of_items = searchParams.get("number_of_items");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const transactionHistory = await getTransactionHistory(
    address,
    number_of_items || "20"
  );

  if (!transactionHistory) {
    return NextResponse.json(
      { error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }

  return NextResponse.json(transactionHistory);
}
