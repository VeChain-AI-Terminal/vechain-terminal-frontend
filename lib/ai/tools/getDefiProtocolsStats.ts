import { tool } from "ai";
import { z } from "zod";

type ValidatorResponse = {
  name: string;
  operatorAddress: string;
  status: number;
  stakedCoreAmount: string;
  stakedBTCAmount: string;
  stakedHashAmount: string;
  stakedCoreScore: string;
  realtimeCoreAmount: string;
  estimatedCoreRewardRate: string;
  estimatedBTCRewardRate: string;
  hybridScore: string;
};

type ValidatorSummary = {
  name: string;
  operatorAddress: string;
  status: "Active" | "Inactive";
  state: "Normal" | "Unknown";
  stakedCORE: string;
  stakedBTC: string;
  stakedHash: string;
  coreRewardRate: string;
  btcRewardRate: string;
  hybridScore: string;
  coreScoreEfficiency: string;
  realtimeDeltaCORE_M: string;
  realtimeDeltaCOREPct: string;
};

const VALIDATORS_API =
  "https://staking-api.coredao.org/staking/status/validators";
const COLEND_API = "https://yields.llama.fi/pools";

export const getDefiProtocolsStats = tool({
  description:
    "Fetch validator stats from Core DAO and DeFi stats from Colend protocol",
  inputSchema: z.object({}),
  execute: async () => {
    console.log("Fetching DeFi stats (validators + colend)...");

    // --- helpers ---
    const toCore = (weiStr: string) => Number(weiStr || "0") / 1e18;
    const toMillions = (core: number) => `${(core / 1_000_000).toFixed(2)}M`;
    const pct = (x: number) => `${x.toFixed(2)}%`;
    const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

    // --- Core DAO validators ---
    let coreDaoValidators: ValidatorSummary[] = [];
    try {
      const res = await fetch(VALIDATORS_API, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        coreDaoValidators =
          data?.data?.validatorsList
            ?.filter((v: ValidatorResponse) => v.status === 17)
            .map((v: ValidatorResponse) => {
              const coreAmt = toCore(v.stakedCoreAmount || "0");
              const coreScore = toCore(v.stakedCoreScore || "0");
              const rtCoreAmt = toCore(v.realtimeCoreAmount || "0");

              const scoreEff = safeDiv(coreScore, coreAmt);
              const deltaCore = rtCoreAmt - coreAmt;
              const deltaPct = safeDiv(deltaCore, coreAmt) * 100;

              return {
                name: v.name || "Unknown",
                operatorAddress: v.operatorAddress || "Unknown",
                status: v.status === 17 ? "Active" : "Inactive",
                state: v.status === 17 ? "Normal" : "Unknown",
                stakedCORE: toMillions(coreAmt),
                stakedBTC: Number(v.stakedBTCAmount || "0").toLocaleString(),
                stakedHash: v.stakedHashAmount || "0",
                coreRewardRate: pct(
                  Number(v.estimatedCoreRewardRate || "0") * 100
                ),
                btcRewardRate: pct(
                  Number(v.estimatedBTCRewardRate || "0") * 100
                ),
                hybridScore: Number(v.hybridScore || "0").toLocaleString(),
                coreScoreEfficiency: `${scoreEff.toFixed(2)}x`,
                realtimeDeltaCORE_M: `${deltaCore >= 0 ? "+" : ""}${(
                  deltaCore / 1_000_000
                ).toFixed(2)}M`,
                realtimeDeltaCOREPct: `${deltaPct >= 0 ? "+" : ""}${pct(
                  deltaPct
                )}`,
              };
            }) || [];
      }
    } catch (err) {
      console.error("Error fetching Core validators:", err);
    }

    // --- Colend stats ---
    let colendData: any[] = [];
    try {
      const res = await fetch(COLEND_API, { method: "GET" });
      if (res.ok) {
        const json = await res.json();
        colendData = Array.isArray(json?.data)
          ? json.data
              .filter(
                (item: any) =>
                  typeof item?.chain === "string" &&
                  item.chain.toLowerCase() === "core" &&
                  item.project === "colend-protocol"
              )
              .sort((a: any, b: any) => {
                const apyDiff = (b.apy ?? 0) - (a.apy ?? 0);
                if (apyDiff !== 0) return apyDiff;
                return (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0);
              })
          : [];
      }
    } catch (err) {
      console.error("Error fetching Colend stats:", err);
    }

    return {
      results: [
        {
          protocol: "core-dao",
          stats: { coreDaoValidators },
        },
        {
          protocol: "colend",
          stats: { pools: colendData },
        },
      ],
    };
  },
});
