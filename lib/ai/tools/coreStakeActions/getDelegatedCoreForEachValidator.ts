import { tool } from "ai";
import { z } from "zod";
import { formatEther } from "viem";

type ApiRecord = {
  operatorAddressHash: string;
  operatorAddress?: {
    candidateName?: string | null;
  };
  coinPower: string; // wei
  apr: string;
  coinStatus: boolean;
  commission: number; // validator commission rate in %
};

export const getDelegatedCoreForEachValidator = tool({
  description:
    "Fetches a wallet's active CORE staking positions, listing each validator the wallet has delegated to along with the staked amount (in CORE), validator name, APR, commission, active status, plus the wallet's total CORE staked.",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("wallet address of the wallet to fetch staking data for."),
  }),
  execute: async ({ walletAddress }: { walletAddress: string }) => {
    const addressHash = walletAddress.toLowerCase();

    const res = await fetch(
      "https://stake.coredao.org/api/staking/search_delegator",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pageNum: 1,
          pageSize: "100",
          addressHash,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Core staking API error: HTTP ${res.status}`);
    }

    const json = await res.json();

    if (json?.code !== "00000") {
      throw new Error(
        `Core staking API responded with code ${json?.code}: ${
          json?.message || "unknown error"
        }`
      );
    }

    const records: ApiRecord[] = json?.data?.records ?? [];

    const perValidator = records
      .filter((r) => {
        try {
          return BigInt(r.coinPower || "0") > 0n;
        } catch {
          return false;
        }
      })
      .map((r) => ({
        validator: r.operatorAddressHash,
        validatorName: r.operatorAddress?.candidateName || null,
        stakeCORE: formatEther(BigInt(r.coinPower)), // human-readable CORE
        coreRewardRate: `${parseFloat(r.apr).toFixed(2)}%`, // formatted APR
        commission: `${r.commission}%`, // commission in %
        coinStatus: Boolean(r.coinStatus),
      }));

    const totalWei = records.reduce(
      (sum, r) => sum + BigInt(r.coinPower || "0"),
      0n
    );
    const totalCORE = formatEther(totalWei); // human-readable total CORE

    return { perValidator, totalCORE };
  },
});
