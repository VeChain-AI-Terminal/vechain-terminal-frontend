"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import Link from "next/link";
import { CheckCircleFillIcon } from "@/components/icons";
import { FaSpinner } from "react-icons/fa";
import { ArrowRightCircle } from "lucide-react";
import { toast } from "sonner";
import { UseChatHelpers } from "@ai-sdk/react";
import { ChatMessage } from "@/lib/types";

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

export const routerAbi = [
  // ✅ Multi-hop exactInput: 5 fields
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
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
  // ✅ Single-hop exactInputSingle (has limitSqrtPrice)
  {
    type: "function",
    name: "exactInputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
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

  // console.log("paths --", paths);
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
  // console.log("all possible pool  --- ", pairs);
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

  // console.log("factory results  --- ", factoryResults);

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

    // console.log("map -- ", map);
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
    () => (bestPathQuote === null ? 0n : bestPathQuote.expectedOut ?? null),
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
  let isApproved =
    !needsApproval || (allowance !== undefined && allowance >= amountInWei);

  // Writers + receipts
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash } = useWriteContract();

  const {
    isLoading: approving,
    isSuccess: approveSuccess,
    data: approveReceipt,
  } = useWaitForTransactionReceipt({ hash: approveHash });
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
      args: [MOLTEN_SWAP_ROUTER, amountInWei],
    });
  }

  function handleSwap() {
    if (!from || amountInWei <= 0n) return;
    if (!bestPathQuote || bestPathQuote.path.length < 2) {
      toast.error("No valid path found for this swap!");
      console.warn("No valid quoted path found.");
      return;
    }

    const path = bestPathQuote.path; // [tokenIn, ..., tokenOut] (WCORE-canonicalized)
    const encodedPath = encodePath(path);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
    const amountOutMinimum = bestPathQuote.minOut;

    const isCoreIn = tokenIn === "0x00";
    const isCoreOut = tokenOut === "0x00";

    // Safety: CORE-in must start with WCORE
    if (
      isCoreIn &&
      path[0].toLowerCase() !== WCORE_TOKEN_ADDRESS.toLowerCase()
    ) {
      console.error("CORE-in path must start with WCORE. Got:", path[0]);
      return;
    }

    // SINGLE-HOP (2 tokens) → exactInputSingle
    if (path.length === 2) {
      const [a, b] = path as [`0x${string}`, `0x${string}`];
      const calls: `0x${string}`[] = [];

      if (!isCoreIn && isCoreOut) {
        // ERC20 -> CORE: swap to WCORE (recipient router) then unwrap all to user
        const exactInputSingleData = encodeFunctionData({
          abi: routerAbi,
          functionName: "exactInputSingle",
          args: [
            {
              tokenIn: a,
              tokenOut: WCORE_TOKEN_ADDRESS as `0x${string}`,
              recipient: MOLTEN_SWAP_ROUTER as `0x${string}`,
              deadline,
              amountIn: amountInWei,
              amountOutMinimum,
              limitSqrtPrice: 0n,
            },
          ],
        });
        const unwrapData = encodeFunctionData({
          abi: routerAbi,
          functionName: "unwrapWNativeToken",
          args: [0n, from as `0x${string}`], // unwrap full WCORE
        });
        calls.push(exactInputSingleData, unwrapData);

        return writeSwap({
          address: MOLTEN_SWAP_ROUTER,
          abi: routerAbi,
          functionName: "multicall",
          args: [calls],
        });
      }

      if (isCoreIn && !isCoreOut) {
        // CORE -> ERC20: send value; router wraps internally, recipient = user
        const exactInputSingleData = encodeFunctionData({
          abi: routerAbi,
          functionName: "exactInputSingle",
          args: [
            {
              tokenIn: WCORE_TOKEN_ADDRESS as `0x${string}`,
              tokenOut: b,
              recipient: from as `0x${string}`,
              deadline,
              amountIn: amountInWei,
              amountOutMinimum,
              limitSqrtPrice: 0n,
            },
          ],
        });
        calls.push(exactInputSingleData);

        return writeSwap({
          address: MOLTEN_SWAP_ROUTER,
          abi: routerAbi,
          functionName: "multicall",
          args: [calls],
          value: amountInWei,
        });
      }

      // ERC20 -> ERC20 single-hop
      const exactInputSingleData = encodeFunctionData({
        abi: routerAbi,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: a,
            tokenOut: b,
            recipient: from as `0x${string}`,
            deadline,
            amountIn: amountInWei,
            amountOutMinimum,
            limitSqrtPrice: 0n,
          },
        ],
      });

      return writeSwap({
        address: MOLTEN_SWAP_ROUTER,
        abi: routerAbi,
        functionName: "multicall",
        args: [[exactInputSingleData]],
      });
    }

    // MULTI-HOP (≥3 tokens) → exactInput (NO limitSqrtPrice)
    const recipient = isCoreOut
      ? (MOLTEN_SWAP_ROUTER as `0x${string}`)
      : (from as `0x${string}`);

    const exactInputData = encodeFunctionData({
      abi: routerAbi,
      functionName: "exactInput",
      args: [
        {
          path: encodedPath,
          recipient,
          deadline,
          amountIn: amountInWei,
          amountOutMinimum,
        },
      ],
    });

    const calls: `0x${string}`[] = [exactInputData];

    if (isCoreOut) {
      // unwrap full WCORE to CORE for user
      const unwrapData = encodeFunctionData({
        abi: routerAbi,
        functionName: "unwrapWNativeToken",
        args: [0n, from as `0x${string}`],
      });
      calls.push(unwrapData);
    }

    return writeSwap({
      address: MOLTEN_SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [calls],
      ...(isCoreIn ? { value: amountInWei } : {}),
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
    approveReceipt,
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

type TokenSwapProps = {
  tokenIn: `0x${string}`; // allow "0x00" for CORE
  tokenOut: `0x${string}`; // allow "0x00" for CORE
  amount: string;
  slippagePct: string; // e.g. "0.50"
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export default function TokenSwap({
  tokenIn,
  tokenOut,
  amount,
  slippagePct,
  sendMessage,
}: TokenSwapProps) {
  // console.log("amount --- ", amount);
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
    approveSuccess,
    approveReceipt,
    swapping,
    swapSuccess,
    swapReceipt,
    handleApprove,
    handleSwap,
    filteredPaths,
  } = useDynamicSwap({ tokenIn, tokenOut, amountInWei, slippagePct });

  // console.log("is approved --- ", isApproved);
  // console.log("approveSuccess --- ", approveSuccess);
  // console.log("approveReceipt --- ", approveReceipt);
  // console.log("swapReceipt --- ", swapReceipt);
  // console.log("filteredPaths --- ", filteredPaths);

  useEffect(() => {
    if (swapSuccess && swapReceipt?.status === "success") {
      sendMessage({
        role: "system",
        parts: [
          {
            type: "text",
            text: `Swap for ${amount} ${symbolIn} to ${symbolOut} was successfull.`,
          },
        ],
      });
    }
  }, [swapSuccess, swapReceipt]);
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4 flex flex-row flex-wrap gap-2 items-center">
          <span>Swap {symbolIn || "…"}</span> <ArrowRightCircle size={24} />{" "}
          <span>{symbolOut || "…"}</span>
        </h2>

        {/* Swap summary */}
        <div className="text-sm grid grid-cols-2 gap-y-2 mb-6">
          <span className="text-gray-400">Amount In</span>
          <span className="text-right font-medium">
            {amount} {symbolIn}
          </span>

          <span className="text-gray-400">Est. Receive</span>
          <span className="text-right font-medium">
            {expectedOut
              ? Number(formatUnits(expectedOut, decimalsOut)).toFixed(10)
              : "…"}{" "}
            {symbolOut}
          </span>

          <span className="text-gray-400">Min. Receive (0.5% slip)</span>
          <span className="text-right font-medium">
            {minOut
              ? Number(formatUnits(minOut, decimalsOut)).toFixed(10)
              : "…"}{" "}
            {symbolOut}
          </span>
        </div>

        {/* Action buttons */}
        {!isApproved && !approveSuccess ? (
          <button
            disabled={approving}
            onClick={handleApprove}
            className="flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
          >
            {approving ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Approving {symbolIn}…</span>
              </>
            ) : (
              <>Approve {symbolIn}</>
            )}
          </button>
        ) : (
          <button
            disabled={swapping || expectedOut === null}
            onClick={handleSwap}
            className="flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
          >
            {swapping ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Swapping…</span>
              </>
            ) : (
              <span>Swap</span>
            )}
          </button>
        )}
      </div>

      {/* Success card */}
      {swapSuccess && swapReceipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Swap Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold flex items-center gap-2">
              {amount} {symbolIn} <ArrowRightCircle size={24} />{" "}
              {Number(formatUnits(expectedOut ?? 0n, decimalsOut)).toFixed(3)}{" "}
              {symbolOut}
            </span>
          </div>
          <p className="text-gray-500 text-sm">via Molten Router</p>
          {swapReceipt?.transactionHash && (
            <p>
              <Link
                href={`https://scan.coredao.org/tx/${swapReceipt?.transactionHash}`}
                target="_blank"
                className="underline text-blue-600 text-sm"
              >
                View on CoreScan
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
