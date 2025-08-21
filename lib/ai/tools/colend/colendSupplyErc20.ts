// colend-supply-erc20.ts
import { COLEND_POOL_ADDRESS } from "@/lib/constants";
import { tool } from "ai";
import z from "zod";

export type ColendSupplyErc20Approval = {
  method: "approve";
  tokenAddress: string; // ERC20 contract to call approve on
  spender: string; // pool address
  amount: string; // MAX_UINT256 for unlimited
};

export type ColendSupplyErc20Supply = {
  method: "supply";
  poolAddress: string; // pool to call supply on
  tokenAddress: string; // ERC20 asset
  tokenName: string;
  amount: string; // human-readable amount (component converts using decimals)
  referralCode: number; // 0
};

export type ColendSupplyErc20TxProps = {
  stage: "erc20-approval-and-supply";
  approval: ColendSupplyErc20Approval;
  supply: ColendSupplyErc20Supply;
};

const MAX_UINT256 =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const colendSupplyErc20 = tool({
  description:
    "Create a two-stage Colend ERC20 supply payload: (1) approve unlimited allowance to the pool, (2) supply the token to the pool. Input: human-readable amount, token address, token name.",
  inputSchema: z.object({
    value: z
      .string()
      .describe("Amount of ERC20 to supply, human-readable (e.g., '25.5')"),
    tokenAddress: z.string().describe("ERC20 token contract address to supply"),
    tokenName: z
      .string()
      .describe("Display name for the token (e.g., 'stCORE')"),
  }),
  execute: async ({
    value,
    tokenAddress,
    tokenName,
  }): Promise<ColendSupplyErc20TxProps> => {
    console.log("Executing colendSupplyErc20 with params:", {
      value,
      tokenAddress,
      tokenName,
    });

    // Component will:
    // 1) fetch decimals via ERC20.decimals()
    // 2) convert `value` -> base units
    // 3) call approve(tokenAddress, spender=pool, amount=MAX_UINT256)
    // 4) call pool.supply(tokenAddress, amountInUnits, onBehalfOf=sender, referralCode=0)

    return {
      stage: "erc20-approval-and-supply",
      approval: {
        method: "approve",
        tokenAddress,
        spender: COLEND_POOL_ADDRESS,
        amount: MAX_UINT256,
      },
      supply: {
        method: "supply",
        poolAddress: COLEND_POOL_ADDRESS,
        tokenAddress,
        tokenName,
        amount: value, // human-readable; convert using decimals before sending
        referralCode: 0,
      },
    };
  },
});
