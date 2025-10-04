import { tool } from 'ai';
import { z } from 'zod';

export const getMempool = tool({
  description: 'Get information on the status of the VeChain mempool',
  inputSchema: z.object({
    expanded: z.boolean().optional().default(true).describe('Include transaction list'),
  }),
  execute: async ({ expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/network/mempool?expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch mempool: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          success: true,
          data: {
            pending_txns: result.data.pending_txns,
            total_clauses: result.data.total_clauses,
            total_size: result.data.total_size,
            txlist: result.data.txlist,
          },
          meta: {
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.message || 'Failed to fetch mempool');
      }
    } catch (error) {
      console.error('Error fetching mempool:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});