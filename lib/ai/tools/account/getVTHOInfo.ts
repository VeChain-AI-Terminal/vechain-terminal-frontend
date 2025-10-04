import { tool } from 'ai';
import { z } from 'zod';

export const getVTHOInfo = tool({
  description: 'Get VTHO generation and usage information for an address - paid, generated, and sponsored VTHO',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address'),
  }),
  execute: async ({ address }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/vtho-info?address=${address}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch VTHO info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            vtho_paid: result.data.vtho_paid,
            vtho_generated: result.data.vtho_generated,
            vtho_sponsored: result.data.vtho_sponsored,
          },
          meta: {
            address: result.meta.address,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch VTHO info');
      }
    } catch (error) {
      console.error('Error fetching VTHO info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});