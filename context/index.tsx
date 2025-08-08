"use client";

import React, { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import {
  wagmiAdapter,
  projectId,
  siweConfig,
  metadata,
  chains,
} from "@/config/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";

import { defineChain } from "@reown/appkit/networks";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

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

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [coreDao, coreTestnet2],
  chainImages: {
    1116: "/images/core.png",
    1114: "/images/core.png",
  },
  projectId,
  siweConfig,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  defaultNetwork: coreDao,
  enableNetworkSwitch: true,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

export default function AppKitProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
