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

export const getClaimedAndPendingRewards = tool({
  description:
    "Fetches claimed and pending CORE, BTC, and Hash rewards for a given wallet from the CoreDAO staking API, enriched with validator names and stats, converting CORE values from wei to human-readable format.",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("Wallet address of the wallet to fetch rewards stats for."),
  }),

  execute: async ({ walletAddress }) => {
    const rewardsUrl = `https://staking-api.coredao.org/staking/rewards/detail?coreAddress=${walletAddress}`;
    const validatorsUrl =
      "https://staking-api.coredao.org/staking/status/validators";

    const toCore = (weiStr: string) => Number(weiStr || "0") / 1e18;
    const toMillions = (core: number) => `${(core / 1_000_000).toFixed(2)}M`;
    const pct = (x: number) => `${x.toFixed(2)}%`;
    const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

    try {
      // Fetch rewards and validators in parallel
      const [rewardsRes, validatorsRes] = await Promise.all([
        fetch(rewardsUrl),
        fetch(validatorsUrl),
      ]);

      if (!rewardsRes.ok) {
        throw new Error(
          `Rewards API request failed with status ${rewardsRes.status}`
        );
      }
      if (!validatorsRes.ok) {
        throw new Error(
          `Validators API request failed with status ${validatorsRes.status}`
        );
      }

      const rewardsJson = await rewardsRes.json();
      const validatorsJson = await validatorsRes.json();

      if (rewardsJson.code !== "00000" || !rewardsJson.data) {
        throw new Error(
          `Unexpected Rewards API response: ${JSON.stringify(
            rewardsJson,
            null,
            2
          )}`
        );
      }

      const rewardsData = rewardsJson.data;

      // --- Transform Validators ---
      const validatorMap: Record<string, ValidatorSummary> = {};
      (validatorsJson?.data?.validatorsList || []).forEach(
        (v: ValidatorResponse) => {
          const coreAmt = toCore(v.stakedCoreAmount || "0");
          const coreScore = toCore(v.stakedCoreScore || "0");
          const rtCoreAmt = toCore(v.realtimeCoreAmount || "0");

          const scoreEff = safeDiv(coreScore, coreAmt);
          const deltaCore = rtCoreAmt - coreAmt;
          const deltaPct = safeDiv(deltaCore, coreAmt) * 100;

          validatorMap[v.operatorAddress.toLowerCase()] = {
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
        }
      );

      // --- Enrich rewards with validator names ---
      const enrichWithValidator = (list: any[], type: "claimed" | "pending") =>
        list.map((item) => {
          const val = validatorMap[item.candidateAddress.toLowerCase()];
          return {
            candidateAddress: item.candidateAddress,
            validatorName: val?.name || "Unknown",
            ...(type === "claimed"
              ? {
                  claimedCORE: toCore(item.claimedCoreReward),
                  claimedBTC: item.claimedBTCReward,
                  claimedHash: item.claimedHashReward,
                }
              : {
                  pendingCORE: toCore(item.pendingCoreReward),
                  pendingBTC: item.pendingBTCReward,
                  pendingHash: item.pendingHashReward,
                }),
            validatorStats: val || null,
          };
        });

      console.log(
        "claimed rewareds : ",
        enrichWithValidator(rewardsData.claimedRewardList || [], "claimed")
      );
      return {
        summary: {
          totalClaimedCORE: toCore(rewardsData.claimedCoreReward),
          totalClaimedBTC: rewardsData.claimedBTCReward,
          totalClaimedHash: rewardsData.claimedHashReward,
          totalPendingCORE: toCore(rewardsData.pendingCoreReward),
          totalPendingBTC: rewardsData.pendingBTCReward,
          totalPendingHash: rewardsData.pendingHashReward,
        },
        claimedRewards: enrichWithValidator(
          rewardsData.claimedRewardList || [],
          "claimed"
        ),
        pendingRewards: enrichWithValidator(
          rewardsData.pendingRewardList || [],
          "pending"
        ),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch rewards/validators: ${error.message}`);
    }
  },
});
