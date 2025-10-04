import { tool } from 'ai';
import { z } from 'zod';

export const getExtendedAccountStats = tool({
  description: 'Get extended statistics on accounts including 7-day activity metrics (Premium endpoint)',
  parameters: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
  }),
  execute: async ({ date }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vedev.io/v2/account/extended-stats?date=${date}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch extended account stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            addresses_known: result.data.addresses_known,
            addresses_new: result.data.addresses_new,
            addresses_active: result.data.addresses_active,
            addresses_active_7d: result.data.addresses_active_7d,
            addresses_seen: result.data.addresses_seen,
            addresses_seen_7d: result.data.addresses_seen_7d,
            contracts_known: result.data.contracts_known,
            contracts_new: result.data.contracts_new,
            contracts_active: result.data.contracts_active,
          },
          meta: {
            date: result.meta.date,
            partial_data: result.meta.partial_data,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch extended account stats');
      }
    } catch (error) {
      console.error('Error fetching extended account stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});