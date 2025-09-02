import { tool } from "ai";
import z from "zod";

export const makeSendTransaction = tool({
  description:
    "Make a transaction object on the Core blockchain. Pass the receiver,recever ens name if avalaible, sender, amount, and chainId. The chainId is 1116 for the Core blockchain.",
  inputSchema: z.object({
    from: z.string().describe("The sender address"),
    receiver_address: z.string().describe("The receiver address"),
    receiver_ensName: z
      .string()
      .describe("The receiver ens name if available")
      .optional(),
    value: z
      .string()
      .describe(
        "The amount of tokens to send in human readable format eg, 0.5, 3"
      ),
    chainId: z.number().default(1116),
  }),
  execute: async ({
    from,
    receiver_address,
    receiver_ensName,
    value,
    chainId,
  }) => {
    const transaction = {
      from,
      receiver_address,
      receiver_ensName,
      value,
      chainId,
    };

    console.log("transaction in makeSendTransaction", transaction);

    return transaction;
  },
});
