// tokenSwapTransaction.ts
import { tool } from "ai";
import { isAddress } from "viem";
import z from "zod";

export type TokenSwapProps = {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  slippage: string;
};
const floorToDecimals = (value: string, dp = 3): string => {
  const num = Number(value) || 0;
  const factor = 10 ** dp;
  const floored = Math.floor(num * factor) / factor;
  return floored.toFixed(dp); // keep trailing zeros if needed
};

export const tokenSwapTransaction = tool({
  description:
    "Create a payload for swapping one tokenIn to another tokenOut via the Molten Swap Router. provide both token addresses. never give the token symbol, always give token address.",
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
    const floored3 = floorToDecimals(amount);
    console.log("Executing tokenSwapTransaction with params:", {
      tokenIn,
      tokenOut,
      floored3,
      slippage,
    });

    // Check if tokenIn or tokenOut are valid addresses or symbols
    if (!isAddress(tokenIn)) {
      if (tokenIn === "CORE") {
        tokenIn = "0x0000000000000000000000000000000000000000"; // Convert CORE to its address
      } else {
        throw new Error("tokenIn must be a valid address, not a symbol.");
      }
    }

    if (!isAddress(tokenOut)) {
      throw new Error("tokenOut must be a valid address, not a symbol.");
    }

    return {
      tokenIn,
      tokenOut,
      amount: floored3,
      slippage,
    };
  },
});
