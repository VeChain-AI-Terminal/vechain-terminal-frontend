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
import { MOLTEN_QUOTER, MOLTEN_SWAP_ROUTER } from "@/lib/constants";

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
}: {
  tokenIn: `0x${string}`;
}) {
  const { address: from } = useAppKitAccount();
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState("0.5");

  // --- Fetch token metadata (decimals + symbol)
  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: tokenIn,
        chainId: 1116,
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: tokenIn,
        chainId: 1116,
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
    ],
    query: { enabled: !!tokenIn },
  });

  const tokenDecimals = useMemo(() => {
    const v = metaData?.[0]?.result;
    return typeof v === "number" ? v : 18; // fallback to 18
  }, [metaData]);

  const tokenSymbol = useMemo(() => {
    const v = metaData?.[1]?.result;
    return typeof v === "string" ? v : undefined;
  }, [metaData]);

  // CORE native is 18 decimals
  const decimalsOut = 18;

  const parsedAmount = amountIn ? parseUnits(amountIn, tokenDecimals) : 0n;

  // --- Quote expected out
  const { data: expectedOutRaw } = useReadContract({
    address: MOLTEN_QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [
      { tokenIn, tokenOut: WCORE, amountIn: parsedAmount, limitSqrtPrice: 0n },
    ],
    chainId: 1116,
    query: { enabled: !!from && !!amountIn },
  });
  const expectedOut = expectedOutRaw as bigint | undefined;

  // --- Slippage
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
    chainId: 1116,
    query: { enabled: !!from },
  });
  const allowance = allowanceRaw as bigint | undefined;
  const isApproved = allowance !== undefined && allowance >= parsedAmount;

  // --- Write hooks
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
      abi: erc20MetaAbi,
      functionName: "approve",
      args: [MOLTEN_SWAP_ROUTER, 2n ** 256n - 1n],
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
      args: [minOut, from], // ✅ enforce minOut here
    });

    writeSwap({
      address: MOLTEN_SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[swapData, unwrapData]],
    });
  }

  return (
    <div className="space-y-3 border p-4 rounded">
      <h2 className="font-semibold">Swap {tokenSymbol ?? "..."} → CORE</h2>

      <input
        type="number"
        placeholder={`Amount in ${tokenSymbol ?? ""}`}
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />

      {/* Estimations */}
      {expectedOut !== undefined && (
        <div className="text-sm text-gray-600">
          <p>
            Est. receive ≈{" "}
            {Number(formatUnits(expectedOut, decimalsOut)).toFixed(3)} CORE
          </p>
          <p>
            Minimum (after slippage {slippage}%):{" "}
            {Number(formatUnits(minOut, decimalsOut)).toFixed(3)} CORE
          </p>
        </div>
      )}

      {/* Buttons */}
      {!isApproved && (
        <button
          onClick={handleApprove}
          disabled={approving}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {approving ? "Approving..." : `Approve ${tokenSymbol ?? ""}`}
        </button>
      )}
      <button
        onClick={handleSwap}
        disabled={(!isApproved && !approveSuccess) || swapping}
        className="bg-green-600 text-white px-3 py-1 rounded ml-2"
      >
        {swapping ? "Swapping..." : "Swap"}
      </button>

      {swapSuccess && <p className="text-green-600">Swap confirmed 🎉</p>}
    </div>
  );
}
