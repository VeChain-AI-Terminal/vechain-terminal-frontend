import { tool } from "ai";
import z from "zod";

export const makeStakeTransaction = tool({
  description:
    "Make a transaction object on the Core blockchain. Pass the receiver,recever ens name if avalaible, sender, amount, and chainId. The chainId is 1116 for the Core blockchain.",
  inputSchema: z.object({
    candidate: z.string().describe("The candidate (validator) address"),
    value: z.string().describe("The amount of token to stake in wei"),
    chainId: z.number().default(1116),
  }),
  execute: async ({ candidate, value, chainId }) => {
    const transaction = {
      candidate,
      value,
      chainId,
    };

    console.log("transaction in makeStakeTransaction", transaction);

    return transaction;
  },
});
