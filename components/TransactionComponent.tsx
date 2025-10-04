import React, { useEffect, useState } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import {
  useWallet,
  useSendTransaction,
} from "@vechain/vechain-kit";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckCircleFillIcon } from "@/components/icons";

export type TransactionComponentProps = {
  from: string;
  receiver_address?: string;
  receiver_ensName?: string;
  value: string; // wei as decimal string
  network: "main" | "test";
  clauses: Array<{
    to: string;
    value: string;
    data: string;
    comment?: string;
  }>;
  // Contract interaction props
  contractAddress?: string;
  functionName?: string;
  functionArgs?: any[];
  data?: string;
  gasLimit?: number;
  comment?: string;
  type: "simple_transfer" | "contract_interaction" | "bridge_transaction" | "token_transfer" | "token_approval";
  // Token specific props
  tokenAddress?: string;
  tokenSymbol?: string;
  amount?: string; // Human readable amount
  spender?: string; // For approvals
  to?: string; // For token transfers
  // Bridge transaction props
  bridgeDetails?: {
    fromChain: string;
    toChain: string;
    amount: string;
    recipient: string;
    gatewayAddress: string;
  };
  approveRequired?: {
    token: string;
    spender: string;
    amount: string;
  };
  receiveAmount?: string;
  instructions?: string[];
};

const networkToName = {
  test: "VeChain Testnet",
  main: "VeChain Mainnet",
} as const;

const networkToToken = {
  test: "VET",
  main: "VET",
} as const;

