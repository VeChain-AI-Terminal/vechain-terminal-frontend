import { tool } from 'ai';
import { z } from 'zod';

export const getNetworkStats = tool({
  description: 'Get VeChain network statistics for a specific timeframe',
  inputSchema: z.object({
    timeframe: z.string().describe('Date or period (e.g., 2023-09-01, 2023-09)'),
  }),
  execute: async ({ timeframe }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/network/stats?timeframe=${timeframe}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch network stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            block_count: result.data.block_count,
            block_total_size: result.data.block_total_size,
            txns_total_count: result.data.txns_total_count,
            txns_reverted: result.data.txns_reverted,
            txns_mtt: result.data.txns_mtt,
            txns_mpp: result.data.txns_mpp,
            txns_vip191: result.data.txns_vip191,
            clauses_total_count: result.data.clauses_total_count,
            vtho_total_paid: result.data.vtho_total_paid,
            vtho_total_rewarded: result.data.vtho_total_rewarded,
            vtho_total_burned: result.data.vtho_total_burned,
          },
          meta: {
            timeframe: result.meta.timeframe,
            days: result.meta.days,
            partial_data: result.meta.partial_data,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch network stats');
      }
    } catch (error) {
      console.error('Error fetching network stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});