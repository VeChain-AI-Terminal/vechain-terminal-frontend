import { CHAIN_ID } from "@/lib/constants";
import { tool } from "ai";
import z from "zod";

export type ChainContext = {
  chainId: number;
  chainName: string;
};

export const getChainContext = tool({
  description: "Get the context of the chain",
  inputSchema: z.object({}),
  execute: async () => {
    const chainId = CHAIN_ID;
    const chainName = "Core Mainnet";
    return {
      chainId,
      chainName,
    };
  },
});
