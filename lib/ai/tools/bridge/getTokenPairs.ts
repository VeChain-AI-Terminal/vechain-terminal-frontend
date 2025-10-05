import { tool } from 'ai';
import { z } from 'zod';

// WanBridge API configuration
const WANBRIDGE_API = {
  mainnet: 'https://bridge-api.wanchain.org/api',
  testnet: 'https://bridge-api.wanchain.org/api/testnet'
};

export const getTokenPairs = tool({
  description: 'Get all available cross-chain token pairs (300+ pairs across 25+ chains) for bridge operations',
  inputSchema: z.object({
    fromChain: z.string().optional().describe('Filter by source chain type (e.g., VET, ETH, BNB)'),
    toChain: z.string().optional().describe('Filter by destination chain type'),
    network: z.enum(["main", "test"]).optional().describe("Network to use (defaults to environment setting)"),
  }),
  execute: async ({ fromChain, toChain, network }): Promise<any> => {
    try {
      // Use environment network setting if not specified
      const networkType = network || (process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'mainnet' ? 'main' : 'test');
      const apiUrl = networkType === 'main' ? WANBRIDGE_API.mainnet : WANBRIDGE_API.testnet;

      const response = await fetch(`${apiUrl}/tokenPairs`);
      const data = await response.json() as any;

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch token pairs');
      }

      let pairs = data.data || [];

      // Filter for specific chains if requested
      if (fromChain || toChain) {
        pairs = pairs.filter((pair: any) => {
          const fromMatch = !fromChain || pair.fromChain?.chainType === fromChain;
          const toMatch = !toChain || pair.toChain?.chainType === toChain;
          return fromMatch && toMatch;
        });
      }

      return {
        success: true,
        data: {
          pairs: pairs.slice(0, 50).map((pair: any) => ({ // Limit to 50 for readability
            tokenPairID: pair.tokenPairID,
            symbol: pair.symbol,
            fromChain: {
              type: pair.fromChain?.chainType,
              name: pair.fromChain?.chainName,
              chainId: pair.fromChain?.chainId
            },
            toChain: {
              type: pair.toChain?.chainType,
              name: pair.toChain?.chainName,
              chainId: pair.toChain?.chainId
            },
            fromToken: {
              address: pair.fromToken?.address,
              symbol: pair.fromToken?.symbol,
              decimals: pair.fromToken?.decimals
            },
            toToken: {
              address: pair.toToken?.address,
              symbol: pair.toToken?.symbol,
              decimals: pair.toToken?.decimals
            }
          })),
          total: pairs.length,
          filtered: fromChain || toChain,
          network: networkType,
          note: 'Showing first 50 pairs. Use fromChain/toChain filters to narrow results.'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch token pairs'
      };
    }
  },
});
