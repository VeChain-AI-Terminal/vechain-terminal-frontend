'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Dynamically import VeChain Kit with no SSR
const VeChainKitProvider = dynamic(
  () => import('@vechain/vechain-kit').then(mod => mod.VeChainKitProvider),
  { 
    ssr: false,
    loading: () => <LoadingScreen message="VeChain AI Terminal" submessage="Loading blockchain components..." />
  }
);

// Create QueryClient with proper error handling for avatar requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on network errors (like avatar fetch failures)
        if (error?.message?.includes('Failed to fetch')) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export default function VeChainKitProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic network configuration based on environment
  const networkType = process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'mainnet' ? 'main' : 'test';
  const feeDelegationUrl = networkType === 'main' 
    ? "https://sponsor.vechain.energy/by/441"  // Mainnet sponsor
    : "https://sponsor-testnet.vechain.energy/by/441"; // Testnet sponsor

  if (!isMounted) {
    return (
      <LoadingScreen message="VeChain AI Terminal" submessage="Preparing blockchain environment..." />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <VeChainKitProvider
        network={{ type: networkType }}
        feeDelegation={{
          delegatorUrl: feeDelegationUrl,
          delegateAllTransactions: false,
        }}
        loginMethods={[
          { method: "dappkit", gridColumn: 4 },
        ]}
        dappKit={{
          allowedWallets: ["veworld"],
          walletConnectOptions: {
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "a01e2f3b4c5d6e7f8g9h0i1j2k3l4m5n",
            metadata: {
              name: "VeChain AI Terminal",
              description: "AI-powered VeChain blockchain terminal",
              url: typeof window !== "undefined" ? window.location.origin : "https://vechain.org",
              icons: ["/images/vechain.png"],
            },
          },
        }}
        darkMode={true}
        language="en"
      >
        {children}
      </VeChainKitProvider>
    </QueryClientProvider>
  );
}