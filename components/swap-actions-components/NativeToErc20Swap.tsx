"use client";

import React, { useMemo } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
  useReadContract,
} from "wagmi";
import { parseEther, formatUnits, encodeFunctionData } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { FaSpinner } from "react-icons/fa";
import { CheckCircleFillIcon } from "@/components/icons";
import Link from "next/link";
import {
  MOLTEN_QUOTER,
  MOLTEN_SWAP_ROUTER,
  WCORE_TOKEN_ADDRESS,
} from "@/lib/constants";

// --- Slippage tolerance (0.5%)
const SLIPPAGE_BPS = 50; // 50 basis points = 0.5%

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
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
];

const swapRouterAbi = [
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
    name: "multicall",
    stateMutability: "payable",
    inputs: [{ name: "data", type: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]" }],
  },
];

const quoterV2Abi = [
  {
    type: "function",
    name: "quoteExactInputSingle",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "limitSqrtPrice", type: "uint160" },
        ],
      },
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "amountIn", type: "uint256" },
      { name: "sqrtPriceX96After", type: "uint160" },
      { name: "initializedTicksCrossed", type: "uint32" },
      { name: "gasEstimate", type: "uint256" },
      { name: "fee", type: "uint16" },
    ],
  },
];

export default function NativeToErc20Swap({
  tokenOut,
  amount,
}: {
  tokenOut: `0x${string}`;
  amount: string;
}) {
  console.log("amojtn for native to erc20 --- ", amount);
  const { address } = useAppKitAccount();
  const {
    writeContract,
    data: swapHash,
    isPending: swapping,
    error: writeError,
  } = useWriteContract();
  const { isSuccess: swapSuccess, data: swapReceipt } =
    useWaitForTransactionReceipt({ hash: swapHash });

  const amountInWei = amount ? parseEther(amount) : 0n;

  // --- Metadata for tokenOut
  const { data: tokenMeta } = useReadContracts({
    allowFailure: true,
    contracts: [
      { address: tokenOut, abi: erc20MetaAbi, functionName: "decimals" },
      { address: tokenOut, abi: erc20MetaAbi, functionName: "symbol" },
      { address: tokenOut, abi: erc20MetaAbi, functionName: "name" },
    ],
    query: { enabled: !!tokenOut },
  });

  const decimalsOut = useMemo(
    () =>
      typeof tokenMeta?.[0]?.result === "number" ? tokenMeta[0].result : 18,
    [tokenMeta]
  );
  const symbolOut = useMemo(
    () =>
      typeof tokenMeta?.[1]?.result === "string" ? tokenMeta[1].result : "",
    [tokenMeta]
  );
  const nameOut = useMemo(
    () =>
      typeof tokenMeta?.[2]?.result === "string" ? tokenMeta[2].result : "",
    [tokenMeta]
  );

  // --- Quoter for expected output
  const { data: quoteResult } = useReadContract({
    address: MOLTEN_QUOTER,
    abi: quoterV2Abi,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn: WCORE_TOKEN_ADDRESS,
        tokenOut: tokenOut,
        amountIn: amountInWei,
        limitSqrtPrice: 0n,
      },
    ],
    query: { enabled: !!tokenOut && amountInWei > 0n },
  }) as { data: any | undefined };

  console.log("quoter resute --- ", quoteResult);

  const expectedOut = useMemo(() => {
    if (!quoteResult) return null;
    return quoteResult[0] as bigint; // amountOut
  }, [quoteResult]);

  // --- Apply slippage
  const minAmountOut = useMemo(() => {
    if (!expectedOut) return 0n;
    return (expectedOut * BigInt(10000 - SLIPPAGE_BPS)) / 10000n;
  }, [expectedOut]);

  const handleSwap = async () => {
    if (!amount) return;

    const swapData = encodeFunctionData({
      abi: swapRouterAbi,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn: WCORE_TOKEN_ADDRESS,
          tokenOut: tokenOut,
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 600,
          amountIn: amountInWei,
          amountOutMinimum: minAmountOut,
          limitSqrtPrice: 0n,
        },
      ],
    });

    writeContract({
      address: MOLTEN_SWAP_ROUTER,
      abi: swapRouterAbi,
      functionName: "multicall",
      args: [[swapData]],
      value: amountInWei,
    });
  };

  const symbolIn = "CORE";

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Swap {symbolIn} → {symbolOut || "…"}
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
              ? Number(formatUnits(expectedOut, decimalsOut)).toFixed(3)
              : "…"}{" "}
            {symbolOut}
          </span>

          <span className="text-gray-400">Min. Receive (0.5% slip)</span>
          <span className="text-right font-medium">
            {minAmountOut
              ? Number(formatUnits(minAmountOut, decimalsOut)).toFixed(3)
              : "…"}{" "}
            {symbolOut}
          </span>
        </div>

        {/* Action button */}
        <button
          disabled={swapping || swapSuccess}
          onClick={handleSwap}
          className="flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
        >
          {swapping ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Swapping…</span>
            </>
          ) : (
            <>Swap</>
          )}
        </button>
      </div>

      {/* Success card */}
      {swapSuccess && swapReceipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Swap Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">
              {amount} {symbolIn} →{" "}
              {Number(formatUnits(expectedOut ?? 0n, decimalsOut)).toFixed(3)}{" "}
              {symbolOut}
            </span>
          </div>
          <p className="text-gray-500 text-sm">via Molten Router</p>
          {swapHash && (
            <p>
              <Link
                href={`https://scan.coredao.org/tx/${swapHash}`}
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
