'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/ui/loading-screen';

// Dynamically import VeChain Kit with no SSR
const VeChainKitProvider = dynamic(
  () => import('@vechain/vechain-kit').then(mod => mod.VeChainKitProvider),
  { 
    ssr: false,
    loading: () => <LoadingScreen message="VeChain AI Terminal" submessage="Loading blockchain components..." />
  }
);

export default function VeChainKitProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <LoadingScreen message="VeChain AI Terminal" submessage="Preparing blockchain environment..." />
    );
  }

  return (
    <VeChainKitProvider
      network={{ type: "test" }}
      feeDelegation={{
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/441",
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
  );
}