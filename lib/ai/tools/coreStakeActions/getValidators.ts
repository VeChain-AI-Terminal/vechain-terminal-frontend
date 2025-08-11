import { tool } from "ai";
import { z } from "zod";

type ValidatorResponse = {
  name: string;
  operatorAddress: string;
  status: number;
  stakedCoreAmount: string;
  stakedBTCAmount: string;
  stakedHashAmount: string;
  stakedCoreScore: string; // added
  realtimeCoreAmount: string; // added
  estimatedCoreRewardRate: string;
  estimatedBTCRewardRate: string;
  hybridScore: string;
};

type ValidatorSummary = {
  name: string;
  operatorAddress: string;
  status: "Active" | "Inactive";
  state: "Normal" | "Unknown";
  stakedCORE: string; // in M CORE, e.g. "12.34M"
  stakedBTC: string;
  stakedHash: string;
  coreRewardRate: string; // e.g. "5.70%"
  btcRewardRate: string; // e.g. "4.14%"
  hybridScore: string;

  // New decision stats
  coreScoreEfficiency: string; // e.g. "1.00x"
  realtimeDeltaCORE_M: string; // e.g. "+0.25M"
  realtimeDeltaCOREPct: string; // e.g. "+2.10%"
};

export const getValidators = tool({
  description:
    "Get the active validators with their staking and decision stats",
  inputSchema: z.object({}),
  execute: async () => {
    console.log("fething validaotrs summary ...");
    const apiUrl = "https://staking-api.coredao.org/staking/status/validators";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const toCore = (weiStr: string) => {
      const n = Number(weiStr || "0");
      return n / 1e18;
    };

    const toMillions = (core: number) => `${(core / 1_000_000).toFixed(2)}M`;

    const pct = (x: number) => `${x.toFixed(2)}%`;

    const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

    const activeValidators: ValidatorSummary[] =
      data?.data?.validatorsList
        ?.filter((v: ValidatorResponse) => v.status === 17) // Normal
        .map((v: ValidatorResponse) => {
          const coreAmt = toCore(v.stakedCoreAmount || "0");
          const coreScore = toCore(v.stakedCoreScore || "0");
          const rtCoreAmt = toCore(v.realtimeCoreAmount || "0");

          const scoreEff = safeDiv(coreScore, coreAmt); // ratio
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
            coreRewardRate: pct(Number(v.estimatedCoreRewardRate || "0") * 100),
            btcRewardRate: pct(Number(v.estimatedBTCRewardRate || "0") * 100),
            hybridScore: Number(v.hybridScore || "0").toLocaleString(),

            coreScoreEfficiency: `${scoreEff.toFixed(2)}x`,
            realtimeDeltaCORE_M: `${deltaCore >= 0 ? "+" : ""}${(
              deltaCore / 1_000_000
            ).toFixed(2)}M`,
            realtimeDeltaCOREPct: `${deltaPct >= 0 ? "+" : ""}${pct(deltaPct)}`,
          };
        }) || [];

    return { validators: activeValidators };
  },
});
