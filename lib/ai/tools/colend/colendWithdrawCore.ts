// colendWithdrawCore.ts
import {
  COLEND_POOL_ADDRESS,
  COLEND_WrappedTokenGatewayV3,
} from "@/lib/constants";
import { ChatMessage } from "@/lib/types";
import { toWei } from "@/lib/utils";
import { UseChatHelpers } from "@ai-sdk/react";
import { tool } from "ai";
import z from "zod";

export type ColendWithdrawCoreTxProps = {
  method: "withdrawETH";
  gatewayAddress: string;
  poolAddress: string;
  amount: string; //human readable
};

export type colendWithdrawCoreProps = {
  tx: ColendWithdrawCoreTxProps;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export const colendWithdrawCore = tool({
  description:
    "Create a Colend withdraw CORE payload (withdrawETH -> unWrap aCoreWCORE back to CORE). Input: human-readable CORE amount (e.g., '1.0').",
  inputSchema: z.object({
    value: z
      .string()
      .describe("Amount of CORE to withdraw, human-readable (e.g., '1.5')"),
  }),
  execute: async ({ value }): Promise<ColendWithdrawCoreTxProps> => {
    console.log("Executing colendWithdrawCore with params:", { value });

    return {
      method: "withdrawETH",
      gatewayAddress: COLEND_WrappedTokenGatewayV3,
      poolAddress: COLEND_POOL_ADDRESS,
      amount: value,
    };
  },
});
