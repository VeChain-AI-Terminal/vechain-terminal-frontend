// ColendSupplyErc20.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import { ColendSupplyErc20TxProps } from "@/lib/ai/tools/colend/colendSupplyErc20";
import { CHAIN_ID } from "@/lib/constants";

const CORE_SCAN_TX = "https://scan.coredao.org/tx/";

const poolAbi = [
  {
    type: "function",
    name: "supply",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
] as const;

// Minimal ERC20 meta ABI
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

type Phase =
  | "idle"
  | "awaiting_wallet"
  | "approving"
  | "approved"
  | "supplying"
  | "success"
  | "error";

interface Props {
  tx: ColendSupplyErc20TxProps; // payload from colendSupplyErc20 tool
}

const ColendSupplyErc20: React.FC<Props> = ({ tx }) => {
  const { isConnected, address: from } = useAppKitAccount();

  const asset = tx.supply.tokenAddress as Address;
  const spender = tx.approval.spender as Address;
  const poolAddress = tx.supply.poolAddress as Address;
  const amountHuman = tx.supply.amount;
  const referralCode = tx.supply.referralCode ?? 0;

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentHash, setCurrentHash] = useState<`0x${string}` | undefined>();
  const [lastApproveHash, setLastApproveHash] = useState<`0x${string}`>();
  const [lastSupplyHash, setLastSupplyHash] = useState<`0x${string}`>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Fetch token decimals & symbol for the provided asset
  const { data: metaData, isFetching: metaLoading } = useReadContracts({
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
    console.log("decimals -----", v);
    return typeof v === "number" ? v : undefined;
  }, [metaData]);

  const tokenSymbol: string | undefined = useMemo(() => {
    const v = metaData?.[1]?.result;
    return typeof v === "string" ? v : undefined;
  }, [metaData]);

  const {
    writeContract,
    data: writeHash,
    isPending: isSending,
    error: sendError,
  } = useWriteContract();

  const {
    isLoading: isMining,
    isSuccess,
    isError: isTxError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: currentHash,
    chainId: CHAIN_ID,
    confirmations: 1,
    query: { enabled: !!currentHash },
  });

  // Track latest tx hash emitted by writeContract
  useEffect(() => {
    if (!writeHash) return;
    setCurrentHash(writeHash);
  }, [writeHash]);

  // Global error logger
  useEffect(() => {
    if (sendError) {
      console.error("[writeContract] error:", sendError);
      setErrorMsg((sendError as any)?.message || "Transaction error");
      setPhase("error");
    }
  }, [sendError]);

  // Observe receipt state transitions
  useEffect(() => {
    if (!currentHash) return;

    if (isTxError) {
      console.error("[tx] failed:", currentHash, receipt);
      setErrorMsg("Transaction failed or reverted");
      setPhase("error");
    }
    if (isSuccess) {
      if (phase === "approving" || phase === "awaiting_wallet") {
        setLastApproveHash(currentHash);
        setPhase("approved");
      } else if (phase === "supplying") {
        setLastSupplyHash(currentHash);
        setPhase("success");
      }
    }
  }, [isMining, isSuccess, isTxError, receipt, currentHash, phase]);

  // Convert amount using fetched decimals
  const parsedAmount = useMemo(() => {
    try {
      if (!amountHuman || typeof tokenDecimals !== "number") return undefined;
      return parseUnits(amountHuman, tokenDecimals);
    } catch {
      return undefined;
    }
  }, [amountHuman, tokenDecimals]);

  const handleSupplyFlow = async () => {
    setErrorMsg("");

    if (!isConnected || !from) {
      setErrorMsg("Connect your wallet first");
      return;
    }
    if (typeof tokenDecimals !== "number") {
      setErrorMsg("Could not fetch token decimals");
      return;
    }
    if (!parsedAmount) {
      setErrorMsg("Invalid amount for token decimals");
      return;
    }

    try {
      // 1) Approve unlimited (amount provided by tool, usually MAX_UINT256)
      setPhase("awaiting_wallet");
      await writeContract({
        address: asset,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, parsedAmount], // parsed from supply.amount + decimals
        chainId: CHAIN_ID,
        account: from as Address,
      });
      setPhase("approving");
    } catch (e: any) {
      console.error("[approve] error:", e);
      setErrorMsg(e?.message || "Approve failed");
      setPhase("error");
      return;
    }
  };

  // After approval confirmed, auto send supply
  useEffect(() => {
    const doSupply = async () => {
      if (phase !== "approved") return;
      if (!parsedAmount || !from) {
        setErrorMsg("Parsed amount or sender not available");
        setPhase("error");
        return;
      }
      try {
        setPhase("supplying");
        await writeContract({
          address: poolAddress,
          abi: poolAbi,
          functionName: "supply",
          args: [asset, parsedAmount, from as Address, referralCode],
          chainId: CHAIN_ID,
          account: from as Address,
        });
        // moves to success in receipt effect
      } catch (e: any) {
        console.error("[supply] error:", e);
        setErrorMsg(e?.message || "Supply failed");
        setPhase("error");
      }
    };
    void doSupply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isButtonDisabled =
    isSending ||
    isMining ||
    phase === "approving" ||
    phase === "supplying" ||
    phase === "success";

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Supply {tx.supply.tokenName}
        </h2>

        {/* Read-only summary from tool payload */}
        <div className="text-sm grid grid-cols-2 gap-y-2 mb-4">
          <span className="text-gray-400">Token</span>
          <span className="text-right break-all">
            {tx.supply.tokenName} ({tokenSymbol ?? "..."})
          </span>

          {/* <span className="text-gray-400">Token Address</span>
          <span className="text-right break-all">{asset}</span> */}

          <span className="text-gray-400">Amount</span>
          <span className="text-right">{amountHuman}</span>

          {/* <span className="text-gray-400">Pool (spender)</span>
          <span className="text-right break-all">{spender}</span> */}

          {/* <span className="text-gray-400">Referral</span>
          <span className="text-right">{referralCode}</span> */}

          {/* <span className="text-gray-400">Decimals</span>
          <span className="text-right">
            {metaLoading ? "Loading..." : tokenDecimals ?? "?"}
          </span> */}
        </div>

        {errorMsg && (
          <div className="text-red-400 text-sm mb-2">{errorMsg}</div>
        )}

        <button
          disabled={isButtonDisabled}
          onClick={handleSupplyFlow}
          className="mt-2 flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
        >
          {isSending || isMining ? (
            <>
              <FaSpinner className="animate-spin" />
              {phase === "approving" || phase === "awaiting_wallet"
                ? "Approving..."
                : "Supplying..."}
            </>
          ) : phase === "success" ? (
            <>
              <FaCheck />
              Supplied
            </>
          ) : phase === "error" ? (
            <>
              <FaTimes />
              Retry
            </>
          ) : (
            "Approve then Supply"
          )}
        </button>

        {/* Status rows */}
        <div className="text-xs text-gray-400 mt-3 space-y-1">
          {lastApproveHash && (
            <div>
              Approve tx:{" "}
              <Link
                href={`${CORE_SCAN_TX}${lastApproveHash}`}
                target="_blank"
                className="underline text-blue-500"
              >
                {lastApproveHash}
              </Link>
            </div>
          )}
          {lastSupplyHash && (
            <div>
              Supply tx:{" "}
              <Link
                href={`${CORE_SCAN_TX}${lastSupplyHash}`}
                target="_blank"
                className="underline text-blue-500"
              >
                {lastSupplyHash}
              </Link>
            </div>
          )}
          <div>Phase: {phase}</div>
        </div>
      </div>
    </div>
  );
};

export default ColendSupplyErc20;
