'use client';

import { useWallet } from '@vechain/vechain-kit';
import { useCallback } from 'react';

export function useWalletAPI() {
  const { account, isConnected, network } = useWallet();

  const fetchWithWalletHeaders = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add wallet headers if connected
    if (isConnected && account?.address) {
      headers['x-wallet-address'] = account.address;
      headers['x-wallet-network'] = network || 'test';
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [isConnected, account?.address, network]);

  return {
    fetchWithWalletHeaders,
    account,
    isConnected,
    network,
    // Helper function to get wallet headers
    getWalletHeaders: () => {
      const headers: Record<string, string> = {};
      if (isConnected && account?.address) {
        headers['x-wallet-address'] = account.address;
        headers['x-wallet-network'] = network || 'test';
      }
      return headers;
    },
  };
}