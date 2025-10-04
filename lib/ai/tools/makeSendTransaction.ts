import { tool } from "ai";
import z from "zod";

export const makeSendTransaction = tool({
  description:
    "Make a VeChain transaction object. Pass the receiver, receiver ens name if available, sender, amount, and network. Use 'main' for mainnet or 'test' for testnet.",
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
        "The amount of VET to send in human readable format eg, 0.5, 3"
      ),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({
    from,
    receiver_address,
    receiver_ensName,
    value,
    network,
  }) => {
    // Convert human readable value to wei (18 decimals for VET)
    const valueInWei = (parseFloat(value) * Math.pow(10, 18)).toString();
    
    // VeChain transaction uses clauses format
    const transaction = {
      from,
      receiver_address,
      receiver_ensName,
      value: valueInWei,
      network,
      clauses: [
        {
          to: receiver_address,
          value: valueInWei,
          data: "0x", // empty data for simple VET transfer
        }
      ],
    };

    console.log("VeChain transaction in makeSendTransaction", transaction);

    return transaction;
  },
});
