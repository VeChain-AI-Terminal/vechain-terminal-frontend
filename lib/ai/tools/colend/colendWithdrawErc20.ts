// colendWithdrawErc20.ts
import { tool } from "ai";
import z from "zod";

export type ColendWithdrawErc20TxProps = {
  stage: "erc20-withdraw";
  withdraw: {
    method: "withdraw";
    contractAddress: string; // withdraw contract
    tokenAddress: string; // ERC20 asset
    tokenName: string;
    amount: string; // human-readable amount
  };
};

export const colendWithdrawErc20 = tool({
  description:
    "Create a Colend ERC20 withdraw payload. Calls withdraw(asset, amount, to) on the pool contract.",
  inputSchema: z.object({
    value: z
      .string()
      .describe("Amount of ERC20 to withdraw, human-readable (e.g., '1.0')"),
    tokenAddress: z
      .string()
      .describe("ERC20 token contract address you want to withdraw"),
    tokenName: z.string().describe("Display name for the token "),
  }),
  execute: async ({
    value,
    tokenAddress,
    tokenName,
  }): Promise<ColendWithdrawErc20TxProps> => {
    console.log("Executing colendWithdrawErc20 with params:", {
      value,
      tokenAddress,
      tokenName,
    });

    return {
      stage: "erc20-withdraw",
      withdraw: {
        method: "withdraw",
        contractAddress: "0x0CEa9F0F49F30d376390e480ba32f903B43B19C5",
        tokenAddress,
        tokenName,
        amount: value,
      },
    };
  },
});
