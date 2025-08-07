import { tool } from "ai"; // Import tool utility
import { z } from "zod"; // Assuming you are using zod for schema validation

type ValidatorInput = {
  operatorAddress: {
    candidateName: string | null;
    hash: string;
  };
  status: number;
  active: boolean;
  coinPower: string;
  coinRate: string;
  nextRoundHashCnt: string;
  hashPowerRate: string;
  btcPower: string;
  btcPowerRate: string;
  commission: number;
  proportion: string;
  apr: string;
  btcStakeApr: string;
};

type ValidatorSummary = {
  name: string;
  operatorAddress: string;
  status: "Active" | "Inactive";
  state: "Normal" | "Unknown";
  stakedCORE: string;
  stakedCOREPercent: string;
  stakedHash: string;
  stakedHashPercent: string;
  delegatedBTC: string;
  delegatedBTCPercent: string;
  commission: string;
  hybridScore: string;
  coreRewardRate: string;
  btcRewardRate: string;
};

export const getValidators = tool({
  description: "Get the active validators with their staking and reward info",
  inputSchema: z.object({}),
  execute: async () => {
    // API URL and POST body
    const apiUrl =
      "https://stake.coredao.org/api/staking/search_candidate_page";
    const requestBody = {
      pageNum: 1,
      pageSize: 50,
    };

    // Make the POST request to the API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the response data
    const data = await response.json();

    // Extract and filter the active validators
    const activeValidators: ValidatorSummary[] =
      data?.data?.records
        ?.filter((v: ValidatorInput) => v.active) // Filter for active validators
        .map((v: ValidatorInput) => {
          const formatMillions = (numStr: string) => {
            const num = parseFloat(numStr) / 1e18;
            return `${(num / 1_000_000).toFixed(2)}M`;
          };

          const name = v.operatorAddress?.candidateName || "Unknown";
          const operatorAddress = v.operatorAddress?.hash || "Unknown";
          const status = v.active ? "Active" : "Inactive";
          const state = v.status === 17 ? "Normal" : "Unknown";
          const stakedCORE = formatMillions(v.coinPower);
          const stakedCOREPercent = `${parseFloat(v.coinRate).toFixed(2)}%`;
          const stakedHash = v.nextRoundHashCnt || "0";
          const stakedHashPercent = `${parseFloat(v.hashPowerRate).toFixed(
            2
          )}%`;
          const delegatedBTC = `${parseFloat(
            v.btcPower || "0"
          ).toLocaleString()}`;
          const delegatedBTCPercent = `${parseFloat(v.btcPowerRate).toFixed(
            2
          )}%`;
          const commission = `${(v.commission / 10).toFixed(2)}%`;
          const hybridScore = `${parseFloat(v.proportion).toFixed(2)}%`;
          const coreRewardRate = `${parseFloat(v.apr).toFixed(2)}%`;
          const btcRewardRate = `${parseFloat(v.btcStakeApr).toFixed(2)}%`;

          return {
            name,
            operatorAddress,
            status,
            state,
            stakedCORE,
            stakedCOREPercent,
            stakedHash,
            stakedHashPercent,
            delegatedBTC,
            delegatedBTCPercent,
            commission,
            hybridScore,
            coreRewardRate,
            btcRewardRate,
          };
        }) || [];

    return {
      validators: activeValidators,
    };
  },
});
