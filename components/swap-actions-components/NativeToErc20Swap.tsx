"use client";

import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";

// Molten contracts
const SWAP_ROUTER = "0x832933BA44658C50ae6152039Cd30A6f4C2432b1";
const WCORE = "0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f"; // <-- replace with actual WCORE address

const swapRouterAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "tokenIn", type: "address" },
          { internalType: "address", name: "tokenOut", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          {
            internalType: "uint256",
            name: "amountOutMinimum",
            type: "uint256",
          },
          { internalType: "uint160", name: "limitSqrtPrice", type: "uint160" },
        ],
        internalType: "struct ISwapRouter.ExactInputSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInputSingle",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];

export default function CoreToUSDC({ tokenOut }: { tokenOut: `0x${string}` }) {
  const { address } = useAppKitAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const [amount, setAmount] = useState("");

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSwap = () => {
    if (!amount) return;

    const amountIn = parseEther(amount);

    // Path = CORE (wrapped to WCORE) → USDC
    const path = encodePackedPath([WCORE, tokenOut]);

    writeContract({
      address: SWAP_ROUTER,
      abi: swapRouterAbi,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn: WCORE,
          tokenOut: tokenOut,
          fee: 500, // 0.05% pool fee tier
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 600,
          amountIn,
          amountOutMinimum: 0, // should use quoter for safety
          limitSqrtPrice: 0,
        },
      ],
      value: amountIn, // pay CORE, router wraps it
    });
  };

  // Utility to encode packed path
  function encodePackedPath(tokens: string[]): `0x${string}` {
    return ("0x" +
      tokens.map((t) => t.slice(2).toLowerCase()).join("")) as `0x${string}`;
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <h2 className="text-lg font-semibold">Swap CORE → USDC</h2>
      <input
        type="text"
        placeholder="Amount in CORE"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSwap}
        disabled={isPending}
        className="px-4 py-2 bg-orange-600 text-white rounded"
      >
        {isPending ? "Confirming…" : "Swap"}
      </button>

      {isConfirming && <p>Waiting for confirmation…</p>}
      {isSuccess && <p>✅ Swap confirmed!</p>}
    </div>
  );
}
