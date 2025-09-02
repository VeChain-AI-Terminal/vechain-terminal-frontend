// tokenSwapTransaction.ts
import { tool } from "ai";
import z from "zod";

export type TokenSwapProps = {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  slippage: string;
};

export const tokenSwapTransaction = tool({
  description:
    "Create a payload for swapping one tokenIn to another tokenOut via the Molten Swap Router. provide both token addresses.",
  inputSchema: z.object({
    tokenIn: z.string().describe(" contract address for token in"),
    tokenOut: z.string().describe(" contract address for token out"),
    amount: z
      .string()
      .describe("Amount of tokenIn to swap, human-readable (e.g., '25.5')"),
    slippage: z.string().describe("Maximum allowed slippage"),
  }),
  execute: async ({
    tokenIn,
    tokenOut,
    amount,
    slippage,
  }): Promise<TokenSwapProps> => {
    console.log("Executing tokenSwapTransaction with params:", {
      tokenIn,
      tokenOut,
      amount,
      slippage,
    });

    return {
      tokenIn,
      tokenOut,
      amount,
      slippage,
    };
  },
});
