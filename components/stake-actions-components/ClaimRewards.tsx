"use client";

import React, { useEffect } from "react";
import { FaSpinner, FaGift } from "react-icons/fa";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatEther, type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleFillIcon } from "@/components/icons";
import { toast } from "sonner";
import { ClaimRewardsComponentProps } from "@/lib/ai/tools/core-staking-actions/makeClaimRewardsTransaction";
import {
  MAINNET_PLEDGEAGENT_CONTRACT_ADDRESS,
  TESTNET_PLEDGEAGENT_CONTRACT_ADDRESS,
} from "@/lib/constants";

// Replace with your actual PledgeAgent addresses
const chainIdToPledgeAgent: Record<number, string> = {
  1114: TESTNET_PLEDGEAGENT_CONTRACT_ADDRESS,
  1116: MAINNET_PLEDGEAGENT_CONTRACT_ADDRESS,
};

const pledgeAgentAbi = [
  {
    type: "function",
    name: "claimReward",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentList", type: "address[]" }],
    outputs: [
      { name: "amountClaimed", type: "uint256" },
      { name: "allRewardsClaimed", type: "bool" },
    ],
  },
] as const;

const chainIdToName = {
  1114: "Core Blockchain Testnet 2",
  1116: "Core Blockchain Mainnet",
} as const;

const chainIdToToken = {
  1114: "tCORE2",
  1116: "CORE",
} as const;

const ClaimRewardsComponent: React.FC<ClaimRewardsComponentProps> = ({
  candidateAddress,
  candidateName,
  humanReadableValue,
  valueInWei,
  chainId,
  sendMessage,
}) => {
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
    chainId,
    confirmations: 1,
    query: { enabled: !!txHash },
  });

  const decimalValue = formatEther(BigInt(valueInWei));
  const token =
    chainIdToToken[chainId as keyof typeof chainIdToToken] || "CORE";
  const networkName =
    chainIdToName[chainId as keyof typeof chainIdToName] || String(chainId);

  const txConfig = {
    address: chainIdToPledgeAgent[chainId] as Address,
    abi: pledgeAgentAbi,
    functionName: "claimReward",
    args: [[candidateAddress as Address]],
    chainId,
    account: from as Address,
  } as const;

  useEffect(() => {
    if (sendError) {
      console.error("Claim rewards send error:", sendError);
      if (sendError.message.includes("User rejected the request")) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error("Transaction failed: " + sendError.message);
      }
    }
    if (isTxError)
      console.error("Claim rewards tx failed or reverted:", receipt);
  }, [sendError, isTxError, receipt]);

  const handleClaim = () => {
    if (!isConnected) {
      console.error("Wallet not connected");
      return;
    }
    writeContract(txConfig);
  };

  const isButtonDisabled = isSending || isMining || isSuccess;
  useEffect(() => {
    if (isSuccess && receipt?.status === "success") {
      sendMessage({
        role: "system",
        parts: [
          {
            type: "text",
            text: `Successfully claimed ${humanReadableValue} ${token} CORE from ${candidateName}`,
          },
        ],
      });
    }
  }, [isSuccess, receipt]);
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-6">Claim Rewards</h2>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Candidate</span>
          <span>{candidateName || candidateAddress}</span>
        </div>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Reward</span>
          <span>
            {decimalValue} {token}
          </span>
        </div>

        <div className="mb-6 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Network</span>
          <span className="flex items-center gap-1">
            <Image src="/images/core.png" alt="Core" width={20} height={20} />
            <span>{networkName}</span>
          </span>
        </div>

        <button
          disabled={isButtonDisabled}
          onClick={handleClaim}
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
            <span>Claim Complete</span>
          )}
          {isTxError && (
            <>
              <span className="text-red-500">✗</span>
              <span>Claim Failed</span>
            </>
          )}
          {!isSending && !txHash && !isSuccess && !isTxError && (
            <>
              <FaGift className="text-sm" />
              Claim Rewards
            </>
          )}
        </button>
      </div>

      {isSuccess && receipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Claim Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <Image src="/images/core.png" alt="Core" width={28} height={28} />
            <span className="text-lg font-bold">
              {decimalValue} {token}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            claimed from{" "}
            <span className="font-medium">
              {candidateName || candidateAddress}
            </span>
          </p>
          <p className="text-gray-400 text-xs mt-2">on {networkName}</p>
          <p>
            <Link
              href={`https://scan.coredao.org/tx/${txHash}`}
              target="_blank"
              className="underline text-blue-600 text-sm"
            >
              View on block explorer
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClaimRewardsComponent;
