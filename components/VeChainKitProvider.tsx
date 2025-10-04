'use client';

import React, { ReactNode } from 'react';
import { VeChainKitProvider } from '@vechain/vechain-kit';
import { VECHAIN_MAINNET, VECHAIN_TESTNET } from '@vechain/vechain-kit';

const vechainNetworks = [VECHAIN_MAINNET, VECHAIN_TESTNET];

export default function VeChainKitProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <VeChainKitProvider
      networks={vechainNetworks}
      defaultNetwork={VECHAIN_TESTNET}
      enableWalletConnect={true}
      walletConnectOptions={{
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
      }}
      enableSocialLogin={true}
      privyConfig={{
        appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        config: {
          appearance: {
            theme: 'dark',
          },
          loginMethods: ['email', 'sms', 'google', 'twitter'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
      enableFeeDelegation={true}
      feeDelegatorUrl={process.env.NEXT_PUBLIC_FEE_DELEGATOR_URL}
    >
      {children}
    </VeChainKitProvider>
  );
}