import { tool } from "ai";
import { z } from "zod"; // For schema validation

// Define the ContextFilter type
export type ContextFilter = {
  chains?: number[];
  walletAddresses?: string[];
  contractAddresses?: string[];
};

export const coreDaoTool = tool({
  description:
    "Get answers for generic questions about the Core blockchain, search contracts, and handle web searches",
  inputSchema: z.object({
    message: z.string().describe("query"),

    contextFilter: z
      .object({
        chains: z.array(z.number()).optional(),
        walletAddresses: z.array(z.string()).optional(),
        contractAddresses: z.array(z.string()).optional(),
      })
      .optional(),
  }),
  execute: async ({ message, contextFilter }) => {
    console.log("calling core dao tool");
    // Chain ID for Core Mainnet (always 1116)
    const chainId = "1116"; // Convert chain ID to string

    // Prepare the context
    const messages = [
      {
        role: "user",
        content: message, // User's question
      },
    ];

    // ✅ Convert messages array into a single string
    let messagesString = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    //add the core blockchain context to message
    messagesString =
      messagesString +
      "\nkeep the answers related to core blockchain, chain id is 1116. ";

    console.log("messagesString", messagesString);
    // Prepare the context filter (if provided)
    const body = {
      message: messagesString,
      execute_config: {
        mode: "client",
      },
      sessionId: Date.now().toString(), // Example session ID
      stream: false,
      context_filter: {
        chain_ids: [chainId], // Always set to 1116 (Core Mainnet)
        contract_addresses: contextFilter?.contractAddresses || [],
      },
    };

    // Call the Nebula API
    try {
      const response = await fetch("https://nebula-api.thirdweb.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": process.env.THIRDWEB_SECRET_KEY!,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("send API error:", errorText);
        return {
          error: "send API returned an error",
          details: errorText,
        };
      }

      const data = await response.json();
      console.log("core dao tool response", data);

      return {
        response: data,
      };
    } catch (error) {
      console.error("Error calling Core DAO API:", error);
      return {
        error: "There was an issue with the Core DAO API request.",
      };
    }
  },
});
