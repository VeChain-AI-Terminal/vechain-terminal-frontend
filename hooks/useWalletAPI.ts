'use client';

import { useWallet } from '@vechain/vechain-kit';
import { useCallback } from 'react';

export function useWalletAPI() {
  const { account, connection } = useWallet();

  const fetchWithWalletHeaders = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add wallet headers if connected
    if (connection.isConnected && account?.address) {
      headers['x-wallet-address'] = account.address;
      headers['x-wallet-network'] = connection.network || 'test';
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [connection.isConnected, account?.address, connection.network]);

  return {
    fetchWithWalletHeaders,
    account,
    connection,
    // Expose connection state for backward compatibility
    isConnected: connection.isConnected,
    network: connection.network,
    // Helper function to get wallet headers
    getWalletHeaders: () => {
      const headers: Record<string, string> = {};
      if (connection.isConnected && account?.address) {
        headers['x-wallet-address'] = account.address;
        headers['x-wallet-network'] = connection.network || 'test';
      }
      return headers;
    },
  };
}