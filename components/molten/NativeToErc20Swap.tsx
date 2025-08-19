"use client";

import React, { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, encodeFunctionData, formatUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";

const SWAP_ROUTER = "0x832933BA44658C50ae6152039Cd30A6f4C2432b1";
const QUOTER = "0x20dA24b5FaC067930Ced329A3457298172510Fe7";
const WCORE = "0x191e94fa59739e188dce837f7f6978d84727ad01";

const erc20Abi = [
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
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    outputs: [{ type: "uint8" }],
  },
];

const routerAbi = [
  {
    type: "function",
    name: "wrapNativeToken",
    stateMutability: "payable",
    inputs: [{ name: "recipient", type: "address" }],
  },
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
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "deadline", type: "uint256" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
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

export default function NativeToErc20Swap({
  tokenOut,
}: {
  tokenOut: `0x${string}`;
}) {
  const { address: from } = useAppKitAccount();
  const [amountIn, setAmountIn] = useState("");
  const parsedAmount = amountIn ? parseUnits(amountIn, 18) : 0n;
  console.log("parsed amount --- ", parsedAmount);
  // Fetch ERC20 metadata
  const { data: tokenOutNameRaw } = useReadContract({
    address: tokenOut,
    abi: erc20Abi,
    functionName: "name",
  });
  const tokenOutName = tokenOutNameRaw as string | undefined;
  // Example: fetch USDC metadata
  const { data: decimalsOut } = useReadContract({
    address: tokenOut,
    abi: erc20Abi,
    functionName: "decimals",
    chainId: 1116,
  });
  const decimalsOutNum = (decimalsOut as number) || undefined;

  const { data: tokenOutSymbolRaw } = useReadContract({
    address: tokenOut,
    abi: erc20Abi,
    functionName: "symbol",
  });
  const tokenOutSymbol = tokenOutSymbolRaw as string | undefined;
  // quote
  const { data: expectedOutRaw } = useReadContract({
    address: QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [
      { tokenIn: WCORE, tokenOut, amountIn: parsedAmount, limitSqrtPrice: 0n },
    ],
    chainId: 1116,
    query: { enabled: !!from && !!amountIn },
  });
  const expectedOut = expectedOutRaw as bigint | undefined;
  const minOut = expectedOut ? (expectedOut * 995n) / 1000n : 0n;

  const { writeContract: writeSwap, data: swapHash } = useWriteContract();
  const { isLoading: swapping, isSuccess: swapSuccess } =
    useWaitForTransactionReceipt({ hash: swapHash, chainId: 1116 });

  function handleSwap() {
    if (!from || !amountIn) return;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

    const wrapData = encodeFunctionData({
      abi: routerAbi,
      functionName: "wrapNativeToken",
      args: [from],
    });

    const swapData = encodeFunctionData({
      abi: routerAbi,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn: WCORE,
          tokenOut,
          fee: 500, // 0.05% pool, adjust as needed
          recipient: from,
          deadline,
          amountIn: parsedAmount,
          amountOutMinimum: minOut,
          sqrtPriceLimitX96: 0n,
        },
      ],
    });

    writeSwap({
      address: SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[wrapData, swapData]],
      value: parsedAmount, // send CORE along
    });
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        CORE → {tokenOutSymbol ?? "ERC20"}
      </h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 
                   bg-gray-50 dark:bg-zinc-800 px-4 py-2 text-gray-800 
                   dark:text-gray-100 focus:outline-none focus:ring-2 
                   focus:ring-orange-500"
      />
      {expectedOut && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Est. receive ≈{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {Number(
              formatUnits(expectedOut ?? 0n, decimalsOutNum ?? 18)
            ).toFixed(3)}
          </span>
        </p>
      )}
      <button
        onClick={handleSwap}
        disabled={swapping}
        className="bg-green-600 text-white px-3 py-1 rounded w-full"
      >
        {swapping ? "Swapping..." : "Swap"}
      </button>
      {swapSuccess && <p>Swap confirmed 🎉</p>}{" "}
    </div>
  );
}