const TransactionComponent: React.FC<TransactionComponentProps> = ({
  from,
  receiver_address,
  receiver_ensName,
  value,
  network,
  clauses,
  contractAddress,
  functionName,
  functionArgs,
  data,
  gasLimit,
  comment,
  type,
  tokenAddress,
  tokenSymbol,
  amount,
  spender,
  to,
  bridgeDetails,
  approveRequired,
  receiveAmount,
  instructions,
}) => {
  const { account, connection } = useWallet();
  const [txId, setTxId] = useState<string | null>(null);

  // Debug: Log the clauses to see what's being passed
  console.log("TransactionComponent clauses:", clauses);
  console.log("TransactionComponent props:", { from, value, network, type });

  // Use the clauses provided by our tools (they're already properly formatted)
  // If no clauses are provided, we can't proceed with the transaction
  const transactionClauses = clauses && clauses.length > 0 ? clauses : [];
  
  // Validate that we have clauses before proceeding
  const hasValidClauses = transactionClauses && transactionClauses.length > 0;
  
  // Extra debugging
  console.log("TransactionComponent transactionClauses:", transactionClauses);
  console.log("TransactionComponent hasValidClauses:", hasValidClauses);

  // Configure useSendTransaction without clauses - clauses go to sendTransaction call
  const sendTxConfig = {
    signerAccountAddress: account?.address || from,
    onTxConfirmed: () => {
      console.log("Transaction confirmed");
    },
    onTxFailedOrCancelled: (error: unknown) => {
      console.error("Transaction failed or cancelled:", error);
    },
  };
  
  console.log("useSendTransaction config:", sendTxConfig);
  console.log("Clauses to be sent:", transactionClauses);

  const {
    sendTransaction,
    isTransactionPending: isSending,
    isWaitingForWalletConfirmation: isMining,
    txReceipt,
    status,
    error: sendError,
  } = useSendTransaction(sendTxConfig);

  const isSuccess = status === "success";
  const isTxError = status === "error"

  useEffect(() => {
    if (sendError) {
      console.error("Send error:", sendError);
    }
  }, [sendError]);

  useEffect(() => {
    if (txReceipt?.meta?.txID) {
      setTxId(txReceipt.meta.txID);
    }
  }, [txReceipt]);

  const handleSendTx = async () => {
    if (!connection.isConnected || !account) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!hasValidClauses) {
      console.error("No valid transaction clauses provided");
      return;
    }
    
    // Debug: Log clauses right before sending
    console.log("handleSendTx: About to send transaction with clauses:", transactionClauses);
    
    try {
      // Pass clauses directly to sendTransaction call, not in hook config
      await sendTransaction(transactionClauses);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  const networkName = networkToName[network];
  const token = networkToToken[network];

  const isButtonDisabled = isSending || isMining || isSuccess || !hasValidClauses;

  const getTransactionTitle = () => {
    switch (type) {
      case "token_transfer":
        return `Transfer ${tokenSymbol || 'Token'}`;
      case "token_approval":
        return `Approve ${tokenSymbol || 'Token'}`;
      case "contract_interaction":
        return functionName ? `${functionName}()` : "Contract Interaction";
      case "bridge_transaction":
        return "Bridge Transaction";
      default:
        return "VET Transfer";
    }
  };

  const getDestinationDisplay = () => {
    switch (type) {
      case "token_transfer":
        return to ? shortenAddress(to) : "Unknown";
      case "token_approval":
        return spender ? shortenAddress(spender) : "Unknown";
      case "contract_interaction":
        return contractAddress ? shortenAddress(contractAddress) : 
               tokenAddress ? shortenAddress(tokenAddress) : "Unknown";
      case "bridge_transaction":
        return bridgeDetails ? `${shortenAddress(bridgeDetails.recipient)} (${bridgeDetails.toChain})` : "Bridge";
      default:
        return receiver_ensName ? receiver_ensName : shortenAddress(receiver_address!);
    }
  };

  const getTransactionAmount = () => {
    switch (type) {
      case "token_transfer":
      case "token_approval":
        return amount ? `${amount} ${tokenSymbol || 'TOKEN'}` : "0";
      case "bridge_transaction":
        return bridgeDetails ? `${bridgeDetails.amount} ${bridgeDetails.fromChain}` : "0";
      default:
        const decimalValue = (parseFloat(value) / Math.pow(10, 18)).toString();
        return `${decimalValue} VET`;
    }
  };

  const getValueDisplay = () => {
    const decimalValue = (parseFloat(value) / Math.pow(10, 18)).toString();
    return `${decimalValue} VET`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-6">{getTransactionTitle()}</h2>
        
        {/* Comment/Description */}
        {comment && (
          <div className="mb-4 p-3 bg-zinc-800 rounded-lg">
            <p className="text-zinc-300 text-sm">{comment}</p>
          </div>
        )}

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">From</span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600" />
            {shortenAddress(from)}
          </span>
        </div>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">
            {type === "token_approval" ? "Spender" : "To"}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
            {getDestinationDisplay()}
          </span>
        </div>

        {/* Transaction Amount */}
        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Amount</span>
          <span className="text-white font-bold">
            {getTransactionAmount()}
          </span>
        </div>

        {/* Token/Contract Address for token operations */}
        {(type === "token_transfer" || type === "token_approval") && tokenAddress && (
          <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
            <span className="text-gray-400">Token Contract</span>
            <span className="text-white font-mono text-sm">
              {shortenAddress(tokenAddress)}
            </span>
          </div>
        )}

        {/* Function details for contract interactions */}
        {type === "contract_interaction" && functionName && (
          <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
            <span className="text-gray-400">Function</span>
            <span className="text-yellow-400 font-mono text-sm">
              {functionName}()
            </span>
          </div>
        )}

        {/* Bridge specific details */}
        {type === "bridge_transaction" && bridgeDetails && (
          <>
            <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
              <span className="text-gray-400">From Chain</span>
              <span className="text-white">{bridgeDetails.fromChain}</span>
            </div>
            <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
              <span className="text-gray-400">To Chain</span>
              <span className="text-white">{bridgeDetails.toChain}</span>
            </div>
            {receiveAmount && (
              <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
                <span className="text-gray-400">You&apos;ll Receive</span>
                <span className="text-green-400">{receiveAmount}</span>
              </div>
            )}
          </>
        )}

        {/* VET Value (only show if significant) */}
        {parseFloat(value) > 0 && (
          <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
            <span className="text-gray-400">VET Value</span>
            <span className="text-white">
              {getValueDisplay()}
            </span>
          </div>
        )}

        {/* Contract data indicator */}
        {data && data !== "0x" && (
          <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
            <span className="text-gray-400">Contract Data</span>
            <span className="text-yellow-400 text-sm">
              {data.slice(0, 10)}... ({data.length} chars)
            </span>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Network</span>
          <span className="flex items-center gap-1 text-white">
            <Image src="/images/vechain.png" alt="VeChain" width={20} height={20} />
            <span>{networkName}</span>
          </span>
        </div>

        {/* Approval warning */}
        {approveRequired && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ Token approval required first: {shortenAddress(approveRequired.token)}
            </p>
          </div>
        )}

        {/* Instructions */}
        {instructions && instructions.length > 0 && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm font-medium mb-2">Instructions:</p>
            <ol className="text-blue-300 text-xs space-y-1">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}
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
            {txId && isMining && !isSuccess && !isTxError && (
              <>
                <FaSpinner className="animate-spin" />
                <span>Mining transaction...</span>
              </>
            )}
            {isSuccess && (
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
            {!isSending && !txId && !isSuccess && !isTxError && (
              <>
                <FaSyncAlt className="text-sm" />
                Execute Transaction
              </>
            )}
          </button>
        </div>
      </div>

      {isSuccess && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Transaction Successful</h3>

          <div className="flex items-center gap-2 mb-1">
            <Image
              src="/images/vechain.png"
              alt="VeChain"
              width={28}
              height={28}
            />
            <span className="text-lg font-bold">
              {getTransactionAmount()}
            </span>
          </div>

          <p className="text-gray-500 text-sm">
            {type === "token_approval" && "Approved spender: "}
            {type === "token_transfer" && "Sent to: "}
            {type === "simple_transfer" && "Sent to: "}
            {type === "bridge_transaction" && "Bridged to: "}
            {type === "contract_interaction" && "Interacted with: "}
            <span className="font-medium">
              {getDestinationDisplay()}
            </span>
          </p>
          
          {comment && (
            <p className="text-gray-400 text-xs mt-1">{comment}</p>
          )}
          
          <p className="text-gray-400 text-xs mt-2">on {networkName}</p>
          
          {txId && (
            <p className="mt-3">
              <Link
                href={network === "main" 
                  ? `https://explore.vechain.org/transactions/${txId}`
                  : `https://explore-testnet.vechain.org/transactions/${txId}`
                }
                target="_blank"
                className="underline text-blue-600 text-sm"
              >
                View on VeChain Explorer
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionComponent;
