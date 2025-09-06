// supply-core.ts
import {
  COLEND_POOL_ADDRESS,
  COLEND_WrappedTokenGatewayV3,
} from "@/lib/constants";
import { ChatMessage } from "@/lib/types";
import { UseChatHelpers } from "@ai-sdk/react";
import { tool } from "ai";
import z from "zod";

export type ColendSupplyCoreTxProps = {
  method: "depositETH";
  gatewayAddress: string;
  poolAddress: string;
  referralCode: number;
  value: string;
};

export type ColendSupplyCoreProps = {
  tx: ColendSupplyCoreTxProps;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export const colendSupplyCore = tool({
  description:
    "Create a Colend supply CORE supply payload (depositETH -> aCoreWCORE). Input: human-readable CORE amount (e.g., '1.0').",
  inputSchema: z.object({
    value: z
      .string()
      .describe("Amount of CORE to supply, human-readable (e.g., '1.5')"),
  }),
  execute: async ({ value }): Promise<ColendSupplyCoreTxProps> => {
    console.log("Executing supplyCore with params:", { value });

    const tx: ColendSupplyCoreTxProps = {
      method: "depositETH",
      gatewayAddress: COLEND_WrappedTokenGatewayV3,
      poolAddress: COLEND_POOL_ADDRESS,
      referralCode: 0,
      value,
    };

    return tx;
  },
});
