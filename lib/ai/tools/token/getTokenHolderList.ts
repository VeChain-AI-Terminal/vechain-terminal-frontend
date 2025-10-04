import { tool } from 'ai';
import { z } from 'zod';

export const getTokenHolderList = tool({
  description: 'Get list of addresses holding a VIP180 token with their balances',
  inputSchema: z.object({
    token: z.string().describe('Token symbol (e.g., vet, vtho, oce, sha)'),
    threshold: z.number().optional().describe('Minimum token amount threshold'),
    page: z.number().optional().default(1).describe('Page number for pagination'),
  }),
  execute: async ({ token, threshold, page = 1 }) => {
    try {
      let params = `token=${(token as string).toLowerCase()}&page=${page}`;
      if (threshold) params += `&threshold=${threshold}`;
      
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/holder-list?${params}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token holder list: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: result.data,
          meta: {
            count: result.meta.count,
            page: result.meta.page,
            pages: result.meta.pages,
            per_page: result.meta.per_page,
            token: result.meta.token,
            threshold: result.meta.threshold,
            name: result.meta.name,
            symbol: result.meta.symbol,
            contract: result.meta.contract,
            total_holders: result.meta.holders,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch token holder list');
      }
    } catch (error) {
      console.error('Error fetching token holder list:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});