import { tool } from 'ai';
import { z } from 'zod';

export const getTokenPrice = tool({
  description: 'Get the current price of a VeChain token in USD, EUR, CNY, and VET',
  parameters: z.object({
    token: z.string().describe('Token symbol (e.g., vet, vtho, oce, sha)'),
    expanded: z.boolean().optional().default(true).describe('Include expanded price information'),
  }),
  execute: async ({ token, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/price?token=${token.toLowerCase()}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token price: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            price_usd: result.data.price_usd,
            price_eur: result.data.price_eur,
            price_cny: result.data.price_cny,
            price_vet: result.data.price_vet,
            last_updated: result.data.last_updated,
          },
          meta: {
            token: result.meta.token,
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch token price');
      }
    } catch (error) {
      console.error('Error fetching token price:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});