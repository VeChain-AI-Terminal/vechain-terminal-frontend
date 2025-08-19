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
const WCORE = "0x191e94fa59739e188dce837f7f6978d84727ad01";

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
    inputs: [{ name: "params", type: "tuple", components: [] }],
  },
  {
    type: "function",
    name: "multicall",
    stateMutability: "payable",
    inputs: [],
  },
];

const quoterAbi = [
  {
    type: "function",
    name: "quoteExactInputSingle",
    stateMutability: "view",
    inputs: [{ name: "params", type: "tuple", components: [] }],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
];

export default function NativeToErc20Swap({
  tokenOut,
  decimalsIn,
}: {
  tokenOut: `0x${string}`;
  decimalsIn: number;
}) {
  const { address: from } = useAppKitAccount();
  const [amountIn, setAmountIn] = useState("");
  const parsedAmount = amountIn ? parseUnits(amountIn, decimalsIn) : 0n;

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
      args: [[wrapData, swapData]],
      value: parsedAmount,
    });
  }

  return (
    <div>
      <h2>Native → ERC20</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />
      <button onClick={handleSwap} disabled={swapping}>
        {swapping ? "Swapping..." : "Swap"}
      </button>
      {swapSuccess && <p>Swap confirmed 🎉</p>}
    </div>
  );
}
