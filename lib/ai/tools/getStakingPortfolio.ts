import { tool } from "ai";
import { z } from "zod";

type RawSummary = {
  stakedCoreAmount: string;
  stakedHashAmount: string;
  stakedBTCAmount: string;
  pendingCoreReward: string;
  pendingHashReward: string;
  pendingBTCReward: string;
  claimedCoreReward: string;
  claimedHashReward: string;
  claimedBTCReward: string;
};

type CleanedSummary = {
  address: string;
  stakedCORE: string; // 18 decimals -> string
  stakedHash: string; // 18 decimals -> string
  stakedBTC: string; // 18 decimals -> string (per your note)
  pendingCOREReward: string; // 18 decimals -> string
  pendingHashReward: string; // 18 decimals -> string
  pendingBTCReward: string; // 18 decimals -> string
  claimedCOREReward: string; // 18 decimals -> string
  claimedHashReward: string; // 18 decimals -> string
  claimedBTCReward: string; // 18 decimals -> string
  // convenience totals
  totalPendingReward: string; // core+hash+btc (human units)
  totalClaimedReward: string; // core+hash+btc (human units)
};

/**
 * Convert a big integer string with `decimals` to a human string without losing precision.
 * Example: toUnit("2000000000000000000", 18) -> "2"
 */
const toUnit = (value: string | undefined, decimals = 18): string => {
  const v = (value ?? "0").replace(/^0+/, "") || "0";
  if (v === "0") return "0";
  if (decimals === 0) return v;

  const pad = Math.max(decimals - v.length + 1, 0);
  const whole = v.length > decimals ? v.slice(0, v.length - decimals) : "0";
  const frac =
    (pad ? "0".repeat(pad) : "") +
    (v.length > decimals ? v.slice(v.length - decimals) : v);

  // remove trailing zeros in fractional part
  const fracTrimmed = frac.replace(/0+$/, "");
  return fracTrimmed ? `${whole}.${fracTrimmed}` : whole;
};

const addStrNums = (a: string, b: string): string => {
  // add two decimal strings safely
  const [ai, af = ""] = a.split(".");
  const [bi, bf = ""] = b.split(".");
  const maxF = Math.max(af.length, bf.length);
  const A = ai + (af + "0".repeat(maxF - af.length));
  const B = bi + (bf + "0".repeat(maxF - bf.length));

  // big integer string add
  let carry = 0,
    res = "";
  for (
    let i = A.length - 1, j = B.length - 1;
    i >= 0 || j >= 0 || carry;
    i--, j--
  ) {
    const da = i >= 0 ? Number(A[i]) : 0;
    const db = j >= 0 ? Number(B[j]) : 0;
    const sum = da + db + carry;
    res = String(sum % 10) + res;
    carry = Math.floor(sum / 10);
  }
  // insert decimal point
  if (maxF > 0) {
    const head = res.slice(0, res.length - maxF) || "0";
    let tail = res.slice(res.length - maxF);
    tail = tail.replace(/0+$/, "");
    return tail ? `${head}.${tail}` : head;
  }
  return res;
};

export const getStakingPortfolio = tool({
  description:
    "Get CoreDAO staking portfolio summary for a wallet address and return cleaned human-readable values",
  inputSchema: z.object({
    address: z.string().describe("address of the wallet"),
  }),
  execute: async ({ address }) => {
    try {
      // The API expects the address as a query param (?address=0x...)
      const url = new URL(
        "https://staking-api.coredao.org/staking/summary/core"
      );
      url.searchParams.set("coreAddress", address);

      const apiKey = process.env.CORE_SCAN_API_KEY;
      if (!apiKey) {
        return {
          message: "something went wrong fetching staking portfolio",
          error: "api key missing",
        };
      }
      url.searchParams.set("apikey", apiKey);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "follow",
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const json = (await res.json()) as {
        data: RawSummary;
        message: string;
      };
      console.log("json --- ", json);

      const d = json?.data ?? ({} as RawSummary);

      // convert all 18-decimal fields to human strings
      const stakedCORE = toUnit(d.stakedCoreAmount, 18);
      const stakedHash = toUnit(d.stakedHashAmount, 18);
      const stakedBTC = toUnit(d.stakedBTCAmount, 18); // per your note: decimal = 18

      const pendingCOREReward = toUnit(d.pendingCoreReward, 18);
      const pendingHashReward = toUnit(d.pendingHashReward, 18);
      const pendingBTCReward = toUnit(d.pendingBTCReward, 18);

      const claimedCOREReward = toUnit(d.claimedCoreReward, 18);
      const claimedHashReward = toUnit(d.claimedHashReward, 18);
      const claimedBTCReward = toUnit(d.claimedBTCReward, 18);

      const totalPendingReward = addStrNums(
        addStrNums(pendingCOREReward, pendingHashReward),
        pendingBTCReward
      );
      const totalClaimedReward = addStrNums(
        addStrNums(claimedCOREReward, claimedHashReward),
        claimedBTCReward
      );

      const cleaned: CleanedSummary = {
        address,
        stakedCORE,
        stakedHash,
        stakedBTC,
        pendingCOREReward,
        pendingHashReward,
        pendingBTCReward,
        claimedCOREReward,
        claimedHashReward,
        claimedBTCReward,
        totalPendingReward,
        totalClaimedReward,
      };
      console.log("cleaned staking data -----  ", cleaned);

      return { message: json.message, summary: cleaned };
    } catch (err: any) {
      throw new Error(
        `Failed to fetch staking summary: ${err?.message ?? String(err)}`
      );
    }
  },
});
