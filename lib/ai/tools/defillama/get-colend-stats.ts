import { tool } from "ai";
import z from "zod";

const API_URL = "https://yields.llama.fi/pools";

export const getColendStats = tool({
  description:
    "Fetch Colend protocol defi stats like tvlUsd, apy, apyReward, etc., filtered for Core chain and sorted by APY (highest first).",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const res = await fetch(API_URL, { method: "GET" });
      if (!res.ok) {
        return { status: "error", data: [], error: `HTTP ${res.status}` };
      }

      const json = await res.json();

      const filtered = Array.isArray(json?.data)
        ? json.data
            .filter(
              (item: any) =>
                typeof item?.chain === "string" &&
                item.chain.toLowerCase() === "core"
            )
            .sort((a: any, b: any) => (b.apy ?? 0) - (a.apy ?? 0))
        : [];

      console.log("filtered & sorted colend stats ----- ", filtered);

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
