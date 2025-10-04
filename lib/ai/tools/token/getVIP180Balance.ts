import { tool } from 'ai';
import { z } from 'zod';

export const getVIP180Balance = tool({
  description: 'Get all VIP180 token balances for a VeChain address',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address'),
    expanded: z.boolean().optional().default(false).describe('Include expanded token information'),
  }),
  execute: async ({ address, expanded = false }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/vip180?address=${address}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch VIP180 balances: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: result.data,
          meta: {
            address: result.meta.address,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch VIP180 balances');
      }
    } catch (error) {
      console.error('Error fetching VIP180 balances:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});