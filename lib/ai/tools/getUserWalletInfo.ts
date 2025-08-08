import { tool } from "ai";
import z from "zod";
import { auth } from "@/app/(auth)/auth";

export const getUserWalletInfo = tool({
  description: "Get the user's wallet info like address and chainId",
  inputSchema: z.object({}),
  execute: async () => {
    const session = await auth();
    if (!session?.user) {
      return {
        error: "User not authenticated",
      };
    }

    console.log("session", session);

    return {
      address: session.address,
      chainId: session.chainId,
    };
  },
});
