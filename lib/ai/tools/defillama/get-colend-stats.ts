import { tool } from "ai";
import z from "zod";

const API_URL = "https://yields.llama.fi/pools"; // replace with the real endpoint

export const getColendStats = tool({
  description:
    "Fetch Colend protocol defi stats like tvlUsd, apy, apyReward, etc.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const res = await fetch(API_URL, { method: "GET" });
      if (!res.ok) {
        return { status: "error", data: [], error: `HTTP ${res.status}` };
      }

      const json = await res.json();

      const filtered = Array.isArray(json?.data)
        ? json.data.filter(
            (item: any) =>
              typeof item?.chain === "string" &&
              item.chain.toLowerCase() === "core"
          )
        : [];

      console.log("filtered colend stats ----- ", filtered);

      return {
        status: json?.status ?? "success",
        data: filtered,
      };
    } catch (err: any) {
      return {
        status: "error",
        data: [],
        error: err?.message ?? "Unknown error",
      };
    }
  },
});
