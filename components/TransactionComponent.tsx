import React, { useState } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import { useSendTransaction, useEstimateGas } from "wagmi";
import { parseEther, type Address, formatEther } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";

export type TransactionComponentProps = {
  from: string;
  to: string;
  value: string;
  chainId: number;
};

const chainIdToName = {
  1114: "Core Blockchain Testnet 2",
  1116: "Core Blockchain Mainnet",
};
const chainIdToToken = {
  1114: "tCORE2",
  1116: "CORE",
};
const TransactionComponent: React.FC<TransactionComponentProps> = ({
  from,
  to,
  value,
  chainId,
}) => {
  const { address, isConnected } = useAppKitAccount();
  // Convert hex wei → decimal ether string
  const decimalValue = formatEther(BigInt(value)); // e.g., "1.0"

  const txConfig = {
    to: to as Address,
    value: parseEther(decimalValue), // back to BigInt
    chainId,
  };

  const { data: gasEstimate } = useEstimateGas(txConfig);
  const { sendTransaction } = useSendTransaction();

  const [isLoading, setIsLoading] = useState(false); // 🔥 NEW

  const handleSendTx = () => {
    if (!isConnected) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsLoading(true); // 🔥 Start loading

      sendTransaction({
        ...txConfig,
        gas: gasEstimate,
      });
    } catch (err) {
      console.error("Error sending transaction:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 3000); // 🔥 Reset after a delay or hook to status
    }
  };

  const networkName =
    chainIdToName[chainId as keyof typeof chainIdToName] || chainId;

  const token =
    chainIdToToken[chainId as keyof typeof chainIdToToken] || "CORE";

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full  border border-zinc-700">
      <h2 className="text-xl font-semibold mb-6">Transaction</h2>

      <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
        <span className="text-gray-400">From</span>
        <span className="flex items-center gap-2 ">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600" />
          {from}
        </span>
      </div>

      <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
        <span className="text-gray-400">To</span>
        <span className="flex items-center gap-2 ">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
          {to}
        </span>
      </div>

      <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
        <span className="text-gray-400">Value</span>
        <span className="text-white">
          {decimalValue} {token}
        </span>
      </div>

      <div className="mb-6 flex justify-between items-center border-b border-zinc-700 pb-3">
        <span className="text-gray-400">Network</span>
        <span className="flex items-center gap-1 text-white">
          <Image src="/images/core.png" alt="Core" width={20} height={20} />
          <span>{networkName}</span>
        </span>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          onClick={handleSendTx}
          className="flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full h-10 "
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Confirm transaction...</span>
            </>
          ) : (
            <>
              <FaSyncAlt className="text-sm" />
              Execute Transaction
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TransactionComponent;
