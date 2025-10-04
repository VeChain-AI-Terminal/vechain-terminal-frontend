'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import VeChain Kit with no SSR
const VeChainKitProvider = dynamic(
  () => import('@vechain/vechain-kit').then(mod => mod.VeChainKitProvider),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
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
            name: "VeChain Terminal",
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