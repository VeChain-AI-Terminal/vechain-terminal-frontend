import { useSendTransaction } from "@vechain/vechain-kit";
import { useWallet } from "@vechain/vechain-kit";

export function useHandleTransaction() {
  const { account } = useWallet();
  
  const config = {
    signerAccountAddress: account?.address || "",
    onTxConfirmed: () => {
      console.log("Transaction confirmed");
    },
    onTxFailedOrCancelled: (error: unknown) => {
      console.error("Transaction failed or cancelled:", error);
    },
  };
  
  const { sendTransaction } = useSendTransaction(config);

  const handleTransaction = async (tx: {
    chainId: number;
    to: string;
    value: string; // hex string
    data: string;
  }) => {
    if (!account) {
      console.warn("Wallet not connected");
      return;
    }
    console.log("tx", tx);

    try {
      const clause = {
        to: tx.to,
        value: tx.value,
        data: tx.data,
      };

      const result = await sendTransaction([clause]);

      console.log("✅ Transaction sent:", result);
      return result;
    } catch (err) {
      console.error("❌ Error sending transaction:", err);
      throw err;
    }
  };

  return { handleTransaction };
}
