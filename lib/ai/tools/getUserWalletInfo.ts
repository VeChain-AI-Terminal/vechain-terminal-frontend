import { tool } from "ai";
import z from "zod";
import { headers } from "next/headers";

export const getUserWalletInfo = tool({
  description: "Get the user's wallet address and network info from request headers",
  inputSchema: z.object({}),
  execute: async (): Promise<any> => {
    try {
      const headersList = await headers();
      const walletAddress = headersList.get('x-wallet-address');
      const networkHeader = headersList.get('x-wallet-network');
      
      if (!walletAddress) {
        return {
          error: "No wallet address provided",
          message: "Please connect your VeChain wallet to access wallet information",
          connected: false
        };
      }

      // Determine network info
      const network = networkHeader || "test";
      const networkName = network === "main" ? "VeChain Mainnet" : "VeChain Testnet";
      const chainId = network === "main" ? 39 : 40;

      return {
        address: walletAddress,
        network,
        networkName,
        chainId,
        connected: true,
        message: `Connected to ${networkName} with address ${walletAddress}`
      };

    } catch (error) {
      return {
        error: "Failed to get wallet information",
        message: "Please ensure your VeChain wallet is properly connected",
        connected: false
      };
    }
  },
});
