// erc20ToErc20SwapTransaction.ts
import { tool } from "ai";
import z from "zod";

export type Erc20ToErc20SwapTxProps = {
  stage: "erc20-to-erc20-swap";
  tokenIn: string;
  tokenOut: string;
  amount: string;
};

export const erc20ToErc20SwapTransaction = tool({
  description:
    "Create a payload for swapping ERC20 tokenIn to tokenOut via the Molten Swap Router. User must provide both token addresses.",
  inputSchema: z.object({
    tokenIn: z.string().describe("ERC20 contract address for token in"),
    tokenOut: z.string().describe("ERC20 contract address for token out"),
    amount: z
      .string()
      .describe("Amount of ERC20 to swap, human-readable (e.g., '25.5')"),
  }),
  execute: async ({
    tokenIn,
    tokenOut,
    amount,
  }): Promise<Erc20ToErc20SwapTxProps> => {
    console.log("Executing erc20ToErc20SwapTransaction with params:", {
      tokenIn,
      tokenOut,
      amount,
    });

    return {
      stage: "erc20-to-erc20-swap",
      tokenIn,
      tokenOut,
      amount,
    };
  },
});
