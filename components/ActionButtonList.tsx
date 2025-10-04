"use client";
import { useWallet, useConnectModal, useAccountModal } from "@vechain/vechain-kit";

export const ActionButtonList = () => {
  const { disconnect } = useWallet();
  const { open: openConnect } = useConnectModal();
  const { open: openAccount } = useAccountModal();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };
  return (
    <div>
      <button onClick={() => openConnect()}>Connect Wallet</button>
      <button onClick={() => openAccount()}>Account</button>
      <button onClick={handleDisconnect}>Disconnect</button>
    </div>
  );
};
