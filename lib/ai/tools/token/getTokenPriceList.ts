import { tool } from 'ai';
import { z } from 'zod';

export const getTokenPriceList = tool({
  description: 'Get prices for all VeChain tokens that have price data available',
  inputSchema: z.object({
    expanded: z.boolean().optional().default(false).describe('Include expanded price information'),
  }),
  execute: async ({ expanded = false }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/price-list?expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token price list: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: result.data,
          meta: {
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch token price list');
      }
    } catch (error) {
      console.error('Error fetching token price list:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});