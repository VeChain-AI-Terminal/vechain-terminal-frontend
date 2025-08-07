import { tool } from "ai";
import z from "zod";

export const makeTransaction = tool({
  description:
    "Make a transaction object on the Core blockchain. Pass the receiver, sender, amount, and chainId. The chainId is 1116 for the Core blockchain.",
  inputSchema: z.object({
    from: z.string().describe("The sender address"),
    to: z.string().describe("The receiver address"),
    value: z.string().describe("The amount of tokens to send in wei"),
    chainId: z.number().default(1116),
  }),
  execute: async ({ from, to, value, chainId }) => {
    const transaction = {
      from,
      to,
      value,
      chainId,
    };

    console.log("transaction in makeTransaction", transaction);

    return transaction;
  },
});
