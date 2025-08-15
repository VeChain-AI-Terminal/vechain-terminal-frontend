// supply-core.ts
import {
  COLEND_POOL_ADDRESS,
  COLEND_WrappedTokenGatewayV3,
} from "@/lib/constants";
import { toWei } from "@/lib/utils";
import { tool } from "ai";
import z from "zod";

export type ColendSupplyCoreTxProps = {
  method: "depositETH";
  gatewayAddress: string;
  poolAddress: string;
  referralCode: number;
  amountInWei: string;
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

    const amountInWei = toWei(value);

    const tx: ColendSupplyCoreTxProps = {
      method: "depositETH",
      gatewayAddress: COLEND_WrappedTokenGatewayV3,
      poolAddress: COLEND_POOL_ADDRESS,
      referralCode: 0,
      amountInWei,
    };

    return tx;
  },
});
