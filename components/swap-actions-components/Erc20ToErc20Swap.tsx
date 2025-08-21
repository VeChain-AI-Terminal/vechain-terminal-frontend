"use client";

import React, { useMemo } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { parseUnits, encodeFunctionData, formatUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { MOLTEN_QUOTER, MOLTEN_SWAP_ROUTER } from "@/lib/constants";
import { FaSpinner } from "react-icons/fa";
import { CheckCircleFillIcon } from "@/components/icons";
import Link from "next/link";

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
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
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
];

const routerAbi = [
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
  },
  {
    type: "function",
    name: "multicall",
    stateMutability: "payable",
    inputs: [{ name: "data", type: "bytes[]" }],
  },
];

const quoterAbi = [
  {
    type: "function",
    name: "quoteExactInputSingle",
    stateMutability: "view",
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
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
];

export default function Erc20ToErc20Swap({
  tokenIn,
  tokenOut,
  amount,
}: {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amount: string;
}) {
  const { address: from } = useAppKitAccount();

  // --- Metadata
  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      { address: tokenIn, abi: erc20MetaAbi, functionName: "decimals" },
      { address: tokenIn, abi: erc20MetaAbi, functionName: "symbol" },
      { address: tokenOut, abi: erc20MetaAbi, functionName: "decimals" },
      { address: tokenOut, abi: erc20MetaAbi, functionName: "symbol" },
    ],
    query: { enabled: !!tokenIn && !!tokenOut },
  });

  const decimalsIn = useMemo(
    () => (typeof metaData?.[0]?.result === "number" ? metaData[0].result : 18),
    [metaData]
  );
  const symbolIn = useMemo(
    () => (typeof metaData?.[1]?.result === "string" ? metaData[1].result : ""),
    [metaData]
  );
  const decimalsOut = useMemo(
    () => (typeof metaData?.[2]?.result === "number" ? metaData[2].result : 18),
    [metaData]
  );
  const symbolOut = useMemo(
    () => (typeof metaData?.[3]?.result === "string" ? metaData[3].result : ""),
    [metaData]
  );

  const parsedAmount = amount ? parseUnits(amount, decimalsIn) : 0n;

  // --- Quote
  const { data: expectedOutRaw } = useReadContract({
    address: MOLTEN_QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [{ tokenIn, tokenOut, amountIn: parsedAmount, limitSqrtPrice: 0n }],
    chainId: 1116,
    query: { enabled: !!from && !!amount },
  });
  const expectedOut = expectedOutRaw as bigint | undefined;
  const minOut = expectedOut ? (expectedOut * 995n) / 1000n : 0n;

  // --- Allowance
  const { data: allowanceRaw } = useReadContract({
    address: tokenIn,
    abi: erc20MetaAbi,
    functionName: "allowance",
    args: from ? [from, MOLTEN_SWAP_ROUTER] : undefined,
    chainId: 1116,
    query: { enabled: !!from },
  });
  const allowance = allowanceRaw as bigint | undefined;
  console.log("allowance --- ", allowance);
  const isApproved = allowance !== undefined && allowance >= parsedAmount;

  // --- Write contracts
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash } = useWriteContract();

  const { isLoading: approving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash, chainId: 1116 });
  const {
    isLoading: swapping,
    isSuccess: swapSuccess,
    data: swapReceipt,
  } = useWaitForTransactionReceipt({ hash: swapHash, chainId: 1116 });

  function handleApprove() {
    if (!from) return;
    writeApprove({
      address: tokenIn,
      abi: erc20MetaAbi,
      functionName: "approve",
      args: [MOLTEN_SWAP_ROUTER, 2n ** 256n - 1n],
    });
  }

  function handleSwap() {
    if (!from || !amount) return;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
    const swapData = encodeFunctionData({
      abi: routerAbi,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn,
          tokenOut,
          recipient: from,
          deadline,
          amountIn: parsedAmount,
          amountOutMinimum: minOut,
          limitSqrtPrice: 0n,
        },
      ],
    });

    writeSwap({
      address: MOLTEN_SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[swapData]],
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Swap {symbolIn || "…"} → {symbolOut || "…"}
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
        </div>

        {/* Action button */}
        {!isApproved ? (
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
            disabled={swapping}
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
