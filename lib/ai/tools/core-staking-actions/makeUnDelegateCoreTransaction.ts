import { ChatMessage } from "@/lib/types";
import { toWei } from "@/lib/utils";
import { UseChatHelpers } from "@ai-sdk/react";
import { tool } from "ai";
import z from "zod";

export interface UnDelegateComponentProps {
  candidateAddress: string;
  candidateName?: string;
  humanReadableValue: string;
  valueInWei: string;
  chainId: number;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

// 1. Unstake (undelegate) CORE
export const makeUnDelegateCoreTransaction = tool({
  description:
    "Create a transaction object to undelegate staked CORE tokens from a candidate. Pass the candidate address, name, value to unstake (in human-readable value) like 1.5 core, and chainId (default is 1116).",
  inputSchema: z.object({
    candidateAddress: z
      .string()
      .describe("The candidate (validator) address to undelegate from"),
    candidateName: z.string().describe("The candidate (validator) name"),
    value: z
      .string()
      .describe(
        "The amount of CORE to undelegate (in human-readable value) like 1.5 core"
      ),
    chainId: z.number().default(1116),
  }),
  execute: async ({ candidateAddress, candidateName, value, chainId }) => {
    const valueInWei = toWei(value);

    const transaction = {
      candidateAddress,
      candidateName,
      humanReadableValue: value,
      valueInWei,
      chainId,
    };

    console.log("transaction in makeUnDelegateCoreTransaction", transaction);
    return transaction;
  },
});
