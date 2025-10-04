import type { NextRequest } from "next/server";
import { getChatsByUserId } from "@/lib/db/queries";
import { authenticateWallet } from "@/lib/auth/wallet-auth";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const startingAfter = searchParams.get("starting_after");
  const endingBefore = searchParams.get("ending_before");

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      "bad_request:api",
      "Only one of starting_after or ending_before can be provided."
    ).toResponse();
  }

  // Get wallet address from query params or headers
  const walletAddress = searchParams.get("wallet_address") || request.headers.get('x-wallet-address');
  
  if (!walletAddress) {
    return new ChatSDKError(
      "unauthorized:api", 
      "Wallet address is required. Please connect your wallet."
    ).toResponse();
  }

  try {
    // Authenticate wallet and get/create user
    const user = await authenticateWallet(walletAddress);
    
    const chats = await getChatsByUserId({
      id: user.id,
      limit,
      startingAfter,
      endingBefore,
    });

    return Response.json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new ChatSDKError(
      "bad_request:database",
      "Failed to fetch chat history"
    ).toResponse();
  }
}
