"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { Address, erc20Abi, isAddress, parseUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";

const CORE_CHAIN_ID = 1116;
const CORE_SCAN_TX = "https://scan.coredao.org/tx/";

// Fixed Pool address you provided
const POOL_ADDRESS = "0x971A4AD43a98a0d17833aB8c9FeC25b93a38B9A3" as Address;

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

const SupplyErc20Component: React.FC = () => {
  const { isConnected, address: from } = useAppKitAccount();

  // User inputs
  const [asset, setAsset] = useState<string>("");
  const [amountHuman, setAmountHuman] = useState<string>("");
  const [onBehalfOf, setOnBehalfOf] = useState<string>(
    "0x8f54751F441B7707AbA668f0cF4745daAE545D16"
  );
  const [referralCode, setReferralCode] = useState<string>("0");

  // Tx state
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentHash, setCurrentHash] = useState<`0x${string}` | undefined>();
  const [lastApproveHash, setLastApproveHash] = useState<`0x${string}`>();
  const [lastSupplyHash, setLastSupplyHash] = useState<`0x${string}`>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Fetch token decimals and symbol when asset is a valid address
  const readEnabled = !!asset && isAddress(asset);
  const {
    data: metaData,
    error: metaErr,
    isFetching: metaLoading,
  } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: asset as Address,
        chainId: CORE_CHAIN_ID,
        abi: erc20MetaAbi,
        functionName: "decimals",
      },
      {
        address: asset as Address,
        chainId: CORE_CHAIN_ID,
        abi: erc20MetaAbi,
        functionName: "symbol",
      },
    ],
    query: { enabled: readEnabled },
  });

  const tokenDecimals: number | undefined = useMemo(() => {
    const v = metaData?.[0]?.result;
    console.log("v ----", v);
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
    chainId: CORE_CHAIN_ID,
    confirmations: 1,
    query: { enabled: !!currentHash },
  });

  // Track latest tx hash emitted by writeContract
  useEffect(() => {
    if (!writeHash) return;
    // console.log("[writeContract] tx hash:", writeHash);
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

    if (isMining) {
      // console.log("[tx] mining:", currentHash);
    }
    if (isTxError) {
      console.error("[tx] failed:", currentHash, receipt);
      setErrorMsg("Transaction failed or reverted");
      setPhase("error");
    }
    if (isSuccess) {
      console.log("[tx] success");
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
      if (!amountHuman) return undefined;
      if (typeof tokenDecimals !== "number") return undefined;
      const amt = parseUnits(amountHuman, tokenDecimals);
      return amt;
    } catch {
      return undefined;
    }
  }, [amountHuman, tokenDecimals]);

  const handleSupplyFlow = async () => {
    setErrorMsg("");

    console.log("=== Supply flow start ===");
    // console.log("connected:", isConnected);
    // console.log("from:", from);
    // console.log("asset:", asset);
    // console.log("symbol:", tokenSymbol);
    console.log("decimals:", tokenDecimals);
    console.log("amountHuman:", amountHuman);
    // console.log("onBehalfOf:", onBehalfOf);
    // console.log("referralCode:", referralCode);

    if (!isConnected) {
      setErrorMsg("Connect your wallet first");
      return;
    }
    if (!asset || !onBehalfOf || !amountHuman) {
      setErrorMsg("Fill all fields");
      return;
    }
    if (!isAddress(asset)) {
      setErrorMsg("Asset must be a valid address");
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
      // 1) Approve
      console.log("[approve] sending approve for", parsedAmount.toString());
      setPhase("awaiting_wallet");
      await writeContract({
        address: asset as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [POOL_ADDRESS, parsedAmount],
        chainId: CORE_CHAIN_ID,
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
      if (!parsedAmount) {
        setErrorMsg("Parsed amount not available");
        setPhase("error");
        return;
      }
      console.log("[supply] approval confirmed. sending supply...");
      try {
        setPhase("supplying");
        await writeContract({
          address: POOL_ADDRESS,
          abi: poolAbi,
          functionName: "supply",
          args: [
            asset as Address,
            parsedAmount,
            onBehalfOf as Address,
            Number(referralCode) || 0,
          ],
          chainId: CORE_CHAIN_ID,
          account: from as Address,
        });
        // phase will move to success when receipt hook flips
      } catch (e: any) {
        console.error("[supply] error:", e);
        setErrorMsg(e?.message || "Supply failed");
        setPhase("error");
      }
    };
    doSupply();
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
        <h2 className="text-xl font-semibold mb-4">Supply ERC20 to Pool</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Asset token address (e.g. USDT)"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
          />

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Amount in human units (e.g. 1.5)"
              value={amountHuman}
              onChange={(e) => setAmountHuman(e.target.value)}
              className="w-1/2 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="onBehalfOf address"
              value={onBehalfOf}
              onChange={(e) => setOnBehalfOf(e.target.value)}
              className="w-1/2 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
            />
          </div>

          <input
            type="number"
            placeholder="Referral code (usually 0)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
          />

          <div className="text-xs text-gray-400">
            {metaLoading && isAddress(asset)
              ? "Fetching token meta..."
              : tokenDecimals !== undefined
              ? `Token: ${tokenSymbol ?? ""} • Decimals: ${tokenDecimals}`
              : asset && !isAddress(asset)
              ? "Enter a valid token address"
              : asset
              ? "Could not fetch token meta"
              : "Paste an ERC20 address to fetch token meta"}
          </div>
        </div>

        {errorMsg && (
          <div className="text-red-400 text-sm mt-3">{errorMsg}</div>
        )}

        <button
          disabled={isButtonDisabled}
          onClick={handleSupplyFlow}
          className="mt-4 flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
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
          <div>Pool: {POOL_ADDRESS}</div>
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

export default SupplyErc20Component;
