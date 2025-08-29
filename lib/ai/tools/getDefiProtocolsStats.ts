import { tool } from "ai";
import { z } from "zod";

// ------------------- Types -------------------

// Core DAO
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
  stakedCORE: string;
  stakedBTC: string;
  coreRewardRate: string;
  btcRewardRate: string;
  hybridScore: string;
  coreScoreEfficiency: string;
  realtimeDeltaCORE_M: string;
  realtimeDeltaCOREPct: string;
};

// Colend
type ColendPoolRaw = {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apyReward: number;
  apy: number;
  pool: string;
  apyPct1D: number;
  apyPct7D: number;
  apyPct30D: number;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  predictions: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
  underlyingTokens: string[];
  [key: string]: any;
};

type ColendPoolSummary = {
  symbol: string;
  chain: string;
  project: string;
  tvlUsd: number;
  apy: number;
  apyReward: number;
};

// DeSyn
type DesynPoolRaw = {
  pool: string;
  controller: string;
  pool_name: string;
  net_value: number;
  net_value_per_share: number;
  net_value_change_ratio_by_period: number;
  APY: number;
  symbol: string;
  invest_label: string;
  strategy_token_label: string;
  risk_label: string;
  [key: string]: any;
};

type DesynPoolSummary = {
  pool: string;
  pool_name: string;
  symbol: string;
  net_value: number;
  net_value_per_share: number;
  net_value_change_ratio_by_period: number;
  APY: number;
  invest_label: string;
  strategy_token_label: string;
  risk_label: string;
};

// ------------------- Helpers -------------------
const toCore = (weiStr: string) => Number(weiStr || "0") / 1e18;
const toMillions = (core: number) => `${(core / 1_000_000).toFixed(2)}M`;
const pct = (x: number) => `${x.toFixed(2)}%`;
const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

const summarizeColend = (raw: ColendPoolRaw[]): ColendPoolSummary[] =>
  raw.map((p) => ({
    symbol: p.symbol,
    chain: p.chain,
    project: p.project,
    tvlUsd: p.tvlUsd,
    apy: p.apy,
    apyReward: p.apyReward,
  }));

const summarizeDesyn = (raw: DesynPoolRaw[]): DesynPoolSummary[] =>
  raw.map((p) => ({
    pool: p.pool,
    pool_name: p.pool_name,
    symbol: p.symbol,
    net_value: p.net_value,
    net_value_per_share: p.net_value_per_share,
    net_value_change_ratio_by_period: p.net_value_change_ratio_by_period,
    APY: p.APY,
    invest_label: p.invest_label,
    strategy_token_label: p.strategy_token_label,
    risk_label: p.risk_label,
  }));

// ------------------- API URLs -------------------
const VALIDATORS_API =
  "https://staking-api.coredao.org/staking/status/validators";
const COLEND_API = "https://yields.llama.fi/pools";
const DESYN_API =
  "https://api.desyn.io/core/etf/stats?offset=0&num=10&period=DAY&sortby=BY_NET_VALUE&desc=true&etype=&invest_label=&risk_label=&pay_token=&strategy_type=&strategy_token_label=&etf_status=-1&pool_name=";

// ------------------- Tool -------------------
export const getDefiProtocolsStats = tool({
  description:
    "Fetch validator stats from Core DAO, Colend protocol, and DeSyn protocol (raw + summary).",
  inputSchema: z.object({}),
  execute: async () => {
    console.log("Fetching DeFi stats (Core DAO + Colend + DeSyn)...");

    // --- Core DAO Validators ---
    let coreRaw: ValidatorResponse[] = [];
    let coreSummary: ValidatorSummary[] = [];
    try {
      const res = await fetch(VALIDATORS_API);
      if (res.ok) {
        const data = await res.json();
        coreRaw = data?.data?.validatorsList || [];

        coreSummary =
          coreRaw
            .filter((v) => v.status === 17)
            .map((v) => {
              const coreAmt = toCore(v.stakedCoreAmount || "0");
              const coreScore = toCore(v.stakedCoreScore || "0");
              const rtCoreAmt = toCore(v.realtimeCoreAmount || "0");

              const scoreEff = safeDiv(coreScore, coreAmt);
              const deltaCore = rtCoreAmt - coreAmt;
              const deltaPct = safeDiv(deltaCore, coreAmt) * 100;

              return {
                name: v.name || "Unknown",
                operatorAddress: v.operatorAddress || "Unknown",
                stakedCORE: toMillions(coreAmt),
                stakedBTC: Number(v.stakedBTCAmount || "0").toLocaleString(),
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

    // --- Colend Pools ---
    let colendRaw: ColendPoolRaw[] = [];
    let colendSummary: ColendPoolSummary[] = [];
    try {
      const res = await fetch(COLEND_API);
      if (res.ok) {
        const json = await res.json();
        colendRaw = Array.isArray(json?.data)
          ? json.data.filter(
              (item: any) =>
                item.chain?.toLowerCase() === "core" &&
                item.project === "colend-protocol"
            )
          : [];
        colendSummary = summarizeColend(colendRaw);
      }
    } catch (err) {
      console.error("Error fetching Colend stats:", err);
    }

    // --- DeSyn Pools ---
    let desynRaw: DesynPoolRaw[] = [];
    let desynSummary: DesynPoolSummary[] = [];
    try {
      const res = await fetch(DESYN_API);
      if (res.ok) {
        const json = await res.json();
        desynRaw = json?.data?.items || [];
        desynSummary = summarizeDesyn(desynRaw);
      }
    } catch (err) {
      console.error("Error fetching DeSyn stats:", err);
    }

    // console.log("res from colend --- ", colendSummary);
    // console.log("res from desyn --- ", desynSummary);
    // --- Return unified ---
    return {
      results: [
        {
          protocol: "core-dao",
          raw: { validators: coreRaw },
          summary: { validators: coreSummary },
        },
        {
          protocol: "colend",
          raw: { pools: colendRaw },
          summary: { pools: colendSummary },
        },
        {
          protocol: "desyn",
          raw: { pools: desynRaw },
          summary: { pools: desynSummary },
        },
      ],
    };
  },
});
