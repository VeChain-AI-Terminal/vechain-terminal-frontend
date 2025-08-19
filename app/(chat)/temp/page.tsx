"use client";

import React, { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, encodeFunctionData } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { ChatHeader } from "@/components/chat-header";

// === Contract addresses ===
const SWAP_ROUTER = "0x832933BA44658C50ae6152039Cd30A6f4C2432b1";
const USDC = "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9";
const WCORE = "0x191e94fa59739e188dce837f7f6978d84727ad01";
const QUOTER = "0x20dA24b5FaC067930Ced329A3457298172510Fe7";

// === Minimal ABIs ===
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
    outputs: [{ type: "bytes[]", name: "results" }],
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

export default function Page() {
  const { address: from } = useAppKitAccount();
  const [amountIn, setAmountIn] = useState("");
  const [step, setStep] = useState<"idle" | "approve" | "swap">("idle");

  // --- Allowance check ---
  const { data: allowanceRaw } = useReadContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "allowance",
    args: from ? [from, SWAP_ROUTER] : undefined,
    chainId: 1116,
    query: { enabled: !!from },
  });

  // Cast allowance properly
  const allowance = allowanceRaw as bigint | undefined;

  const isApproved =
    allowance !== undefined &&
    amountIn !== "" &&
    allowance >= parseUnits(amountIn, 6);

  const parsedAmount = amountIn ? parseUnits(amountIn, 6) : 0n;

  const { data: expectedOutRaw } = useReadContract({
    address: QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn: USDC,
        tokenOut: WCORE,
        amountIn: parsedAmount,
        limitSqrtPrice: 0n,
      },
    ],
    chainId: 1116,
    query: { enabled: !!from && !!amountIn },
  });

  const expectedOut = expectedOutRaw as bigint | undefined;

  // ✅ Apply 0.5% slippage tolerance
  const minOut = expectedOut !== undefined ? (expectedOut * 995n) / 1000n : 0n;

  // --- Write hooks ---
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();

  const {
    writeContract: writeSwap,
    data: swapHash,
    isPending: isSwapping,
    error: swapError,
  } = useWriteContract();

  // --- Receipt hooks ---
  const { isLoading: approving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
      chainId: 1116,
      confirmations: 1,
      query: { enabled: !!approveHash },
    });

  const { isLoading: swapping, isSuccess: swapSuccess } =
    useWaitForTransactionReceipt({
      hash: swapHash,
      chainId: 1116,
      confirmations: 1,
      query: { enabled: !!swapHash },
    });

  async function handleApprove() {
    if (!amountIn || !from) return;
    setStep("approve");

    const MAX_UINT256 =
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

    writeApprove({
      address: USDC,
      abi: erc20Abi,
      functionName: "approve",
      args: [SWAP_ROUTER, MAX_UINT256],
    });
  }

  async function handleSwap() {
    if (!amountIn || !from) return;
    const parsed = parseUnits(amountIn, 6);
    setStep("swap");

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

    // Step 1: encode swap USDC -> WCORE (recipient = router)
    const swapData = encodeFunctionData({
      abi: routerAbi,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn: USDC,
          tokenOut: WCORE,
          recipient: SWAP_ROUTER,
          deadline,
          amountIn: parsed,
          amountOutMinimum: minOut,
          limitSqrtPrice: 0n,
        },
      ],
    });

    // Step 2: encode unwrap WCORE -> CORE (recipient = user)
    const unwrapData = encodeFunctionData({
      abi: routerAbi,
      functionName: "unwrapWNativeToken",
      args: [0n, from],
    });

    // Send both in multicall
    writeSwap({
      address: SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[swapData, unwrapData]],
    });
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />

      <div className="p-5 space-y-4">
        <h1 className="text-xl font-semibold">Swap USDC → CORE (multicall)</h1>

        <input
          className="border rounded px-2 py-1 w-60"
          type="number"
          placeholder="Amount in USDC"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />

        {/* Always show Swap button, only show Approve if needed */}
        {!isApproved && (
          <button
            disabled={isApproving || approving}
            onClick={handleApprove}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isApproving || approving ? "Approving..." : "Approve USDC"}
          </button>
        )}

        <button
          disabled={(!isApproved && !approveSuccess) || isSwapping || swapping}
          onClick={handleSwap}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {isSwapping || swapping ? "Swapping..." : "Swap"}
        </button>

        {/* Status messages */}
        {approveError && (
          <p className="text-red-500">Approve error: {approveError.message}</p>
        )}
        {swapError && (
          <p className="text-red-500">Swap error: {swapError.message}</p>
        )}
        {approveSuccess && (
          <p className="text-green-600">Approval confirmed ✅</p>
        )}
        {swapSuccess && <p className="text-green-600">Swap confirmed 🎉</p>}
      </div>
    </div>
  );
}
