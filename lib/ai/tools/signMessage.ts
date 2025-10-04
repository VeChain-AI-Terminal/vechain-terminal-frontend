import { tool } from "ai";
import z from "zod";

export const signMessage = tool({
  description:
    "Sign a message with the user's VeChain wallet. Returns signature for verification.",
  inputSchema: z.object({
    message: z.string().describe("The message to sign"),
    messageType: z.enum(["text", "typedData"]).default("text").describe("Type of message to sign"),
    // For typed data (EIP-712)
    domain: z.object({
      name: z.string(),
      version: z.string(),
      chainId: z.number().optional(),
    }).optional().describe("Domain for EIP-712 typed data"),
    types: z.record(z.array(z.object({
      name: z.string(),
      type: z.string(),
    }))).optional().describe("Types for EIP-712 typed data"),
    primaryType: z.string().optional().describe("Primary type for EIP-712 typed data"),
  }),
  execute: async ({
    message,
    messageType,
    domain,
    types,
    primaryType,
  }) => {
    // This tool creates the signing request that will be handled by the frontend
    if (messageType === "typedData") {
      if (!domain || !types || !primaryType) {
        throw new Error("Domain, types, and primaryType are required for typed data signing");
      }

      const typedData = {
        domain,
        types,
        message: typeof message === 'string' ? JSON.parse(message) : message,
        primaryType,
      };

      return {
        messageType: "typedData",
        typedData,
        purpose: "Sign typed data for verification",
        action: "sign_typed_data",
        note: "This will open your wallet to sign structured data",
      };
    }

    // Simple text message signing
    return {
      messageType: "text",
      message,
      purpose: "Sign message for verification",
      action: "sign_message",
      note: "This will open your wallet to sign the message",
    };
  },
});