import { useSendTransaction, useEstimateGas } from "wagmi";
import { parseUnits, hexToBigInt, type Address } from "viem";
import { useWallet } from "@vechain/vechain-kit";

export function useHandleTransaction() {
  const { account, connection } = useWallet();
  const { sendTransactionAsync } = useSendTransaction();

  const handleTransaction = async (tx: {
    chainId: number;
    to: Address;
    value: string; // hex string
    data: `0x${string}`;
  }) => {
    if (!connection.isConnected || !account) {
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
        account: account?.address as Address,
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
