import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "./actions";
import { isProductionEnvironment } from "@/lib/constants";
import { myProvider } from "@/lib/ai/providers";
// import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { geolocation } from "@vercel/functions";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { after } from "next/server";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import type { ChatModel } from "@/lib/ai/models";
import type { VisibilityType } from "@/components/visibility-selector";

// Import all VeChain tools from index
import * as vTools from "@/lib/ai/tools";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel["id"];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    // Get wallet address from request body or headers
    const walletAddress = requestBody.walletAddress || request.headers.get('x-wallet-address');
    
    if (!walletAddress) {
      return new ChatSDKError(
        "unauthorized:api",
        "Wallet address is required. Please connect your wallet."
      ).toResponse();
    }

    // Get or create user
    let user;
    try {
      const { authenticateWallet } = await import("@/lib/auth/wallet-auth");
      user = await authenticateWallet(walletAddress);
    } catch (error) {
      console.error("Failed to authenticate wallet:", error);
      return new ChatSDKError(
        "unauthorized:api",
        "Failed to authenticate wallet"
      ).toResponse();
    }

    const messageCount = await getMessageCountByUserId({
      id: user.id,
      differenceInHours: 24,
    });

    // if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
    //   return new ChatSDKError("rate_limit:chat").toResponse();
    // }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: JSON.stringify(message.parts),
          attachments: JSON.stringify([]),
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        // Debug the tools object
        console.log("vTools keys:", Object.keys(vTools));
        console.log("First few tools:", Object.keys(vTools).slice(0, 3).map(key => ({
          key,
          hasDescription: !!(vTools as any)[key]?.description,
          hasInputSchema: !!(vTools as any)[key]?.inputSchema,
          hasExecute: !!(vTools as any)[key]?.execute,
        })));

        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel, walletAddress }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(20),//bridge can be long

          toolChoice: "auto",
          experimental_activeTools:
            selectedChatModel === "chat-model-reasoning"
              ? []
              : (Object.keys(vTools) as Array<keyof typeof vTools>),
          experimental_transform: smoothStream({ chunking: "word" }),
          tools: vTools,
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: JSON.stringify(message.parts),
            createdAt: new Date(),
            attachments: JSON.stringify((message as any).attachments || []),
            chatId: id,
          })),
        });
      },
      onError: (e) => {
        console.log("error in chat route", e);
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream())
        )
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    } else {
      console.error("Unexpected error:", error);
      return new ChatSDKError("bad_request:database", "Internal server error").toResponse();
    }
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const walletAddress = searchParams.get("wallet_address") || request.headers.get('x-wallet-address');

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  if (!walletAddress) {
    return new ChatSDKError(
      "unauthorized:api",
      "Wallet address is required. Please connect your wallet."
    ).toResponse();
  }

  try {
    // Get user from wallet address
    const { authenticateWallet } = await import("@/lib/auth/wallet-auth");
    const user = await authenticateWallet(walletAddress);

    const chat = await getChatById({ id });

    if (!chat) {
      return new ChatSDKError("not_found:api", "Chat not found").toResponse();
    }

    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    const deletedChat = await deleteChatById({ id });

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat"
    ).toResponse();
  }
}
