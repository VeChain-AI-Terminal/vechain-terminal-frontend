import { tool } from 'ai';
import { z } from 'zod';

export const getBlockInfo = tool({
  description: 'Get metadata and raw block information for a VeChain block',
  parameters: z.object({
    blocknum: z.number().describe('Block number'),
  }),
  execute: async ({ blocknum }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/block/info?blocknum=${blocknum}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            gas_target_perc: result.data.gas_target_perc,
            txns_total_count: result.data.txns_total_count,
            txns_reverted: result.data.txns_reverted,
            txns_mtt: result.data.txns_mtt,
            clauses_total_count: result.data.clauses_total_count,
            vtho_total_paid: result.data.vtho_total_paid,
            vtho_total_rewarded: result.data.vtho_total_rewarded,
            vtho_total_burned: result.data.vtho_total_burned,
          },
          block: result.block,
          meta: {
            blocknum: result.meta.blocknum,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch block info');
      }
    } catch (error) {
      console.error('Error fetching block info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});