'use client';

import { useEffect, useRef } from 'react';
import { useWalletAPI } from './useWalletAPI';

export function useAutoRegisterUser() {
  const { fetchWithWalletHeaders, account, isConnected, network, getWalletHeaders } = useWalletAPI();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (isConnected && account?.address && !hasRegistered.current) {
      registerUser(account.address);
      hasRegistered.current = true;
    }
    
    // Reset registration flag when wallet disconnects
    if (!isConnected) {
      hasRegistered.current = false;
    }
  }, [isConnected, account?.address]);

  const registerUser = async (address: string) => {
    try {
      const response = await fetchWithWalletHeaders('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const userData = await response.json();
      console.log('User registered/found:', userData);
      
      return userData;
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return {
    isRegistered: hasRegistered.current,
    account,
    isConnected,
    network,
    fetchWithWalletHeaders, // Export this for other components to use
    getWalletHeaders, // Export wallet headers helper
  };
}