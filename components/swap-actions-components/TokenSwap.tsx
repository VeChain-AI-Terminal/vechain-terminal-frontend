"use client";

import React, { useMemo, useState } from "react";
import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { encodeFunctionData, formatUnits, parseUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";

// === Constants you likely already have ===
import {
  MOLTEN_QUOTER,
  MOLTEN_SWAP_ROUTER,
  WCORE_TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS,
  USDT_TOKEN_ADDRESS,
  STCORE_TOKEN_ADDRESS,
  ALGEBRA_FACTORY,
} from "@/lib/constants";

// ========================================
// ABIs
// ========================================

const erc20MetaAbi = [
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
];

// Multi-hop router (Algebra Integral / Molten)
export const routerAbi = [
  {
    type: "function",
    name: "exactInput",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "path", type: "bytes" },
          { name: "recipient", type: "address" },
          { name: "deadline", type: "uint256" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "limitSqrtPrice", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "unwrapWNativeToken",
    stateMutability: "payable",
    inputs: [
      { name: "amountMinimum", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
  },
  {
    type: "function",
    name: "multicall",
    stateMutability: "payable",
    inputs: [{ name: "data", type: "bytes[]" }],
  },
] as const;

// QuoterV2 (Algebra Integral): quoteExactInput(bytes,uint256)
// returns (amountOut, amountIn, sqrtPriceX96AfterList[], initializedTicksCrossedList[], gasEstimate, feeList[])
export const quoterV2FullAbi = [
  {
    type: "function",
    name: "quoteExactInput",
    stateMutability: "nonpayable", // not 'view' — call via eth_call
    inputs: [
      { name: "path", type: "bytes" },
      { name: "amountInRequired", type: "uint256" },
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "amountIn", type: "uint256" },
      { name: "sqrtPriceX96AfterList", type: "uint160[]" },
      { name: "initializedTicksCrossedList", type: "uint32[]" },
      { name: "gasEstimate", type: "uint256" },
      { name: "feeList", type: "uint16[]" },
    ],
  },
] as const;

// Minimal (older Quoter-style) fallback: quoteExactInput(bytes,uint256) returns (uint256 amountOut)
export const quoterV1MinAbi = [
  {
    type: "function",
    name: "quoteExactInput",
    stateMutability: "nonpayable",
    inputs: [
      { name: "path", type: "bytes" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
] as const;

// Algebra factory minimal ABI (pool existence checks)
export const algebraFactoryAbi = [
  {
    type: "function",
    name: "poolByPair",
    stateMutability: "view",
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    outputs: [{ name: "pool", type: "address" }],
  },
] as const;

// ========================================
// Chain-specific addresses (Core chain)
// ========================================

// ========================================
// Helpers
// ========================================

const toWcoreIfNative = (addr: `0x${string}`) =>
  addr.toLowerCase() === "0x00" ? (WCORE_TOKEN_ADDRESS as `0x${string}`) : addr;

const sameAddr = (a?: string, b?: string) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

const sortPair = (
  a: `0x${string}`,
  b: `0x${string}`
): [`0x${string}`, `0x${string}`] => (BigInt(a) < BigInt(b) ? [a, b] : [b, a]);

const pairKey = (a: `0x${string}`, b: `0x${string}`) => {
  const [x, y] = sortPair(a, b);
  return `${x.toLowerCase()}_${y.toLowerCase()}`;
};

// Pack addresses for Algebra multi-hop (no fee bytes for dynamic-fee pools)
const encodePath = (addrs: `0x${string}`[]) =>
  ("0x" + addrs.map((a) => a.slice(2)).join("")) as `0x${string}`;

// Curated candidate intermediates; expand or make dynamic later
const CANDIDATE_TOKENS: `0x${string}`[] = [
  WCORE_TOKEN_ADDRESS as `0x${string}`,
  USDC_TOKEN_ADDRESS as `0x${string}`,
  USDT_TOKEN_ADDRESS as `0x${string}`,
  STCORE_TOKEN_ADDRESS as `0x${string}`,
];

const generatePaths = (
  tokenIn0: `0x${string}`,
  tokenOut0: `0x${string}`,
  tokens: `0x${string}`[]
) => {
  const inW = toWcoreIfNative(tokenIn0);
  const outW = toWcoreIfNative(tokenOut0);

  // De-dupe & normalize tokens (lowercase)
  const uniqTokens = Array.from(
    new Set(tokens.map((t) => t.toLowerCase()))
  ) as `0x${string}`[];

  const set = new Set<string>();
  const paths: `0x${string}`[][] = [];

  // Optional safety cap to avoid huge batches
  const MAX_PATHS = 500;

  // --- direct (0 hops)
  if (!sameAddr(inW, outW)) {
    const p = [inW, outW] as `0x${string}`[];
    const key = p.join(">");
    if (!set.has(key)) {
      set.add(key);
      paths.push(p);
    }
  }

  // --- one-hop (1 intermediate)
  for (const mid of uniqTokens) {
    if (sameAddr(mid, inW) || sameAddr(mid, outW)) continue;
    const p = [inW, mid, outW] as `0x${string}`[];
    const key = p.join(">");
    if (!set.has(key)) {
      set.add(key);
      paths.push(p);
      if (paths.length >= MAX_PATHS) break;
    }
  }

  // --- two-hop (2 intermediates)
  outer: for (let i = 0; i < uniqTokens.length; i++) {
    const a = uniqTokens[i];
    if (sameAddr(a, inW) || sameAddr(a, outW)) continue;

    for (let j = 0; j < uniqTokens.length; j++) {
      if (j === i) continue;
      const b = uniqTokens[j];
      if (sameAddr(b, inW) || sameAddr(b, outW)) continue;
      if (sameAddr(a, b)) continue; // already guarded by j!==i, but keep explicit

      const p = [inW, a, b, outW] as `0x${string}`[];
      const key = p.join(">");
      if (!set.has(key)) {
        set.add(key);
        paths.push(p);
        if (paths.length >= MAX_PATHS) break outer;
      }
    }
  }

  console.log("paths --", paths);
  return paths;
};

const pairsFromPaths = (paths: `0x${string}`[][]) => {
  const seen = new Set<string>();
  const pairs: [`0x${string}`, `0x${string}`][] = [];
  for (const p of paths) {
    for (let i = 0; i < p.length - 1; i++) {
      const [a, b] = sortPair(p[i], p[i + 1]);
      const key = pairKey(a, b);
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push([a, b]);
      }
    }
  }
  console.log("all possible pool  --- ", pairs);
  return pairs;
};

// ========================================
// Hook: dynamic multi-hop pathfinding + swap
// ========================================

type UseDynamicSwapArgs = {
  tokenIn: `0x${string}`; // "0x00" sentinel for CORE is allowed
  tokenOut: `0x${string}`; // "0x00" sentinel for CORE is allowed
  amountInWei: bigint;
  slippagePct: string; // e.g. "0.50" for 0.50%
};

export function useDynamicSwap({
  tokenIn,
  tokenOut,
  amountInWei,
  slippagePct,
}: UseDynamicSwapArgs) {
  const { address: from } = useAppKitAccount();

  // Build candidate paths
  const canonicalIn = useMemo(
    () => tokenIn ?? ("0x00" as `0x${string}`),
    [tokenIn]
  );
  const canonicalOut = useMemo(
    () => tokenOut ?? ("0x00" as `0x${string}`),
    [tokenOut]
  );

  const candidatePaths = useMemo(() => {
    if (!tokenIn || !tokenOut || amountInWei <= 0n)
      return [] as `0x${string}`[][];
    return generatePaths(canonicalIn, canonicalOut, CANDIDATE_TOKENS);
  }, [canonicalIn, canonicalOut, amountInWei, tokenIn, tokenOut]);

  // Pool existence pre-checks via factory
  const candidatePairs = useMemo(
    () => pairsFromPaths(candidatePaths),
    [candidatePaths]
  );

  const { data: factoryResults } = useReadContracts({
    contracts: candidatePairs.map(([a, b]) => ({
      address: ALGEBRA_FACTORY,
      abi: algebraFactoryAbi,
      functionName: "poolByPair",
      args: [a, b],
    })),
    query: { enabled: candidatePairs.length > 0 },
  });

  console.log("factory results  --- ", factoryResults);

  const pairHasPool = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!factoryResults || candidatePairs.length === 0) return map;
    for (let i = 0; i < candidatePairs.length; i++) {
      const [a, b] = candidatePairs[i];
      const key = pairKey(a, b);
      const res = factoryResults[i];
      let exists = false;
      if (res?.status === "success" && res.result) {
        const addr =
          (res.result as `0x${string}`) ??
          "0x0000000000000000000000000000000000000000";
        exists = addr !== "0x0000000000000000000000000000000000000000";
      }
      map.set(key, exists);
    }

    console.log("map -- ", map);
    return map;
  }, [factoryResults, candidatePairs]);

  const filteredPaths = useMemo(() => {
    if (candidatePaths.length === 0) return [] as `0x${string}`[][];
    if (!pairHasPool || pairHasPool.size === 0) return [] as `0x${string}`[][];
    return candidatePaths.filter((p) => {
      for (let i = 0; i < p.length - 1; i++) {
        const [a, b] = sortPair(p[i], p[i + 1]);
        const ok = pairHasPool.get(pairKey(a, b));
        if (!ok) return false;
      }
      return true;
    });
  }, [candidatePaths, pairHasPool]);
  console.log("filtered paths --- ", filteredPaths);

  // Build quoter calls: [V2full, V1min] per path
  const quoterCalls = filteredPaths.flatMap((p) => [
    {
      address: MOLTEN_QUOTER as `0x${string}`,
      abi: quoterV2FullAbi,
      functionName: "quoteExactInput",
      args: [encodePath(p), amountInWei], // ensure this is a BigInt
    },
    {
      address: MOLTEN_QUOTER as `0x${string}`,
      abi: quoterV1MinAbi,
      functionName: "quoteExactInput",
      args: [encodePath(p), amountInWei],
    },
  ]);

  const { data: quoteResults } = useReadContracts({
    contracts: quoterCalls,
    allowFailure: true, // <- important so one bad decode doesn’t nuke the batch
    query: { enabled: quoterCalls.length > 0 },
  });

  // Parse results: prefer V2 full; if it failed, fall back to V1 minimal
  const slippageBps = BigInt(Math.floor(parseFloat(slippagePct || "0") * 100));

  type QuoteOut = {
    path: `0x${string}`[];
    expectedOut: bigint;
    minOut: bigint;
    gas?: bigint;
  };

  const bestPathQuote = useMemo(() => {
    if (!quoteResults || quoteResults.length === 0) return null;

    const scored: QuoteOut[] = [];
    for (let i = 0; i < filteredPaths.length; i++) {
      const resV2 = quoteResults[i * 2];
      const resV1 = quoteResults[i * 2 + 1];
      let expectedOut = 0n;
      let gas: bigint | undefined;

      if (resV2?.status === "success" && resV2.result) {
        // V2 tuple: [amountOut, amountIn, sqrtList, ticksList, gasEstimate, feeList]
        const [amountOut, , , , gasEstimate] = resV2.result as [
          bigint,
          bigint,
          bigint[],
          number[],
          bigint,
          number[]
        ];
        expectedOut = amountOut ?? 0n;
        gas = gasEstimate;
      } else if (resV1?.status === "success" && resV1.result) {
        // V1 minimal: amountOut only
        expectedOut = resV1.result as bigint;
      }

      if (expectedOut > 0n) {
        const minOut = (expectedOut * (10000n - slippageBps)) / 10000n;
        scored.push({ path: filteredPaths[i], expectedOut, minOut, gas });
      }
    }

    if (scored.length === 0) return null;
    return scored.reduce((b, c) => (c.minOut > b.minOut ? c : b), scored[0]);
  }, [quoteResults, filteredPaths, slippageBps]);

  const expectedOut = useMemo(
    () => bestPathQuote?.expectedOut ?? null,
    [bestPathQuote]
  );
  const minOut = useMemo(() => bestPathQuote?.minOut ?? 0n, [bestPathQuote]);

  // Allowance (ERC-20 tokenIn only)
  const needsApproval = tokenIn !== "0x00";
  const { data: allowanceRaw } = useReadContract({
    address: tokenIn,
    abi: erc20MetaAbi,
    functionName: "allowance",
    args: from && needsApproval ? [from, MOLTEN_SWAP_ROUTER] : undefined,
    query: { enabled: !!from && needsApproval },
  });
  const allowance = allowanceRaw as bigint | undefined;
  const isApproved =
    !needsApproval || (allowance !== undefined && allowance >= amountInWei);

  // Writers + receipts
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash } = useWriteContract();

  const { isLoading: approving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });
  const {
    isLoading: swapping,
    isSuccess: swapSuccess,
    data: swapReceipt,
  } = useWaitForTransactionReceipt({ hash: swapHash });

  // Actions
  function handleApprove() {
    if (!from || !needsApproval) return;
    writeApprove({
      address: tokenIn,
      abi: erc20MetaAbi,
      functionName: "approve",
      args: [MOLTEN_SWAP_ROUTER, 2n ** 256n - 1n],
    });
  }

  function handleSwap() {
    if (!from || amountInWei <= 0n) return;
    if (!bestPathQuote || bestPathQuote.path.length < 2) {
      console.warn("No valid quoted path found.");
      return;
    }

    const path = bestPathQuote.path;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
    const amountOutMinimum = bestPathQuote.minOut;

    const isCoreIn = tokenIn === "0x00";
    const isCoreOut = tokenOut === "0x00";

    // If output is CORE, we first receive WCORE to router, then unwrap to CORE.
    const recipient = isCoreOut
      ? (MOLTEN_SWAP_ROUTER as `0x${string}`)
      : (from as `0x${string}`);

    const exactInputData = encodeFunctionData({
      abi: routerAbi,
      functionName: "exactInput",
      args: [
        {
          path: encodePath(path),
          recipient,
          deadline,
          amountIn: amountInWei,
          amountOutMinimum,
          limitSqrtPrice: 0n,
        },
      ],
    });
    console.log("path --- ", path);
    console.log("encodePath(path) --- ", encodePath(path));

    // Case A: ERC20 -> CORE (exactInput then unwrap)
    if (!isCoreIn && isCoreOut) {
      const unwrapData = encodeFunctionData({
        abi: routerAbi,
        functionName: "unwrapWNativeToken",
        args: [amountOutMinimum, from as `0x${string}`],
      });

      // exactInput + unwrap via multicall
      writeSwap({
        address: MOLTEN_SWAP_ROUTER,
        abi: routerAbi,
        functionName: "multicall",
        args: [[exactInputData, unwrapData]],
      });
      return;
    }

    // Case B: CORE -> ERC20 (send native value; router wraps WCORE internally if supported)
    if (isCoreIn && !isCoreOut) {
      writeSwap({
        address: MOLTEN_SWAP_ROUTER,
        abi: routerAbi,
        functionName: "multicall",
        args: [[exactInputData]],
        value: amountInWei, // send CORE in
      });
      return;
    }

    // Case C: ERC20 -> ERC20
    writeSwap({
      address: MOLTEN_SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[exactInputData]],
      ...(isCoreIn ? { value: amountInWei } : {}), // CORE->CORE rare, but safe
    });
  }

  return {
    from,
    candidatePaths,
    filteredPaths,
    expectedOut,
    minOut,
    isApproved,
    approving,
    approveSuccess,
    swapping,
    swapSuccess,
    swapReceipt,
    handleApprove,
    handleSwap,
  };
}

