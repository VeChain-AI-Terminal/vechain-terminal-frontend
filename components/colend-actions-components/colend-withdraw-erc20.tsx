"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { Address, parseUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleFillIcon } from "@/components/icons";
import {
  colendWithdrawErc20Props,
  ColendWithdrawErc20TxProps,
} from "@/lib/ai/tools/colend/colendWithdrawErc20";
import { CHAIN_ID } from "@/lib/constants";

const CORE_SCAN_TX = "https://scan.coredao.org/tx/";

const withdrawAbi = [
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [],
  },
] as const;

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
] as const;

type Phase = "idle" | "awaiting_wallet" | "withdrawing" | "success" | "error";

const ColendWithdrawErc20: React.FC<colendWithdrawErc20Props> = ({
  tx,
  sendMessage,
}) => {
  const { isConnected, address: from } = useAppKitAccount();

  const asset = tx.withdraw.tokenAddress as Address;
  const contractAddress = tx.withdraw.contractAddress as Address;
  const amountHuman = tx.withdraw.amount;

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentHash, setCurrentHash] = useState<`0x${string}` | undefined>();
  const [lastWithdrawHash, setLastWithdrawHash] = useState<`0x${string}`>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: asset,
        chainId: CHAIN_ID,
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: asset,
        chainId: CHAIN_ID,
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
    ],
    query: { enabled: !!asset },
  });

  const tokenDecimals: number | undefined = useMemo(() => {
    const v = metaData?.[0]?.result;
    return typeof v === "number" ? v : undefined;
  }, [metaData]);

  const tokenSymbol: string | undefined = useMemo(() => {
    const v = metaData?.[1]?.result;
    return typeof v === "string" ? v : undefined;
  }, [metaData]);

  const {
    writeContract,
    data: writeHash,
    isPending,
    error: sendError,
  } = useWriteContract();

  const { isSuccess, isError: isTxError } = useWaitForTransactionReceipt({
    hash: currentHash,
    chainId: CHAIN_ID,
    confirmations: 1,
    query: { enabled: !!currentHash },
  });

  useEffect(() => {
    if (!writeHash) return;
    setCurrentHash(writeHash);
  }, [writeHash]);

  useEffect(() => {
    if (sendError) {
      console.error("[withdraw] error:", sendError);
      setErrorMsg((sendError as any)?.message || "Transaction error");
      setPhase("error");
    }
  }, [sendError]);

  useEffect(() => {
    if (!currentHash) return;
    if (isTxError) {
      setErrorMsg("Transaction failed or reverted");
      setPhase("error");
    }
    if (isSuccess) {
      setLastWithdrawHash(currentHash);
      setPhase("success");
    }
  }, [isSuccess, isTxError, currentHash]);

  const parsedAmount = useMemo(() => {
    try {
      if (!amountHuman || typeof tokenDecimals !== "number") return undefined;
      return parseUnits(amountHuman, tokenDecimals);
    } catch {
      return undefined;
    }
  }, [amountHuman, tokenDecimals]);

  const handleWithdraw = async () => {
    setErrorMsg("");
    if (!isConnected || !from) {
      setErrorMsg("Connect your wallet first");
      return;
    }
    if (typeof tokenDecimals !== "number" || !parsedAmount) {
      setErrorMsg("Invalid token decimals/amount");
      return;
    }
    const receiver = from as `0x${string}`;
    try {
      setPhase("awaiting_wallet");
      await writeContract({
        address: contractAddress,
        abi: withdrawAbi,
        functionName: "withdraw",
        args: [asset, parsedAmount, receiver],
        chainId: CHAIN_ID,
        account: from as Address,
      });
      setPhase("withdrawing");
    } catch (e: any) {
      console.error("[withdraw] error:", e);
      setErrorMsg(e?.message || "Withdraw failed");
      setPhase("error");
    }
  };

  const isButtonDisabled =
    isPending || phase === "withdrawing" || phase === "success";
  useEffect(() => {
    if (phase === "success") {
      sendMessage({
        role: "system",
        parts: [
          {
            type: "text",
            text: `Successfully withdrawed ${tx.withdraw.amount} ${tx.withdraw.tokenName} from Colend`,
          },
        ],
      });
    }
  }, [phase]);
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Withdraw {tx.withdraw.tokenName}
        </h2>

        <div className="text-sm grid grid-cols-2 gap-y-2 mb-4">
          <span className="text-gray-400">Token</span>
          <span className="text-right">
            {tx.withdraw.tokenName} ({tokenSymbol ?? "..."})
          </span>

          <span className="text-gray-400">Amount</span>
          <span className="text-right">{amountHuman}</span>
        </div>

        {errorMsg && (
          <div className="text-red-400 text-sm mb-2">{errorMsg}</div>
        )}

        <button
          disabled={isButtonDisabled}
          onClick={handleWithdraw}
          className="mt-2 flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin" />
              {phase === "awaiting_wallet" ? "Confirming..." : "Withdrawing..."}
            </>
          ) : phase === "success" ? (
            <>
              <FaCheck />
              Withdrawn
            </>
          ) : phase === "error" ? (
            <>
              <FaTimes />
              Retry
            </>
          ) : (
            "Withdraw"
          )}
        </button>

        <div className="text-xs text-gray-400 mt-3 space-y-1">
          {lastWithdrawHash && (
            <div>
              Withdraw tx:{" "}
              <Link
                href={`${CORE_SCAN_TX}${lastWithdrawHash}`}
                target="_blank"
                className="underline text-blue-500"
              >
                {lastWithdrawHash}
              </Link>
            </div>
          )}
          <div>Phase: {phase}</div>
        </div>
      </div>

      {/* ✅ Success UI */}
      {phase === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Withdraw Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">
              {amountHuman} {tokenSymbol ?? tx.withdraw.tokenName}
            </span>
          </div>
          <p className="text-gray-500 text-sm">from Colend</p>
          {lastWithdrawHash && (
            <p>
              <Link
                href={`${CORE_SCAN_TX}${lastWithdrawHash}`}
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
};

export default ColendWithdrawErc20;
