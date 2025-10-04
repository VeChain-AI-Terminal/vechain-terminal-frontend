'use client';

import { useWallet } from "@vechain/vechain-kit";

export function useSafeWallet() {
  try {
    return useWallet();
  } catch (error) {
    // Return safe defaults when VeChain Kit provider is not available
    return {
      account: null,
      connectedWallet: null,
      smartAccount: null,
      privyUser: null,
      connection: {
        isConnected: false,
        isLoading: false,
        isConnectedWithSocialLogin: false,
        isConnectedWithDappKit: false,
        isConnectedWithCrossApp: false,
        isConnectedWithPrivy: false,
        isConnectedWithVeChain: false,
        source: 'unknown' as any,
        isInAppBrowser: false,
        nodeUrl: '',
        network: 'test' as any,
      },
      disconnect: async () => {},
    };
  }
}