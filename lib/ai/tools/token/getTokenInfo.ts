import { tool } from 'ai';
import { z } from 'zod';

export const getTokenInfo = tool({
  description: 'Get detailed information about a VeChain token including socials, holder count, and contract details',
  inputSchema: z.object({
    token: z.string().describe('Token symbol (e.g., vet, vtho, oce, sha)'),
    expanded: z.boolean().optional().default(true).describe('Include expanded information'),
  }),
  execute: async ({ token, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/info?token=${token.toLowerCase()}&expanded=${expanded}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: result.data,
          meta: {
            symbol: result.meta.symbol,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch token info');
      }
    } catch (error) {
      console.error('Error fetching token info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});