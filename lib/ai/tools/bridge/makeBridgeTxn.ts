import { tool } from "ai";
import z from "zod";
export type BridgeProps = {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  //add more
};

export const makeBridgeTxn = tool({
  description:
    "Create a payload for bridging one tokenIn to another tokenOut via the Molten Swap Router. provide both token addresses.",
  inputSchema: z.object({
    tokenIn: z.string().describe(" contract address for token in"),
    tokenOut: z.string().describe(" contract address for token out"),
    amount: z
      .string()
      .describe("Amount of tokenIn to swap, human-readable (e.g., '25.5')"),
  }),
  execute: async ({ tokenIn, tokenOut, amount }): Promise<BridgeProps> => {
    console.log("Executing makeBridgeTxn with params:", {
      tokenIn,
      tokenOut,
      amount,
    });

    return {
      tokenIn,
      tokenOut,
      amount,
    };
  },
});
