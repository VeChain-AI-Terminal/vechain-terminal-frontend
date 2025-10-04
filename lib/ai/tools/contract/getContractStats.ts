import { tool } from 'ai';
import { z } from 'zod';

export const getContractStats = tool({
  description: 'Get statistics on total, new, and active contracts on VeChain',
  inputSchema: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    expanded: z.boolean().optional().default(true).describe('Include expanded statistics'),
  }),
  execute: async ({ date, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/contract/stats?date=${date}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contract stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            contracts_total: result.data.contracts_total,
            contracts_new: result.data.contracts_new,
            contracts_active: result.data.contracts_active,
          },
          meta: {
            date: result.meta.date,
            expanded: result.meta.expanded,
            partial_data: result.meta.partial_data,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch contract stats');
      }
    } catch (error) {
      console.error('Error fetching contract stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});