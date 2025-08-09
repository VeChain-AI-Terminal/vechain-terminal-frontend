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

export type StakeComponentProps = {
  candidate: string; // validator operator address
  value: string; // amount in wei or decimal CORE string
  chainId: number;
};

// CoreAgent contract address on each chain
const chainIdToCoreAgent: Record<number, string> = {
  1114: "0x0000000000000000000000000000000000001011",
  1116: "0x0000000000000000000000000000000000001011",
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

const validatorAddressToName: Record<string, string> = {
  "0x64db24a662e20bbdf72d1cc6e973dbb2d12897d5": "DAO Mining Pool 4",
  "0xee79f2b4be44b582f496d857727f2d6aff4c71f3": "ZAN Node",
  "0x359b5fbc5b294e953dbec5cbb769e2186bb30e56": "stc Bahrain",
  "0x2e50087fb834747606ed01ad67ad0f32129ab431": "Foundry",
  "0xa37cf4faa0758b26dca666f3e36d42fa15cc0106": "DAO Mining Pool 5",
  "0x651da43be21fdb85615a58350cc09d019c3f47c4": "OKXEarn",
  "0xa898e2f126b642d6e401bdcb79979c691a8fd90d": "WolfEdge Labs",
  "0xc24fe962e6230841c5019e531e3c713ed30161b4": "Fireblocks",
  "0x58d8efc838d2de558eedeabce631c7dff92c947a": "DAO Validator 6",
  "0x83ee5d8b74a1d9310f0c152d30c0772529efedff": "huobi",
  "0x33c724450ab1d9c5e583fcdd74701a7019706024": "Valour",
  "0xdbc83c2093def988fbe96993292c058ef7da0784": "Satoshi App",
  "0x2d058b58dcf4b0db11168c62d3109f6e02710b02": "M Labs",
  "0x1c151923cf6c381c4af6c3071a2773b3cdbbf704": "Kiln",
  "0xbfbbacbd59c3bd551d40729061dc4d21ccbea792": "UTXO",
  "0x42fdeae88682a965939fee9b7b2bd5b99694ff64": "DAO Mining Pool 3",
  "0xf6fdbc19a25dc91454cec19ef7714e8b67c4e0e6": "Animoca Brands",
  "0xa21cbd3caa4fe89bccd1d716c92ce4533e4d4733": "DAO Mining Pool 1",
  "0x8c7c180d12565254880d84e8ecc3242b7b4a2915": "Luganodes",
  "0xbe795699b8789a27d20a6ca7cd84a0b057fae46c": "",
  "0xebbaf365b0d5fa072e2b2429db23696291f2c038": "Ardennes",
  "0xf79efaceb93a83e114d4e2e957fa16d69380cc25": "KODA x Nodeinfra",
  "0xba57b8de67e0cf289c1ee39f1f888767003819aa": "Figment",
  "0x2953559db5cc88ab20b1960faa9793803d070337": "DAO Mining Pool 2",
  "0x307f36ff0aff7000ebd4eea1e8e9bbbfa0e1134c": "Everstake",
  "0x536de38d1db7c68636fc989e4d0daac51e4eb950": "Solv",
  "0x5b9b30813264eaab2b70817a36c94733812e591c": "DAO Validator 2",
  "0xe2f8cefcdee51f48e3ce5c4deea3095c43369b36": "InfStones",
  "0x741095f5f73475f3f5ee4bb12cbb23574546fdd8": "BTCS",
  "0x7c706ca44a28fdd25761250961276bd61d5aa87b": "DAO Validator 1",
  "0x917f346613054d8de508acb7af92f9f9a29e3f26": "Blockdaemon",
  "0x608988097efc97679e3e2f5820ea81ff7ab5c85a": "Bitget",
  "0x86835128b29fef52fc61299ebb50d85e03960976": "P2P.org",
  "0xc6867d7a2e9b4ee71f11cdaccd4d2ec04a690ec2": "DAO Validator 5",
  "0x38b6515c22e3c376fc736f8614bba68439d3a642": "DAO Validator 12",
};

const StakeComponent: React.FC<StakeComponentProps> = ({
  candidate,
  value,
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

  const decimalValue = formatEther(BigInt(value));
  const token =
    chainIdToToken[chainId as keyof typeof chainIdToToken] || "CORE";
  const networkName =
    chainIdToName[chainId as keyof typeof chainIdToName] || String(chainId);

  const stakeArgs = [candidate as Address] as const;
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
          <span>
            {validatorAddressToName[candidate]
              ? validatorAddressToName[candidate]
              : shortenAddress(candidate)}
          </span>
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
              {" "}
              {validatorAddressToName[candidate]
                ? validatorAddressToName[candidate]
                : shortenAddress(candidate)}
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