// ========================================
// Example UI usage (wire to your screen/buttons)
// ========================================

type SwapWidgetProps = {
  tokenIn: `0x${string}`; // allow "0x00" for CORE
  tokenOut: `0x${string}`; // allow "0x00" for CORE
  amount: string;
  slippagePct: string; // e.g. "0.50"
};

export default function TokenSwap({
  tokenIn,
  tokenOut,
  amount,
  slippagePct,
}: SwapWidgetProps) {
  const { address: from } = useAppKitAccount();
  const [slippage, setSlippage] = useState("0.5");

  // --- Metadata for tokenIn and tokenOut
  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: tokenIn !== "0x00" ? tokenIn : WCORE_TOKEN_ADDRESS, // Check if tokenIn is "CORE"
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: tokenIn !== "0x00" ? tokenIn : WCORE_TOKEN_ADDRESS, // Check if tokenIn is "CORE"
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
      {
        address: tokenOut !== "0x00" ? tokenOut : WCORE_TOKEN_ADDRESS, // Check if tokenOut is "CORE"
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: tokenOut !== "0x00" ? tokenOut : WCORE_TOKEN_ADDRESS, // Check if tokenOut is "CORE"
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
    ],
    query: { enabled: !!tokenIn && !!tokenOut },
  });

  const decimalsIn = useMemo(() => {
    if (tokenIn === "0x00") {
      return 18; // If it's the native token (CORE), return 18 decimals
    }
    return typeof metaData?.[0]?.result === "number" ? metaData[0].result : 18; // Ensure it's a valid number or fallback to 18
  }, [metaData, tokenIn]);

  const symbolIn = useMemo(() => {
    if (tokenIn === "0x00") {
      return "CORE"; // If it's the native token (CORE), set symbol to "CORE"
    }
    return typeof metaData?.[1]?.result === "string" ? metaData[1].result : ""; // Ensure it's a valid string or fallback to an empty string
  }, [metaData, tokenIn]);

  const decimalsOut = useMemo(() => {
    if (tokenOut === "0x00") {
      return 18; // If it's the native token (CORE), return 18 decimals
    }
    return typeof metaData?.[2]?.result === "number" ? metaData[2].result : 18; // Ensure it's a valid number or fallback to 18
  }, [metaData, tokenOut]);

  const symbolOut = useMemo(() => {
    if (tokenOut === "0x00") {
      return "CORE"; // If it's the native token (CORE), set symbol to "CORE"
    }
    return typeof metaData?.[3]?.result === "string" ? metaData[3].result : ""; // Ensure it's a valid string or fallback to an empty string
  }, [metaData, tokenOut]);

  const amountInWei = amount ? parseUnits(amount, decimalsIn) : 0n;
  const {
    expectedOut,
    minOut,
    isApproved,
    approving,
    swapping,
    handleApprove,
    handleSwap,
    filteredPaths,
  } = useDynamicSwap({ tokenIn, tokenOut, amountInWei, slippagePct });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm opacity-80">
        Paths considered: {filteredPaths.length}
      </div>

      <div className="text-sm">
        Expected out:{" "}
        {expectedOut ? formatUnits(expectedOut, decimalsOut) : "—"}
      </div>
      <div className="text-sm">
        Min out (after slippage): {formatUnits(minOut, decimalsOut)}
      </div>

      {!isApproved ? (
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={handleApprove}
          disabled={approving}
        >
          {approving ? "Approving..." : "Approve"}
        </button>
      ) : (
        <button
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          onClick={handleSwap}
          disabled={swapping || filteredPaths.length === 0}
        >
          {swapping ? "Swapping..." : "Swap"}
        </button>
      )}
    </div>
  );
}
