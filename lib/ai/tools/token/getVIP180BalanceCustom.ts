import { tool } from 'ai';
import { z } from 'zod';

export const getVIP180BalanceCustom = tool({
  description: 'Get balance of a specific VIP180 token contract for an address',
  parameters: z.object({
    address: z.string().describe('VeChain wallet address'),
    contract: z.string().describe('VIP180 token contract address'),
  }),
  execute: async ({ address, contract }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/vip180-custom?address=${address}&contract=${contract}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch custom VIP180 balance: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            amount: result.data.amount,
          },
          meta: {
            address: result.meta.address,
            contract: result.meta.contract,
            symbol: result.meta.symbol,
            decimals: result.meta.decimals,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch custom VIP180 balance');
      }
    } catch (error) {
      console.error('Error fetching custom VIP180 balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});