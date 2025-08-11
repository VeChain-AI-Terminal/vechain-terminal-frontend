import { toWei } from "@/lib/utils";
import { tool } from "ai";
import z from "zod";

export type TransferStakedCoreTransactionProps = {
  sourceCandidateAddress: string;
  sourceCandidateName: string;
  targetCandidateAddress: string;
  targetCandidateName: string;
  valueInWei: string;
  chainId: number;
};

export const makeTransferStakedCoreTransaction = tool({
  description:
    "Create a transaction object to transfer staked CORE tokens from one validator to another. Pass the source and target candidate addresses, names, value to transfer (in human-readable value) like 1.5 core, and chainId (default is 1116).",
  inputSchema: z.object({
    sourceCandidateAddress: z
      .string()
      .describe("The current validator (source) address"),
    sourceCandidateName: z
      .string()
      .describe("The current validator (source) name"),
    targetCandidateAddress: z
      .string()
      .describe("The new validator (target) address"),
    targetCandidateName: z.string().describe("The new validator (target) name"),
    value: z
      .string()
      .describe(
        "The amount of CORE to transfer (in human-readable value) like 1.5 core"
      ),
    chainId: z.number().default(1116),
  }),
  execute: async ({
    sourceCandidateAddress,
    sourceCandidateName,
    targetCandidateAddress,
    targetCandidateName,
    value,
    chainId,
  }) => {
    const valueInWei = toWei(value);
    const transaction = {
      sourceCandidateAddress,
      sourceCandidateName,
      targetCandidateAddress,
      targetCandidateName,
      valueInWei,
      chainId,
    };

    console.log(
      "transaction in makeTransferStakedCoreTransaction",
      transaction
    );
    return transaction;
  },
});
