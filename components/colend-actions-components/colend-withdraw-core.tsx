"use client";

import React, { useEffect } from "react";
import { FaSpinner, FaCoins } from "react-icons/fa";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatEther, type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleFillIcon } from "@/components/icons";
import { ColendWithdrawCoreTxProps } from "@/lib/ai/tools/colend/colendWithdrawCore";
import { CHAIN_ID } from "@/lib/constants";

const CORE_SCAN_BASE = "https://scan.coredao.org/tx/";

const gatewayAbi = [
  {
    type: "function",
    name: "withdrawETH",
    stateMutability: "nonpayable",
    inputs: [
      { name: "pool", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [],
  },
] as const;

interface Props {
  tx: ColendWithdrawCoreTxProps; // returned directly from the tool
}

const ColendWithdrawCore: React.FC<Props> = ({ tx }) => {
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
    if (sendError) console.error("Withdraw send error:", sendError);
    if (isTxError) console.error("Withdraw tx failed or reverted:", receipt);
  }, [sendError, isTxError, receipt]);

  const handleWithdraw = () => {
    console.log("=== Colend withdrawETH ===");
    console.log("Wallet connected:", isConnected);
    console.log("From address:", from);
    console.log("Tx payload from tool:", tx);

    if (!isConnected || !from) {
      console.error("Wallet not connected");
      return;
    }

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
      functionName: "withdrawETH",
      args: [tx.poolAddress as Address, valueWei, from as Address],
      chainId: CHAIN_ID,
      account: from as Address,
    });

    console.log("Withdraw transaction submitted to wallet...");
  };

  const isButtonDisabled = isSending || isMining || isSuccess;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Withdraw CORE from Colend
        </h2>

        <div className="text-sm grid grid-cols-2 gap-y-2 mb-6">
          <span className="text-gray-400">Amount</span>
          <span className="text-right font-medium">
            {formatEther(BigInt(tx.amountInWei))} CORE
          </span>
        </div>

        <button
          disabled={isButtonDisabled}
          onClick={handleWithdraw}
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
            <span>Withdraw Complete</span>
          )}
          {isTxError && (
            <>
              <span className="text-red-500">✗</span>
              <span>Withdraw Failed</span>
            </>
          )}
          {!isSending && !txHash && !isSuccess && !isTxError && (
            <>
              <FaCoins className="text-sm" />
              Withdraw CORE
            </>
          )}
        </button>
      </div>

      {isSuccess && receipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Withdraw Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <Image src="/images/core.png" alt="CORE" width={28} height={28} />
            <span className="text-lg font-bold">
              {formatEther(BigInt(tx.amountInWei))} CORE
            </span>
          </div>
          <p className="text-gray-500 text-sm">from Colend</p>
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

export default ColendWithdrawCore;
