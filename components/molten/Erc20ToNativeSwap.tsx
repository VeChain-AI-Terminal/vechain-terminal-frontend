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
    inputs: [{ name: "params", type: "tuple", components: [] }],
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

export default function Erc20ToNativeSwap({
  tokenIn,
  decimalsIn,
}: {
  tokenIn: `0x${string}`;
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
      { tokenIn, tokenOut: WCORE, amountIn: parsedAmount, limitSqrtPrice: 0n },
    ],
    chainId: 1116,
    query: { enabled: !!from && !!amountIn },
  });
  const expectedOut = expectedOutRaw as bigint | undefined;
  const minOut = expectedOut ? (expectedOut * 995n) / 1000n : 0n;

  // allowance
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
          tokenOut: WCORE,
          recipient: SWAP_ROUTER,
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
      args: [0n, from],
    });

    writeSwap({
      address: SWAP_ROUTER,
      abi: routerAbi,
      functionName: "multicall",
      args: [[swapData, unwrapData]],
    });
  }

  return (
    <div>
      <h2>ERC20 → Native</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />
      {!isApproved && (
        <button onClick={handleApprove} disabled={approving}>
          {approving ? "Approving..." : "Approve"}
        </button>
      )}
      <button
        onClick={handleSwap}
        disabled={(!isApproved && !approveSuccess) || swapping}
      >
        {swapping ? "Swapping..." : "Swap"}
      </button>
      {swapSuccess && <p>Swap confirmed 🎉</p>}
    </div>
  );
}
