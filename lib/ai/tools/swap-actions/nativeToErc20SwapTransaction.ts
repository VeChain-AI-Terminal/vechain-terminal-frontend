// nativeToErc20SwapTransaction.ts
import { tool } from "ai";
import z from "zod";

export type NativeToErc20SwapTxProps = {
  stage: "native-to-erc20-swap";
  tokenOut: string;
  amount: string; // human-readable CORE amount (e.g. "1.25")
};

export const nativeToErc20SwapTransaction = tool({
  description:
    "Create a payload for swapping native CORE into an ERC20 token using Molten's swap router. User must provide tokenOut address and amount.",
  inputSchema: z.object({
    tokenOut: z
      .string()
      .describe("ERC20 contract address for the token to receive"),
    amount: z
      .string()
      .describe("Amount of CORE to swap, human-readable (e.g., '3.5')"),
  }),
  execute: async ({ tokenOut, amount }): Promise<NativeToErc20SwapTxProps> => {
    console.log("Executing nativeToErc20SwapTransaction with params:", {
      tokenOut,
      amount,
    });

    return {
      stage: "native-to-erc20-swap",
      tokenOut,
      amount,
    };
  },
});
