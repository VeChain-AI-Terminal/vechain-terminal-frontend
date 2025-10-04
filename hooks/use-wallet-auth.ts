"use client";

import { useWallet } from "@vechain/vechain-kit";
import { useEffect, useState } from "react";
import { authenticateWallet } from "@/lib/auth/wallet-auth";
import type { User } from "@/lib/db/schema";

export function useWalletAuth() {
  const { account, connection } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = connection.isConnected && account?.address;

  useEffect(() => {
    const handleUserAuth = async () => {
      if (isConnected && account?.address) {
        setIsLoading(true);
        try {
          const userData = await authenticateWallet(account.address);
          setUser(userData);
        } catch (error) {
          console.error("Failed to authenticate user:", error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
      }
    };

    handleUserAuth();
  }, [isConnected, account?.address]);

  return {
    user,
    isConnected,
    isLoading,
    address: account?.address || null,
  };
}