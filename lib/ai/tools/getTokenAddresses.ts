import {
  WCORE_TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS,
  USDT_TOKEN_ADDRESS,
  SOLVBTC_B_ADDRESS,
  SOLVBTC_M_ADDRESS,
  SOLVBTC_C_ADDRESS,
  STCORE_TOKEN_ADDRESS,
  DUALCORE_TOKEN_ADDRESS,
} from "@/lib/constants";
import { tool } from "ai";
import { z } from "zod";

export const getTokenAddresses = tool({
  description: "Get all the ERC20 token addresses on the Core blockchain.",
  inputSchema: z.object({}),
  execute: async () => {
    const tokenAddressList = [
      { name: "CORE", address: "0x00" },

      { name: "WCORE", address: WCORE_TOKEN_ADDRESS },
      { name: "USDC", address: USDC_TOKEN_ADDRESS },
      { name: "USDT", address: USDT_TOKEN_ADDRESS },
      { name: "SolvBTC.b", address: SOLVBTC_B_ADDRESS },
      { name: "SolvBTC.m", address: SOLVBTC_M_ADDRESS },
      { name: "SolvBTC.c", address: SOLVBTC_C_ADDRESS },
      { name: "stCORE", address: STCORE_TOKEN_ADDRESS },
      { name: "dualCORE", address: DUALCORE_TOKEN_ADDRESS },
    ];

    console.log("Returning Core token address list:", tokenAddressList);
    return tokenAddressList;
  },
});
