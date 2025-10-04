import type { NextRequest } from "next/server";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { authenticateWallet } from "@/lib/auth/wallet-auth";
import { ChatSDKError } from "@/lib/errors";
import { convertToUIMessages } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = request.nextUrl;
  const walletAddress = searchParams.get("wallet_address") || request.headers.get('x-wallet-address');
  
  if (!walletAddress) {
    return new ChatSDKError(
      "unauthorized:api",
      "Wallet address is required. Please connect your wallet."
    ).toResponse();
  }

  try {
    const { id } = await params;
    
    // Get chat
    const chat = await getChatById({ id });
    if (!chat) {
      return new ChatSDKError("not_found:api", "Chat not found").toResponse();
    }

    // Authenticate wallet and get/create user
    const user = await authenticateWallet(walletAddress);

    // Check permissions for private chats
    if (chat.visibility === "private" && chat.userId !== user.id) {
      return new ChatSDKError("forbidden:chat", "Access denied").toResponse();
    }

    // Get messages
    const messagesFromDb = await getMessagesByChatId({ id });
    const messages = convertToUIMessages(messagesFromDb);

    return Response.json({
      ...chat,
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return new ChatSDKError(
      "bad_request:database",
      "Failed to fetch chat"
    ).toResponse();
  }
}