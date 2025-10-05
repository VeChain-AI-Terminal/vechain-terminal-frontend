import { tool } from 'ai';
import { z } from 'zod';

// WanBridge API configuration
const WANBRIDGE_API = {
  mainnet: 'https://bridge-api.wanchain.org/api',
  testnet: 'https://bridge-api.wanchain.org/api/testnet'
};

export const getQuotaAndFee = tool({
  description: 'Get bridge quota (min/max limits) and fees in one call for cross-chain transfers',
  inputSchema: z.object({
    fromChainType: z.string().describe('Source chain type (e.g., VET, ETH, BNB)'),
    toChainType: z.string().describe('Destination chain type'),
    symbol: z.string().describe('Token symbol (e.g., USDT, USDC, VTHO)'),
    tokenPairID: z.string().optional().describe('Token pair ID (optional, for fee query)'),
    network: z.enum(["main", "test"]).optional().describe("Network to use (defaults to environment setting)"),
  }),
  execute: async ({ fromChainType, toChainType, symbol, tokenPairID, network }): Promise<any> => {
    try {
      // Use environment network setting if not specified
      const networkType = network || (process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'mainnet' ? 'main' : 'test');
      const apiUrl = networkType === 'main' ? WANBRIDGE_API.mainnet : WANBRIDGE_API.testnet;

      const params = new URLSearchParams({
        fromChainType,
        toChainType,
        symbol,
        ...(tokenPairID && { tokenPairID })
      });

      const response = await fetch(`${apiUrl}/quotaAndFee?${params}`);
      const result = await response.json() as any;

      // Debug: Log the raw API response
      console.log('🔍 WanBridge API Response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to get quota and fee');
      }

      const data = result.data;
      
      // Debug: Log the quota data specifically
      console.log('🔍 Raw quota data:', {
        minQuota: data.minQuota,
        maxQuota: data.maxQuota,
        symbol: data.symbol
      });

      return {
        success: true,
        data: {
          symbol: data.symbol,
          route: `${fromChainType} → ${toChainType}`,
          quota: {
            min: data.minQuota,
            max: data.maxQuota,
            unit: data.symbol
          },
          fees: {
            network: {
              value: data.networkFee.value,
              isPercent: data.networkFee.isPercent,
              description: 'Charged in native token of the blockchain'
            },
            operation: {
              value: data.operationFee.value,
              isPercent: data.operationFee.isPercent,
              minLimit: data.operationFee.minFeeLimit,
              maxLimit: data.operationFee.maxFeeLimit,
              description: 'Charged in the token being transferred'
            }
          },
          network: networkType,
          note: 'Amount must be within quota range'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get quota and fee'
      };
    }
  },
});
