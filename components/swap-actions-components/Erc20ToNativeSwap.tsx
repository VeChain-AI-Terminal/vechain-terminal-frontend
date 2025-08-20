"use client";

import React, { useState, useMemo } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
  useReadContract,
} from "wagmi";
import { parseUnits, encodeFunctionData, formatUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { CHAIN_ID, MOLTEN_QUOTER, MOLTEN_SWAP_ROUTER } from "@/lib/constants";
import { FaSpinner } from "react-icons/fa";
import { CheckCircleFillIcon } from "@/components/icons";
import Link from "next/link";

const WCORE = "0x191e94fa59739e188dce837f7f6978d84727ad01";

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

export default function Erc20ToNativeSwap({
  tokenIn,
  amount,
}: {
  tokenIn: `0x${string}`;
  amount: string;
}) {
  const { address: from } = useAppKitAccount();
  const [slippage, setSlippage] = useState("0.5");

  // --- Metadata
  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: tokenIn,
        chainId: CHAIN_ID,
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: tokenIn,
        chainId: CHAIN_ID,
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
    ],
    query: { enabled: !!tokenIn },
  });

  const tokenDecimals = useMemo(
    () => (typeof metaData?.[0]?.result === "number" ? metaData[0].result : 18),
    [metaData]
  );
  const tokenSymbol = useMemo(
    () => (typeof metaData?.[1]?.result === "string" ? metaData[1].result : ""),
    [metaData]
  );

  const parsedAmount = amount ? parseUnits(amount, tokenDecimals) : 0n;

  // --- Quote
  const { data: expectedOutRaw } = useReadContract({
    address: MOLTEN_QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [
      { tokenIn, tokenOut: WCORE, amountIn: parsedAmount, limitSqrtPrice: 0n },
    ],
    chainId: CHAIN_ID,
    query: { enabled: !!from && !!amount },
  });
  const expectedOut = expectedOutRaw as bigint | undefined;

  // --- Slippage
  const decimalsOut = 18;
  const slippageBps = BigInt(Math.floor(parseFloat(slippage) * 100));
  const minOut = expectedOut
    ? (expectedOut * (10000n - slippageBps)) / 10000n
    : 0n;

  // --- Allowance
  const { data: allowanceRaw } = useReadContract({
    address: tokenIn,
    abi: erc20MetaAbi,
    functionName: "allowance",
    args: from ? [from, MOLTEN_SWAP_ROUTER] : undefined,
    chainId: CHAIN_ID,
    query: { enabled: !!from },
  });
  const allowance = allowanceRaw as bigint | undefined;
  const isApproved = allowance !== undefined && allowance >= parsedAmount;

  // --- Write hooks
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash } = useWriteContract();

  const { isLoading: approving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash, chainId: CHAIN_ID });
  const {
    isLoading: swapping,
    isSuccess: swapSuccess,
    data: swapReceipt,
  } = useWaitForTransactionReceipt({ hash: swapHash, chainId: CHAIN_ID });

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
          tokenOut: WCORE,
          recipient: MOLTEN_SWAP_ROUTER,
          deadline,
          amountIn: parsedAmount,
          amountOutMinimum: minOut,
          limitSqrtPrice: 0n,
        },
      ],
    });

    const unwrapData = encodeFunctionData({
      abi: routerAbi,
      functionName: "unwrapWNativeToken",
      args: [minOut, from],
    });

    writeSwap({
      address: MOLTEN_SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[swapData, unwrapData]],
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Swap {tokenSymbol || "…"} → CORE
        </h2>

        {/* Summary */}
        <div className="text-sm grid grid-cols-2 gap-y-2 mb-6">
          <span className="text-gray-400">Amount In</span>
          <span className="text-right font-medium">
            {amount} {tokenSymbol}
          </span>

          <span className="text-gray-400">Est. Receive</span>
          <span className="text-right font-medium">
            {expectedOut
              ? Number(formatUnits(expectedOut, decimalsOut)).toFixed(3)
              : "…"}{" "}
            CORE
          </span>

          <span className="text-gray-400">Min (slippage {slippage}%)</span>
          <span className="text-right font-medium">
            {minOut ? Number(formatUnits(minOut, decimalsOut)).toFixed(3) : "…"}{" "}
            CORE
          </span>
        </div>

        {/* Action buttons */}
        {!isApproved ? (
          <button
            disabled={approving}
            onClick={handleApprove}
            className="flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
          >
            {approving ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Approving {tokenSymbol}…</span>
              </>
            ) : (
              <>Approve {tokenSymbol}</>
            )}
          </button>
        ) : (
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
              {amount} {tokenSymbol} →{" "}
              {Number(formatUnits(expectedOut ?? 0n, decimalsOut)).toFixed(3)}{" "}
              CORE
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
