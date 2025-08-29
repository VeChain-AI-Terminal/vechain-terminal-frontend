import React, { useEffect } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import {
  useSendTransaction,
  useEstimateGas,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, type Address, formatEther } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckCircleFillIcon } from "@/components/icons";

export type TransactionComponentProps = {
  from: string;
  receiver_address: string;
  receiver_ensName?: string;
  value: string; // wei as hex or decimal string
  chainId: number;
};

const chainIdToName = {
  1114: "Core Blockchain Testnet 2",
  1116: "Core Blockchain Mainnet",
} as const;

const chainIdToToken = {
  1114: "tCORE2",
  1116: "CORE",
} as const;

const TransactionComponent: React.FC<TransactionComponentProps> = ({
  from,
  receiver_address,
  receiver_ensName,
  value,
  chainId,
}) => {
  // console.log("recever_address", receiver_address);
  const { isConnected } = useAppKitAccount();

  // value is in wei → human
  const decimalValue = formatEther(BigInt(value));

  const txConfig = {
    account: from as Address, // important for gas estimate
    to: receiver_address as Address,
    value: parseEther(decimalValue),
    chainId,
  } as const;

  const { data: gasEstimate } = useEstimateGas(txConfig);

  const {
    sendTransaction,
    data: txHash, // 0x... once submitted
    isPending: isSending, // waiting for wallet signature
    error: sendError,
  } = useSendTransaction();

  // Wait for 1 confirmation
  const {
    isLoading: isMining, // tx included but waiting for confirmations
    isSuccess,
    isError: isTxError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
    confirmations: 1,
    query: { enabled: !!txHash }, // start only after submit
  });

  useEffect(() => {
    if (sendError) console.error("Send error:", sendError);
    if (isTxError) console.error("Tx failed or reverted:", receipt);
  }, [sendError, isTxError, receipt]);

  const handleSendTx = () => {
    if (!isConnected) {
      console.error("Wallet not connected");
      return;
    }
    sendTransaction({
      ...txConfig,
      // optional: add a safety margin to gas if you like
      gas: gasEstimate,
    });
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  const networkName =
    chainIdToName[chainId as keyof typeof chainIdToName] || String(chainId);
  const token =
    chainIdToToken[chainId as keyof typeof chainIdToToken] || "CORE";

  const isButtonDisabled = isSending || isMining || isSuccess;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-6">Transaction</h2>
        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">From</span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600" />
            {shortenAddress(from)}
          </span>
        </div>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">To</span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
            {receiver_ensName
              ? receiver_ensName
              : shortenAddress(receiver_address)}
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
            disabled={isButtonDisabled}
            onClick={handleSendTx}
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
              <>
                <span>Transaction Complete</span>
              </>
            )}
            {isTxError && (
              <>
                <span className="text-red-500">✗</span>
                <span>Transaction Failed</span>
              </>
            )}
            {!isSending && !txHash && !isSuccess && !isTxError && (
              <>
                <FaSyncAlt className="text-sm" />
                Execute Transaction
              </>
            )}
          </button>
        </div>
      </div>

      {isSuccess && receipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Transaction Successful</h3>

          <div className="flex items-center gap-2 mb-1">
            {/* Token icon */}
            <Image
              src="/images/core.png" // Replace with correct token icon path
              alt="USDC"
              width={28}
              height={28}
            />
            <span className="text-lg font-bold">
              {decimalValue} {token}
            </span>
          </div>

          <p className="text-gray-500 text-sm ">
            sent to{" "}
            <span className="font-medium">
              {receiver_ensName
                ? receiver_ensName
                : shortenAddress(receiver_address)}
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

export default TransactionComponent;
