"use client";

import React, { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, encodeFunctionData } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";

const SWAP_ROUTER = "0x832933BA44658C50ae6152039Cd30A6f4C2432b1";
const QUOTER = "0x20dA24b5FaC067930Ced329A3457298172510Fe7";

const erc20Abi = [
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
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
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
  decimalsIn,
}: {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  decimalsIn: number;
}) {
  const { address: from } = useAppKitAccount();
  const [amountIn, setAmountIn] = useState("");
  const parsedAmount = amountIn ? parseUnits(amountIn, decimalsIn) : 0n;

  // --- Fetch token metadata
  // --- Fetch token metadata
  const { data: tokenInNameRaw } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: "name",
  });
  const tokenInName = tokenInNameRaw as string | undefined;

  const { data: tokenInSymbolRaw } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: "symbol",
  });
  const tokenInSymbol = tokenInSymbolRaw as string | undefined;

  const { data: tokenOutNameRaw } = useReadContract({
    address: tokenOut,
    abi: erc20Abi,
    functionName: "name",
  });
  const tokenOutName = tokenOutNameRaw as string | undefined;

  const { data: tokenOutSymbolRaw } = useReadContract({
    address: tokenOut,
    abi: erc20Abi,
    functionName: "symbol",
  });
  const tokenOutSymbol = tokenOutSymbolRaw as string | undefined;

  // --- Quote expected out
  const { data: expectedOutRaw } = useReadContract({
    address: QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [{ tokenIn, tokenOut, amountIn: parsedAmount, limitSqrtPrice: 0n }],
    chainId: 1116,
    query: { enabled: !!from && !!amountIn },
  });
  const expectedOut = expectedOutRaw as bigint | undefined;
  const minOut = expectedOut ? (expectedOut * 995n) / 1000n : 0n;

  // --- Allowance
  const { data: allowanceRaw } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: "allowance",
    args: from ? [from, SWAP_ROUTER] : undefined,
    chainId: 1116,
    query: { enabled: !!from },
  });
  const allowance = allowanceRaw as bigint | undefined;
  const isApproved = allowance !== undefined && allowance >= parsedAmount;

  // --- Write contracts
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash } = useWriteContract();

  const { isLoading: approving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash, chainId: 1116 });
  const { isLoading: swapping, isSuccess: swapSuccess } =
    useWaitForTransactionReceipt({ hash: swapHash, chainId: 1116 });

  function handleApprove() {
    if (!from) return;
    writeApprove({
      address: tokenIn,
      abi: erc20Abi,
      functionName: "approve",
      args: [SWAP_ROUTER, 2n ** 256n - 1n],
    });
  }

  function handleSwap() {
    if (!from || !amountIn) return;
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
      address: SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[swapData]],
    });
  }

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="font-semibold">
        Swap {tokenInSymbol ?? "…"} → {tokenOutSymbol ?? "…"}
      </h2>
      <p className="text-sm text-gray-500">
        {tokenInName ?? "…"} to {tokenOutName ?? "…"}
      </p>

      <input
        type="number"
        placeholder={`Amount in ${tokenInSymbol ?? ""}`}
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        className="border rounded px-2 py-1"
      />

      {!isApproved && (
        <button
          onClick={handleApprove}
          disabled={approving}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {approving ? "Approving..." : `Approve ${tokenInSymbol ?? ""}`}
        </button>
      )}
      <button
        onClick={handleSwap}
        disabled={(!isApproved && !approveSuccess) || swapping}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        {swapping ? "Swapping..." : "Swap"}
      </button>

      {expectedOut !== undefined && (
        <p className="text-sm text-gray-700">
          Est. receive ≈ {expectedOut.toString()} {tokenOutSymbol ?? ""}
        </p>
      )}

      {swapSuccess && <p className="text-green-600">Swap confirmed 🎉</p>}
    </div>
  );
}
