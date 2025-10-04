import { tool } from 'ai';
import { z } from 'zod';

export const getAccountStats = tool({
  description: 'Get statistics on total, new, active and seen accounts on VeChain',
  inputSchema: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    expanded: z.boolean().optional().default(true).describe('Include expanded statistics'),
  }),
  execute: async ({ date, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/stats?date=${date}&expanded=${expanded}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch account stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            addresses_known: result.data.addresses_known,
            addresses_new: result.data.addresses_new,
            addresses_active: result.data.addresses_active,
            addresses_seen: result.data.addresses_seen,
          },
          meta: {
            date: result.meta.date,
            expanded: result.meta.expanded,
            partial_data: result.meta.partial_data,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch account stats');
      }
    } catch (error) {
      console.error('Error fetching account stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});