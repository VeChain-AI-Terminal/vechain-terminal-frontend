import React, { useEffect } from "react";
import { FaSpinner, FaSyncAlt } from "react-icons/fa";
import {
  useWaitForTransactionReceipt,
  useEstimateGas,
  useWriteContract,
} from "wagmi";
import { parseEther, formatEther, type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleFillIcon } from "@/components/icons";
import {
  MAINNET_COREAGENT_CONTRACT_ADDRESS,
  TESTNET_COREAGENT_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { StakeComponentProps } from "@/lib/ai/tools/coreStakeActions/makeStakeCoreTransaction";

// CoreAgent contract address on each chain
const chainIdToCoreAgent: Record<number, string> = {
  1114: TESTNET_COREAGENT_CONTRACT_ADDRESS,
  1116: MAINNET_COREAGENT_CONTRACT_ADDRESS,
};

const coreAgentAbi = [
  {
    type: "function",
    name: "delegateCoin",
    stateMutability: "payable",
    inputs: [{ name: "candidate", type: "address" }],
    outputs: [],
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

const StakeComponent: React.FC<StakeComponentProps> = ({
  candidateAddress,
  candidateName,
  valueInWei,
  chainId,
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

  const stakeArgs = [candidateAddress as Address] as const;
  const stakeValue = parseEther(decimalValue);

  const txConfig = {
    address: chainIdToCoreAgent[chainId] as Address,
    abi: coreAgentAbi,
    functionName: "delegateCoin",
    args: stakeArgs,
    value: stakeValue,
    chainId,
    account: from as Address,
  } as const;

  // const { data: gasEstimate } = useEstimateGas(txConfig);
  // console.log("gas estimate ", gasEstimate);

  useEffect(() => {
    if (sendError) console.error("Stake send error:", sendError);
    if (isTxError) console.error("Stake tx failed or reverted:", receipt);
  }, [sendError, isTxError, receipt]);

  const handleStake = () => {
    if (!isConnected) {
      console.error("Wallet not connected");
      return;
    }
    writeContract({
      ...txConfig,
    });
  };

  const shortenAddress = (addr: string) =>
    addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  const isButtonDisabled = isSending || isMining || isSuccess;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-md w-full border border-zinc-700 max-w-lg">
        <h2 className="text-xl font-semibold mb-6">Stake CORE</h2>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Candidate</span>
          <span>{candidateName ? candidateName : candidateAddress}</span>
        </div>

        <div className="mb-4 flex justify-between items-center border-b border-zinc-700 pb-3">
          <span className="text-gray-400">Amount</span>
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
          onClick={handleStake}
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
            <span>Stake Complete</span>
          )}
          {isTxError && (
            <>
              <span className="text-red-500">✗</span>
              <span>Stake Failed</span>
            </>
          )}
          {!isSending && !txHash && !isSuccess && !isTxError && (
            <>
              <FaSyncAlt className="text-sm" />
              Stake CORE
            </>
          )}
        </button>
      </div>

      {isSuccess && receipt?.status === "success" && (
        <div className="bg-zinc-800 rounded-xl p-6 mt-6 flex flex-col items-center text-center border border-green-500 max-w-lg">
          <div className="text-green-500 mb-3">
            <CheckCircleFillIcon size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Stake Successful</h3>
          <div className="flex items-center gap-2 mb-1">
            <Image src="/images/core.png" alt="Core" width={28} height={28} />
            <span className="text-lg font-bold">
              {decimalValue} {token}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            staked to{" "}
            <span className="font-medium">
              {candidateName ? candidateName : candidateAddress}
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

export default StakeComponent;
