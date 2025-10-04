import { tool } from 'ai';
import { z } from 'zod';

export const getTokenSupply = tool({
  description: 'Get the total, max and circulating supply of a VeChain token',
  inputSchema: z.object({
    token: z.string().describe('Token symbol (e.g., vet, vtho, oce, sha)'),
  }),
  execute: async ({ token }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/supply?token=${token.toLowerCase()}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token supply: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            circulating_supply: result.data.circulating_supply,
            total_supply: result.data.total_supply,
            max_supply: result.data.max_supply,
            max_supply_is_infinite: result.data.max_supply_is_infinite,
          },
          meta: {
            token: result.meta.token,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch token supply');
      }
    } catch (error) {
      console.error('Error fetching token supply:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});