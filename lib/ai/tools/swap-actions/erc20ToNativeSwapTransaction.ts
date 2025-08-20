// erc20ToNativeSwapTransaction.ts
import { tool } from "ai";
import z from "zod";

export type Erc20ToNativeSwapTxProps = {
  stage: "erc20-to-native-swap";
  tokenIn: string;
  amount: string; // human-readable amount, e.g. "12.5"
};

export const erc20ToNativeSwapTransaction = tool({
  description:
    "Create a payload for swapping an ERC20 token into native CORE using Molten's swap router. you must provide token address and amount.",
  inputSchema: z.object({
    tokenIn: z
      .string()
      .describe("ERC20 contract address for the token to swap from"),
    amount: z
      .string()
      .describe("Amount of token to swap, human-readable (e.g., '15.2')"),
  }),
  execute: async ({ tokenIn, amount }): Promise<Erc20ToNativeSwapTxProps> => {
    console.log("Executing erc20ToNativeSwapTransaction with params:", {
      tokenIn,
      amount,
    });

    return {
      stage: "erc20-to-native-swap",
      tokenIn,
      amount,
    };
  },
});
