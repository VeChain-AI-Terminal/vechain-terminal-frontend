import { toWei } from "@/lib/utils";
import { tool } from "ai";
import z from "zod";

export type StakeComponentProps = {
  candidateAddress: string; // validator operator address
  candidateName: string; // validator operator address
  valueInWei: string; // amount in wei or decimal CORE string
  chainId: number;
};

export const makeStakeCoreTransaction = tool({
  description:
    "Make a transaction object on the Core blockchain. Pass the receiver,recever ens name if avalaible, sender, amount (in human-readable value) like 1.5 core, and chainId. The chainId is 1116 for the Core blockchain.",
  inputSchema: z.object({
    candidateAddress: z.string().describe("The candidate (validator) address"),
    candidateName: z.string().describe("the candidate (validator) name"),
    value: z
      .string()
      .describe(
        "The amount of token to stake (in human-readable value) like 1.5 core"
      ),
    chainId: z.number().default(1116),
  }),
  execute: async ({ candidateAddress, candidateName, value, chainId }) => {
    const valueInWei = toWei(value);

    const transaction = {
      candidateAddress,
      candidateName,
      valueInWei,
      chainId,
    };

    console.log("transaction in makeStakeCoreTransaction", transaction);

    return transaction;
  },
});
