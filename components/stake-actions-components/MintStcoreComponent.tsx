import React, { useEffect } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { type Address, parseEther } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleFillIcon } from "@/components/icons";
import { CHAIN_ID } from "@/lib/constants";

// Contract + validator
const MINT_CONTRACT_ADDRESS =
  "0xf5fA1728bABc3f8D2a617397faC2696c958C3409" as const;
const VALIDATOR_ADDRESS = "0xf79efaceb93a83e114d4e2e957fa16d69380cc25" as const;

const stCoreAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      { name: "_validator", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

const MintStCoreComponent: React.FC = () => {
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
    chainId: CHAIN_ID, // mainnet
    confirmations: 1,
    query: { enabled: !!txHash },
  });

  // amount to mint (example: 1 CORE)
  const amountInWei = parseEther("1");

  const txConfig = {
    address: MINT_CONTRACT_ADDRESS as Address,
    abi: stCoreAbi,
    functionName: "mint",
    args: [VALIDATOR_ADDRESS, amountInWei] as const,
    value: amountInWei,
    chainId: CHAIN_ID,
    account: from as Address,
  } as const;

  useEffect(() => {
    if (sendError) console.error("Mint send error:", sendError);
    if (isTxError) console.error("Mint tx failed or reverted:", receipt);
  }, [sendError, isTxError, receipt]);

  const handleMint = () => {
    if (!isConnected) {
      console.error("Wallet not connected");
      return;
    }
    writeContract({ ...txConfig });
  };

  const isButtonDisabled = isSending || isMining || isSuccess;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-6">Mint stCORE</h2>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Validator</span>
          <span>
            {VALIDATOR_ADDRESS.slice(0, 6)}...{VALIDATOR_ADDRESS.slice(-4)}
          </span>
        </div>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Amount</span>
          <span>1 CORE</span>
        </div>

        <div className="mb-6 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Network</span>
          <span className="flex items-center gap-1">
            <Image src="/images/core.png" alt="Core" width={20} height={20} />
            <span>Core Blockchain Mainnet</span>
          </span>
        </div>

        <button
          disabled={isButtonDisabled}
          onClick={handleMint}
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
            <span>Mint Complete</span>
          )}
          {isTxError && (
            <>
              <span className="text-red-500">✗</span>
              <span>Mint Failed</span>
            </>
          )}
          {!isSending && !txHash && !isSuccess && !isTxError && (
            <>
              <FaSyncAlt className="text-sm" />
              Mint stCORE
            </>
          )}
        </button>
      </div>

      {isSuccess && receipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Mint Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <Image src="/images/core.png" alt="Core" width={28} height={28} />
            <span className="text-lg font-bold">1 CORE → stCORE</span>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Validator {VALIDATOR_ADDRESS.slice(0, 6)}...
            {VALIDATOR_ADDRESS.slice(-4)}
          </p>
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

export default MintStCoreComponent;
