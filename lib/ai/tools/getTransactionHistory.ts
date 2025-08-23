import { tool } from "ai";
import { z } from "zod";

export const getTransactionHistory = tool({
  description: "Get the recent transaction history of an address",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("wallet address of the wallet to fetch portfolio for."),
    number_of_items: z
      .string()
      .describe("number of transacitons to fetch. Maximum is 20"),
  }),
  execute: async ({ walletAddress, number_of_items }) => {
    console.log(
      "getting-- ",
      number_of_items,
      "-- transaction history for wallet ",
      walletAddress
    );
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(
      `${baseUrl}/api/transaction-history?address=${walletAddress}&number_of_items=${number_of_items}`
    );

    const txnHistory = await res.json();

    // Format time_at fields
    const formatted = {
      ...txnHistory,
      history_list: txnHistory.history_list.map((tx: any) => ({
        ...tx,
        time_at_human: new Date(tx.time_at * 1000).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      })),
    };

    console.log("txnHistory formatted --- ", formatted);

    return {
      txnHistory: formatted,
    };
  },
});
