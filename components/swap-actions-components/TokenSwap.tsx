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
import { FaSpinner } from "react-icons/fa";
import { CheckCircleFillIcon } from "@/components/icons";
import Link from "next/link";
import {
  MOLTEN_QUOTER,
  MOLTEN_SWAP_ROUTER,
  WCORE_TOKEN_ADDRESS,
} from "@/lib/constants";
import { ArrowLeft, ArrowRight, ArrowRightCircle } from "lucide-react";

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

export default function TokenSwap({
  tokenIn,
  tokenOut,
  amount,
}: {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amount: string;
}) {
  const { address: from } = useAppKitAccount();
  const [slippage, setSlippage] = useState("0.5");

  // --- Metadata for tokenIn and tokenOut
  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: tokenIn !== "0x00" ? tokenIn : WCORE_TOKEN_ADDRESS, // Check if tokenIn is "CORE"
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: tokenIn !== "0x00" ? tokenIn : WCORE_TOKEN_ADDRESS, // Check if tokenIn is "CORE"
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
      {
        address: tokenOut !== "0x00" ? tokenOut : WCORE_TOKEN_ADDRESS, // Check if tokenOut is "CORE"
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: tokenOut !== "0x00" ? tokenOut : WCORE_TOKEN_ADDRESS, // Check if tokenOut is "CORE"
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
    ],
    query: { enabled: !!tokenIn && !!tokenOut },
  });

  const decimalsIn = useMemo(() => {
    if (tokenIn === "0x00") {
      return 18; // If it's the native token (CORE), return 18 decimals
    }
    return typeof metaData?.[0]?.result === "number" ? metaData[0].result : 18; // Ensure it's a valid number or fallback to 18
  }, [metaData, tokenIn]);

  const symbolIn = useMemo(() => {
    if (tokenIn === "0x00") {
      return "CORE"; // If it's the native token (CORE), set symbol to "CORE"
    }
    return typeof metaData?.[1]?.result === "string" ? metaData[1].result : ""; // Ensure it's a valid string or fallback to an empty string
  }, [metaData, tokenIn]);

  const decimalsOut = useMemo(() => {
    if (tokenOut === "0x00") {
      return 18; // If it's the native token (CORE), return 18 decimals
    }
    return typeof metaData?.[2]?.result === "number" ? metaData[2].result : 18; // Ensure it's a valid number or fallback to 18
  }, [metaData, tokenOut]);

  const symbolOut = useMemo(() => {
    if (tokenOut === "0x00") {
      return "CORE"; // If it's the native token (CORE), set symbol to "CORE"
    }
    return typeof metaData?.[3]?.result === "string" ? metaData[3].result : ""; // Ensure it's a valid string or fallback to an empty string
  }, [metaData, tokenOut]);

  const amountInWei = amount ? parseUnits(amount, decimalsIn) : 0n;

  // --- Quote logic
  // Quote logic with CORE handling
  const { data: quoteResult } = useReadContract({
    address: MOLTEN_QUOTER,
    abi: quoterAbi,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn: tokenIn === "0x00" ? WCORE_TOKEN_ADDRESS : tokenIn, // Check if tokenIn is CORE, then use WCORE
        tokenOut: tokenOut === "0x00" ? WCORE_TOKEN_ADDRESS : tokenOut, // Check if tokenOut is CORE, then use WCORE
        amountIn: amountInWei,
        limitSqrtPrice: 0n,
      },
    ],
    query: { enabled: !!tokenIn && !!tokenOut && amountInWei > 0n },
  });

  const expectedOut = useMemo(() => {
    if (!quoteResult) return null;
    console.log("quote result --- ", quoteResult);
    return quoteResult as bigint | undefined; // amountOut
  }, [quoteResult]);

  // --- Apply slippage
  const slippageBps = BigInt(Math.floor(parseFloat(slippage) * 100));
  const minOut = useMemo(() => {
    if (!expectedOut) return 0n;
    return (expectedOut * (10000n - slippageBps)) / 10000n;
  }, [expectedOut]);

  // --- Allowance check
  const { data: allowanceRaw } = useReadContract({
    address: tokenIn,
    abi: erc20MetaAbi,
    functionName: "allowance",
    args: from ? [from, MOLTEN_SWAP_ROUTER] : undefined,
    query: { enabled: !!from },
  });
  const allowance = allowanceRaw as bigint | undefined;
  // Determine if approval is needed
  const isApproved =
    tokenIn === "0x00" || (allowance !== undefined && allowance >= amountInWei);

  // --- Write hooks
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeSwap, data: swapHash } = useWriteContract();

  const { isLoading: approving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });
  const {
    isLoading: swapping,
    isSuccess: swapSuccess,
    data: swapReceipt,
  } = useWaitForTransactionReceipt({ hash: swapHash });

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

    // Detect if CORE is involved (either as input or output)
    const isCoreToErc20 = tokenIn === "0x00" && tokenOut !== "0x00";
    const isErc20ToCore = tokenIn !== "0x00" && tokenOut === "0x00";

    // Handle swapping from CORE (native) to ERC-20 (wrap CORE to WCORE)
    if (isCoreToErc20) {
      // const wrapData = encodeFunctionData({
      //   abi: routerAbi,
      //   functionName: "wrapWNativeToken",
      //   args: [amountInWei, from], // Wrap CORE to WCORE
      // });

      const swapData = encodeFunctionData({
        abi: routerAbi,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: WCORE_TOKEN_ADDRESS, // Use WCORE for the swap
            tokenOut: tokenOut,
            recipient: from,
            deadline: BigInt(Math.floor(Date.now() / 1000) + 600), // 10 min deadline
            amountIn: amountInWei,
            amountOutMinimum: minOut,
            limitSqrtPrice: 0n,
          },
        ],
      });

      // Perform wrapping (CORE to WCORE) and swapping in a single multicall
      writeSwap({
        address: MOLTEN_SWAP_ROUTER,
        abi: routerAbi,
        functionName: "multicall",
        args: [[swapData]],
      });
    }

    // Handle swapping from ERC-20 to CORE (unwrap WCORE to CORE)
    else if (isErc20ToCore) {
      const swapData = encodeFunctionData({
        abi: routerAbi,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn,
            tokenOut: WCORE_TOKEN_ADDRESS, // Swap ERC-20 to WCORE
            recipient: MOLTEN_SWAP_ROUTER,
            deadline: BigInt(Math.floor(Date.now() / 1000) + 600), // 10 min deadline
            amountIn: amountInWei,
            amountOutMinimum: minOut,
            limitSqrtPrice: 0n,
          },
        ],
      });

      const unwrapData = encodeFunctionData({
        abi: routerAbi,
        functionName: "unwrapWNativeToken",
        args: [minOut, from], // Unwrap WCORE to CORE
      });

      // Perform the swap to WCORE and unwrap to CORE in a single multicall
      writeSwap({
        address: MOLTEN_SWAP_ROUTER,
        abi: routerAbi,
        functionName: "multicall",
        args: [[swapData, unwrapData]],
      });
    }

    // If neither CORE token is involved, perform the regular ERC-20 to ERC-20 swap
    else {
      const swapData = encodeFunctionData({
        abi: routerAbi,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn,
            tokenOut,
            recipient: from,
            deadline: BigInt(Math.floor(Date.now() / 1000) + 600),
            amountIn: amountInWei,
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
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4 flex flex-row flex-wrap gap-2 items-center">
          <span>Swap {symbolIn || "…"}</span> <ArrowRightCircle size={24} />{" "}
          <span>{symbolOut || "…"}</span>
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
            {minOut ? Number(formatUnits(minOut, decimalsOut)).toFixed(3) : "…"}{" "}
            {symbolOut}
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
                <span>Approving {symbolIn}…</span>
              </>
            ) : (
              <>Approve {symbolIn}</>
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
