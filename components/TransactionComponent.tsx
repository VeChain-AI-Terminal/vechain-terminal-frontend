import React, { useEffect, useState } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import {
  useWallet,
  useSendTransaction,
} from "@vechain/vechain-kit";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { CheckCircleFillIcon } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    note?: string;
  };
  receiveAmount?: string;
  instructions?: string[];
  feeAndQuota?: {
    networkFee: {
      value: string;
      isPercent: boolean;
    };
    operationFee: {
      value: string;
      isPercent: boolean;
      minLimit?: string;
      maxLimit?: string;
    };
  };
  txDataDetail?: any;
  platform?: 'VeChain' | 'EVM';
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
  feeAndQuota,
  txDataDetail,
  platform,
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

    // Check if approval is required before proceeding
    if (approveRequired) {
      console.warn("Token approval may be required - user should ensure approval is completed");
      // Show custom modal instead of browser confirm
      setShowApprovalModal(true);
      return;
    }
    
    // Debug: Log clauses right before sending
    console.log("handleSendTx: About to send transaction with clauses:", transactionClauses);
    
    try {
      // Pass clauses directly to sendTransaction call, not in hook config
      await sendTransaction(transactionClauses);
    } catch (error) {
      console.error("Transaction failed:", error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes("transferFrom failed")) {
          alert("Transaction failed: Insufficient token allowance.\n\nPlease approve the token spending first, then try again.");
        } else if (error.message.includes("gas")) {
          alert("Transaction failed: Gas estimation error.\n\nThis might be due to insufficient balance or network issues. Please try again.");
        } else {
          alert(`Transaction failed: ${error.message}`);
        }
      }
    }
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  const networkName = networkToName[network];
  const token = networkToToken[network];

  // Button is only disabled for actual transaction states, not approval requirements
  const isButtonDisabled = isSending || isMining || isSuccess || !hasValidClauses;
  
  // Modal state for approval confirmation
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  
  // Execute transaction function
  const executeTransaction = async () => {
    console.log("handleSendTx: About to send transaction with clauses:", transactionClauses);
    
    try {
      // Pass clauses directly to sendTransaction call, not in hook config
      await sendTransaction(transactionClauses);
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error instanceof Error) {
        if (error.message.includes("transferFrom failed")) {
          alert("Transaction failed: Insufficient token allowance.\n\nPlease approve the token spending first, then try again.");
        } else if (error.message.includes("gas")) {
          alert("Transaction failed: Gas estimation error.\n\nThis might be due to insufficient balance or network issues. Please try again.");
        } else {
          alert(`Transaction failed: ${error.message}`);
        }
      }
    }
  };
  
  // Handle modal proceed
  const handleProceedWithTransaction = () => {
    setShowApprovalModal(false);
    executeTransaction();
  };

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
        // For bridge transactions, try to get token symbol from tokenSymbol prop first
        const displaySymbol = tokenSymbol || bridgeDetails?.fromChain || 'TOKEN';
        return bridgeDetails ? `${bridgeDetails.amount} ${displaySymbol}` : "0";
      default:
        const decimalValue = parseFloat(value || "0");
        if (decimalValue === 0) return "0 VET";
        return `${(decimalValue / Math.pow(10, 18)).toString()} VET`;
    }
  };

  const getValueDisplay = () => {
    const decimalValue = parseFloat(value || "0");
    if (decimalValue === 0) return "0 VET";
    return `${(decimalValue / Math.pow(10, 18)).toString()} VET`;
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
            <span className="size-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600" />
            {shortenAddress(from)}
          </span>
        </div>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">
            {type === "token_approval" ? "Spender" : "To"}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
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
              <span className="text-gray-400">Platform</span>
              <span className="text-white">{platform || 'VeChain'}</span>
            </div>
            <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
              <span className="text-gray-400">From Chain</span>
              <span className="text-white">{bridgeDetails.fromChain}</span>
            </div>
            <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
              <span className="text-gray-400">To Chain</span>
              <span className="text-white">{bridgeDetails.toChain}</span>
            </div>
            <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
              <span className="text-gray-400">Gateway</span>
              <span className="text-white font-mono text-xs">{shortenAddress(bridgeDetails.gatewayAddress)}</span>
            </div>
            {receiveAmount && (
              <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
                <span className="text-gray-400">You&apos;ll Receive</span>
                <span className="text-green-400">{receiveAmount}</span>
              </div>
            )}
            {feeAndQuota && (
              <>
                <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-white">
                    {feeAndQuota.networkFee.value} {feeAndQuota.networkFee.isPercent ? '%' : 'wei'}
                  </span>
                </div>
                <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
                  <span className="text-gray-400">Operation Fee</span>
                  <span className="text-white">
                    {feeAndQuota.operationFee.value} {feeAndQuota.operationFee.isPercent ? '%' : 'tokens'}
                  </span>
                </div>
              </>
            )}
            {instructions && instructions.length > 0 && (
              <div className="mb-4 border-b border-zinc-700 pb-3">
                <span className="text-gray-400 block mb-2">Instructions:</span>
                <ol className="text-sm text-gray-300 space-y-1">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}

        {/* Approval Information */}
        {approveRequired && (
          <div className="mb-4 p-4 bg-zinc-800/30 border border-theme-orange/30 rounded-xl">
            <div className="flex items-start gap-3">
                <div className="shrink-0 size-8 bg-theme-orange/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-theme-orange" />
              </div>
              <div className="flex-1">
                <p className="text-theme-orange text-sm font-medium mb-2">
                  Token Approval Check
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Token:</span>
                    <span className="text-theme-orange font-mono">{shortenAddress(approveRequired.token)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Spender:</span>
                    <span className="text-theme-orange font-mono">{shortenAddress(approveRequired.spender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="text-theme-orange font-medium">
                      {(() => {
                        const weiAmount = BigInt(approveRequired.amount);
                        const tokenAmount = weiAmount / BigInt('1000000000000000000');
                        return `${tokenAmount.toString()} ${tokenSymbol || 'TOKEN'}`;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-zinc-700/30 border border-theme-orange/20 rounded-lg">
                  <p className="text-theme-orange text-xs">
                    💡 If you&apos;ve already approved this token spending, you can proceed with the transaction. If not, please approve first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VET Value (only show if significant) */}
        {parseFloat(value || "0") > 0 && (
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


        {/* Instructions */}
        {instructions && instructions.length > 0 && (
          <div className="mb-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
            <p className="text-orange-400 text-sm font-medium mb-2">Instructions:</p>
            <ol className="text-orange-300 text-xs space-y-1">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-400 mr-2">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
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

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-theme-orange/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-theme-orange" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg">
                  Token Approval Check
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Verify your approval status before proceeding
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {approveRequired && (
            <div className="space-y-4 py-4">
              {/* Token Details Card */}
              <div className="bg-zinc-800/30 border border-theme-orange/20 p-4 rounded-xl">
                <h4 className="text-theme-orange font-medium mb-3 flex items-center gap-2">
                    <span className="size-2 bg-theme-orange rounded-full"></span>
                  Approval Details
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Token Contract</p>
                    <p className="text-white font-mono text-sm bg-zinc-800/50 p-2 rounded">{shortenAddress(approveRequired.token)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Spender Address</p>
                    <p className="text-white font-mono text-sm bg-zinc-800/50 p-2 rounded">{shortenAddress(approveRequired.spender)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Amount</p>
                    <p className="text-theme-orange font-semibold text-sm bg-theme-orange/10 p-2 rounded">
                      {(() => {
                        const weiAmount = BigInt(approveRequired.amount);
                        const tokenAmount = weiAmount / BigInt('1000000000000000000');
                        return `${tokenAmount.toString()} ${tokenSymbol || 'TOKEN'}`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Status Check Card */}
              <div className="bg-zinc-800/30 border border-theme-orange/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 size-8 bg-theme-orange/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-theme-orange" />
                  </div>
                  <div>
                    <h4 className="text-theme-orange font-medium mb-2">Have you approved this token?</h4>
                    <p className="text-zinc-300 text-sm">
                      If you&apos;ve already completed the token approval, you can proceed safely. 
                      If not, please approve first to avoid transaction failure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 flex-1"
            >
              I Need to Approve First
            </Button>
            <Button
              onClick={handleProceedWithTransaction}
              className="bg-theme-orange hover:bg-theme-orange-dark text-black font-bold flex-1"
            >
              I&apos;ve Already Approved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionComponent;
