import { useSendTransaction, useEstimateGas } from "wagmi";
import { parseUnits, hexToBigInt, type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";

export function useHandleTransaction() {
  const { address, isConnected } = useAppKitAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const handleTransaction = async (tx: {
    chainId: number;
    to: Address;
    value: string; // hex string
    data: `0x${string}`;
  }) => {
    if (!isConnected || !address) {
      console.warn("Wallet not connected");
      return;
    }
    console.log("tx", tx);

    try {
      const txRequest = {
        to: tx.to,
        value: hexToBigInt(tx.value as `0x${string}`), // convert hex value to BigInt
        data: tx.data,
      };

      const hash = await sendTransactionAsync({
        ...txRequest,
        account: address as Address,
      });

      console.log("✅ Transaction sent:", hash);
      return hash;
    } catch (err) {
      console.error("❌ Error sending transaction:", err);
      throw err;
    }
  };

  return { handleTransaction };
}
