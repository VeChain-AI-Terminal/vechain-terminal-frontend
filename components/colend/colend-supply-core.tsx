// SupplyCore.tsx
"use client";

import React, { useEffect } from "react";
import { FaSpinner, FaCoins } from "react-icons/fa";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatEther, type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleFillIcon } from "@/components/icons";
import { ColendSupplyCoreTxProps } from "@/lib/ai/tools/colend/colendSupplyCore";
// import type { ColendSupplyCoreTxProps } from "@/lib/ai/tools/supply-core"; // <- use your actual path
import { CHAIN_ID } from "@/lib/constants";

const CORE_SCAN_BASE = "https://scan.coredao.org/tx/";

const gatewayAbi = [
  {
    type: "function",
    name: "depositETH",
    stateMutability: "payable",
    inputs: [
      { name: "pool", type: "address" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
] as const;

interface Props {
  tx: ColendSupplyCoreTxProps; // returned directly from the tool
}

const ColendSupplyCore: React.FC<Props> = ({ tx }) => {
  const { isConnected, address: from } = useAppKitAccount();

  const {
    writeContract,
    data: txHash,
    isPending: isSending,
    error: sendError,
  } = useWriteContract();

  const {
    isLoading: isMining,
    isSuccess,
    isError: isTxError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: CHAIN_ID,
    confirmations: 1,
    query: { enabled: !!txHash },
  });

  useEffect(() => {
    if (sendError) console.error("Deposit send error:", sendError);
    if (isTxError) console.error("Deposit tx failed or reverted:", receipt);
  }, [sendError, isTxError, receipt]);

  const handleDeposit = () => {
    console.log("=== Colend depositETH ===");
    console.log("Wallet connected:", isConnected);
    console.log("From address:", from);
    console.log("Tx payload from tool:", tx);

    if (!isConnected || !from) {
      console.error("Wallet not connected");
      return;
    }

    // amountInWei is a decimal string; viem expects bigint for `value`
    let valueWei: bigint;
    try {
      valueWei = BigInt(tx.amountInWei);
    } catch (e) {
      console.error("Invalid amountInWei from tool:", tx.amountInWei, e);
      return;
    }

    writeContract({
      address: tx.gatewayAddress as Address,
      abi: gatewayAbi,
      functionName: "depositETH",
      args: [tx.poolAddress as Address, from as Address, tx.referralCode],
      value: valueWei,
      chainId: CHAIN_ID,
      account: from as Address,
    });

    console.log("Transaction submitted to wallet...");
  };

  const isButtonDisabled = isSending || isMining || isSuccess;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Supply CORE to Colend</h2>

        {/* Read-only summary from tool payload */}
        <div className="text-sm grid grid-cols-2 gap-y-2 mb-6">
          <span className="text-gray-400">Gateway</span>
          <span className="text-right break-all">{tx.gatewayAddress}</span>

          <span className="text-gray-400">Pool</span>
          <span className="text-right break-all">{tx.poolAddress}</span>

          <span className="text-gray-400">Referral</span>
          <span className="text-right">{tx.referralCode}</span>

          <span className="text-gray-400">Amount</span>
          <span className="text-right font-medium">
            {formatEther(BigInt(tx.amountInWei))} CORE
          </span>
        </div>

        <button
          disabled={isButtonDisabled}
          onClick={handleDeposit}
          className="flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
        >
          {isSending && (
            <>
              <FaSpinner className="animate-spin" />
              <span>Awaiting wallet confirmation...</span>
            </>
          )}
          {txHash && !isSuccess && !isTxError && !isSending && (
            <>
              <FaSpinner className="animate-spin" />
              <span>Waiting for confirmations...</span>
            </>
          )}
          {isSuccess && receipt?.status === "success" && (
            <span>Supply Complete</span>
          )}
          {isTxError && (
            <>
              <span className="text-red-500">✗</span>
              <span>Supply Failed</span>
            </>
          )}
          {!isSending && !txHash && !isSuccess && !isTxError && (
            <>
              <FaCoins className="text-sm" />
              Supply CORE
            </>
          )}
        </button>
      </div>

      {isSuccess && receipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Supply Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <Image src="/images/core.png" alt="CORE" width={28} height={28} />
            <span className="text-lg font-bold">
              {formatEther(BigInt(tx.amountInWei))} CORE
            </span>
          </div>
          <p className="text-gray-500 text-sm">on Colend</p>
          <p>
            <Link
              href={`${CORE_SCAN_BASE}${txHash}`}
              target="_blank"
              className="underline text-blue-600 text-sm"
            >
              View on CoreScan
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ColendSupplyCore;
