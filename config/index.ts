import {
  type SIWESession,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
  createSIWEConfig,
  formatMessage,
} from "@reown/appkit-siwe";
import { WagmiAdapter, authConnector } from "@reown/appkit-adapter-wagmi";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";

import { cookieStorage, createStorage } from "wagmi";
import { coreDao, coreTestnet2, AppKitNetwork } from "@reown/appkit/networks";
import { getAddress } from "viem";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

export const metadata = {
  name: "Orange Terminal",
  description: "AI co-pilot for the Bitcoin on CORE",
  url: "https://app.orangeterminal.com/", // origin must match your domain & subdomain
  icons: ["https://app.orangeterminal.com/favicon.ico"],
};

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Create wagmiConfig
export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [
  coreDao,
  coreTestnet2,
];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  ssr: true,
});

// Normalize the address (checksum)
const normalizeAddress = (address: string): string => {
  try {
    const splitAddress = address.split(":");
    const extractedAddress = splitAddress[splitAddress.length - 1];
    const checksumAddress = getAddress(extractedAddress);
    splitAddress[splitAddress.length - 1] = checksumAddress;
    const normalizedAddress = splitAddress.join(":");

    return normalizedAddress;
  } catch (error) {
    return address;
  }
};

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: chains.map((chain: AppKitNetwork) => parseInt(chain.id.toString())),
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, normalizeAddress(address)),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error("Failed to get nonce!");
    }

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) {
      return null;
    }

    // Validate address and chainId types
    if (
      typeof session.address !== "string" ||
      typeof session.chainId !== "number"
    ) {
      return null;
    }

    return {
      address: session.address,
      chainId: session.chainId,
    } satisfies SIWESession;
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/protected",
      });

      return Boolean(success?.ok);
    } catch (error) {
      console.error("verifyMessage error:", error);
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({ redirect: false });
      return true;
    } catch (error) {
      console.error("signOut error:", error);
      return false;
    }
  },
});
