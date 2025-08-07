"use client";

import { wagmiAdapter, projectId, networks } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { defineChain } from "@reown/appkit/networks";

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "Orange Terminal",
  description: "Orange Terminal for Core Blockchain",
  url: "https://github.com/0xonerb/next-reown-appkit-ssr", // origin must match your domain & subdomain
  icons: ["/images/core.png"],
};

const coreDao = /*#__PURE__*/ defineChain({
  id: 1116,
  caipNetworkId: "eip155:1116",
  chainNamespace: "eip155",
  name: "Core Dao",
  nativeCurrency: {
    decimals: 18,
    name: "Core",
    symbol: "CORE",
  },
  rpcUrls: {
    default: { http: ["https://rpc.coredao.org"] },
  },
  blockExplorers: {
    default: {
      name: "CoreDao",
      url: "https://scan.coredao.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 11_907_934,
    },
  },
  testnet: false,
});

const coreTestnet2 = /*#__PURE__*/ defineChain({
  id: 1114,
  caipNetworkId: "eip155:1114",
  chainNamespace: "eip155",
  name: "Core Testnet2",
  nativeCurrency: {
    decimals: 18,
    name: "tCore2",
    symbol: "TCORE2",
  },
  rpcUrls: {
    default: { http: ["https://rpc.test2.btcs.network"] },
  },
  blockExplorers: {
    default: {
      name: "Core Testnet2",
      url: "https://scan.test2.btcs.network",
      apiUrl: "https://api.test2.btcs.network/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0x3CB285ff3Cd5C7C7e570b1E7DE3De17A0f985e56",
      blockCreated: 3_838_600,
    },
  },
  testnet: true,
});

if (!projectId) {
  throw new Error("Project ID is not set");
}
// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [coreDao, coreTestnet2],
  chainImages: {
    1116: "/images/core.png",
    1114: "/images/core.png",
  },
  defaultNetwork: coreDao,
  enableNetworkSwitch: true,
  metadata,
  themeMode: "dark",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
