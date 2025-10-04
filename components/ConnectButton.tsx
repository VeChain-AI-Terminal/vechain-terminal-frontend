"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnectModal } from "@vechain/vechain-kit";
import { Button } from "@/components/ui/button";

export const ConnectButton = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { account, connection, disconnect } = useWallet();
  const { open: openConnectModal } = useConnectModal();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  const handleConnect = () => {
    openConnectModal();
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  if (connection.isConnected && account) {
    return (
      <div className="border border-theme-orange rounded-full flex items-center gap-2 px-3 py-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm">{shortenAddress(account.address)}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDisconnect}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-theme-orange rounded-full">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleConnect}
        className="px-4 py-2"
      >
        Connect Wallet
      </Button>
    </div>
  );
};
