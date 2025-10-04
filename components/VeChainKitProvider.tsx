'use client';

import React, { ReactNode } from 'react';
import { VeChainKitProvider } from '@vechain/vechain-kit';

export default function VeChainKitProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <VeChainKitProvider
      network={{
        type: "test", // "main" | "test" | "solo"
      }}
      
      feeDelegation={{
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/441",
        delegateAllTransactions: false,
      }}
      
      loginMethods={[
        { method: "vechain", gridColumn: 4 },
        { method: "dappkit", gridColumn: 4 },
        { method: "ecosystem", gridColumn: 4 },
      ]}
      
      dappKit={{
        allowedWallets: ["veworld", "wallet-connect", "sync2"],
        walletConnectOptions: {
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
          metadata: {
            name: "VeChain Terminal",
            description: "AI-powered VeChain blockchain terminal",
            url: typeof window !== "undefined" ? window.location.origin : "",
            icons: ["/images/vechain.png"],
          },
        },
      }}
      
      darkMode={true}
      language="en"
      allowCustomTokens={true}
      
      loginModalUI={{
        logo: '/images/vechain.png',
        description: 'Connect your wallet to access VeChain Terminal',
      }}
    >
      {children}
    </VeChainKitProvider>
  );
}