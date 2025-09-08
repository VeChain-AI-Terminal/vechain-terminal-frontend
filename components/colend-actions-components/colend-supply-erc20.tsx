// ColendSupplyErc20.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleFillIcon } from "@/components/icons";
import {
  ColendSupplyErc20Props,
  ColendSupplyErc20TxProps,
} from "@/lib/ai/tools/colend/colendSupplyErc20";
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

const ColendSupplyErc20: React.FC<ColendSupplyErc20Props> = ({
  tx,
  sendMessage,
}) => {
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
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [supplyHash, setSupplyHash] = useState<`0x${string}` | undefined>();
  const sentApproveRef = useRef(false);
  const sentSupplyRef = useRef(false);

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

  // Replace your single waiter with TWO waiters
  const approveWait = useWaitForTransactionReceipt({
    hash: approveHash,
    chainId: CHAIN_ID,
    confirmations: 1,
    query: { enabled: !!approveHash },
  });

  const supplyWait = useWaitForTransactionReceipt({
    hash: supplyHash,
    chainId: CHAIN_ID,
    confirmations: 1,
    query: { enabled: !!supplyHash },
  });

  // When wagmi hands you a new write hash, route it to the right bucket
  useEffect(() => {
    if (!writeHash) return;
    if (phase === "awaiting_wallet" || phase === "approving") {
      setApproveHash(writeHash);
    } else if (phase === "supplying") {
      setSupplyHash(writeHash);
    }
  }, [writeHash, phase]);

  useEffect(() => {
    if (sendError) {
      const errorMessage = (sendError as any)?.message || "Transaction error";

      if (errorMessage.includes("User rejected the request")) {
        setErrorMsg("User rejected the request");
        setPhase("error");

        sendMessage({
          role: "system",
          parts: [
            {
              type: "text",
              text: "User cancelled the transaction.",
            },
          ],
        });
      } else {
        console.error("[writeContract] error:", sendError);
        setErrorMsg(errorMessage);
        setPhase("error");
      }
    }
  }, [sendError, sendMessage]);

  // When APPROVE confirms, advance and send the approve message once
  useEffect(() => {
    if (!approveHash) return;

    if (approveWait.isError) {
      setErrorMsg("Approve failed or reverted");
      setPhase("error");
      return;
    }
    if (approveWait.isSuccess) {
      setLastApproveHash(approveHash);
      setPhase("approved");

      if (!sentApproveRef.current) {
        sentApproveRef.current = true;
        // Your separate approve message
        // sendMessage({
        //   role: "system",
        //   parts: [
        //     {
        //       type: "text",
        //       text: `Approval confirmed for ${tx.supply.tokenName}.`,
        //     },
        //   ],
        // });
      }
    }
  }, [approveHash, approveWait.isError, approveWait.isSuccess]);

  const parsedAmount = useMemo(() => {
    try {
      if (!amountHuman || typeof tokenDecimals !== "number") return undefined;
      return parseUnits(amountHuman, tokenDecimals);
    } catch {
      return undefined;
    }
  }, [amountHuman, tokenDecimals]);

  // Start the flow: write APPROVE
  const handleSupplyFlow = async () => {
    setErrorMsg("");
    sentApproveRef.current = false;
    sentSupplyRef.current = false;

    if (!isConnected || !from) return setErrorMsg("Connect your wallet first");
    if (typeof tokenDecimals !== "number")
      return setErrorMsg("Could not fetch token decimals");
    if (!parsedAmount) return setErrorMsg("Invalid amount for token decimals");

    try {
      setPhase("awaiting_wallet");
      await writeContract({
        address: asset,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, parsedAmount],
        chainId: CHAIN_ID,
        account: from as Address,
      });
      setPhase("approving");
    } catch (e: any) {
      console.error("[approve] error:", e);
      setErrorMsg(e?.message || "Approve failed");
      setPhase("error");
    }
  };

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
      } catch (e: any) {
        console.error("[supply] error:", e);
        setErrorMsg(e?.message || "Supply failed");
        setPhase("error");
      }
    };
    void doSupply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isAwaitingApproval =
    phase === "awaiting_wallet" ||
    phase === "approving" ||
    (!!approveHash && !approveWait.isSuccess && !approveWait.isError);

  const isAwaitingSupply =
    phase === "supplying" ||
    (!!supplyHash && !supplyWait.isSuccess && !supplyWait.isError);

  const isButtonDisabled =
    isSending ||
    phase === "approving" ||
    phase === "supplying" ||
    phase === "success";

  // When SUPPLY confirms, mark success and send the supply message once
  useEffect(() => {
    if (!supplyHash) return;

    if (supplyWait.isError) {
      setErrorMsg("Supply failed or reverted");
      setPhase("error");
      return;
    }
    if (supplyWait.isSuccess) {
      setLastSupplyHash(supplyHash);
      setPhase("success");

      if (!sentSupplyRef.current) {
        sentSupplyRef.current = true;
        sendMessage({
          role: "system",
          parts: [
            {
              type: "text",
              text: `Successfully supplied ${tx.supply.amount} ${tx.supply.tokenName} to Colend`,
            },
          ],
        });
      }
    }
  }, [supplyHash, supplyWait.isError, supplyWait.isSuccess]);

  function ButtonContent() {
    if (isAwaitingApproval) {
      return (
        <>
          <FaSpinner className="animate-spin" />
          Approving...
        </>
      );
    }
    if (isAwaitingSupply) {
      return (
        <>
          <FaSpinner className="animate-spin" />
          Supplying...
        </>
      );
    }
    if (phase === "success") {
      return (
        <>
          <FaCheck />
          Supplied
        </>
      );
    }
    if (phase === "error") {
      return (
        <>
          <FaTimes />
          Retry
        </>
      );
    }
    // idle or approved but not yet supplying
    return <>Approve then Supply</>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Supply {tx.supply.tokenName}
        </h2>

        <div className="text-sm grid grid-cols-2 gap-y-2 mb-4">
          <span className="text-gray-400">Token</span>
          <span className="text-right break-all">
            {tx.supply.tokenName} ({tokenSymbol ?? "..."})
          </span>

          <span className="text-gray-400">Amount</span>
          <span className="text-right">{amountHuman}</span>
        </div>

        {errorMsg && (
          <div className="text-red-400 text-sm mb-2">{errorMsg}</div>
        )}

        <button
          disabled={isButtonDisabled}
          onClick={handleSupplyFlow}
          className="mt-2 flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10"
        >
          <ButtonContent />
        </button>
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

      {/* ✅ Success UI */}
      {phase === "success" && supplyWait.data?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Supply Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">
              {amountHuman} {tokenSymbol ?? tx.supply.tokenName}
            </span>
          </div>
          <p className="text-gray-500 text-sm">on Colend</p>
          {lastSupplyHash && (
            <p>
              <Link
                href={`${CORE_SCAN_TX}${lastSupplyHash}`}
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

export default ColendSupplyErc20;
