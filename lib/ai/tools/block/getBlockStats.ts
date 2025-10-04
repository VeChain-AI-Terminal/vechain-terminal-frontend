import { tool } from 'ai';
import { z } from 'zod';

export const getBlockStats = tool({
  description: 'Get metadata and statistics of blocks produced on a given date',
  inputSchema: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    expanded: z.boolean().optional().default(true).describe('Include expanded statistics'),
  }),
  execute: async ({ date, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/block/stats?date=${date}&expanded=${expanded}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            block_height_first: result.data.block_height_first,
            block_height_last: result.data.block_height_last,
            block_count: result.data.block_count,
            block_total_size: result.data.block_total_size,
            block_total_gas_limit: result.data.block_total_gas_limit,
            block_total_gas_used: result.data.block_total_gas_used,
            txns_total_count: result.data.txns_total_count,
            clauses_total_count: result.data.clauses_total_count,
            vtho_total_paid: result.data.vtho_total_paid,
            vtho_total_rewarded: result.data.vtho_total_rewarded,
            vtho_total_burned: result.data.vtho_total_burned,
          },
          meta: {
            date: result.meta.date,
            expanded: result.meta.expanded,
            partial_data: result.meta.partial_data,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch block stats');
      }
    } catch (error) {
      console.error('Error fetching block stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});