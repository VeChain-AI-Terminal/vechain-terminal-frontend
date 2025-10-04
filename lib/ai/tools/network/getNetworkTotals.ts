import { tool } from 'ai';
import { z } from 'zod';

export const getNetworkTotals = tool({
  description: 'Get total key metrics of the VeChain blockchain since genesis',
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/network/totals?VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch network totals: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            block_count: result.data.block_count,
            txns_total_count: result.data.txns_total_count,
            clauses_total_count: result.data.clauses_total_count,
            vtho_total_burned: result.data.vtho_total_burned,
          },
          meta: {
            days: result.meta.days,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch network totals');
      }
    } catch (error) {
      console.error('Error fetching network totals:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});