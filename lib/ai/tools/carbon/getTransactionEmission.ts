import { tool } from 'ai';
import { z } from 'zod';

export const getTransactionEmission = tool({
  description: 'Get CO2 emissions for a VeChain transaction',
  inputSchema: z.object({
    txid: z.string().describe('Transaction hash/ID'),
  }),
  execute: async ({ txid }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/carbon/co2e-transaction?txid=${txid}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction emissions: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            co2e_emitted: result.data.co2e_emitted,
          },
          meta: {
            txid: result.meta.txid,
            type: result.meta.type,
            unit: result.meta.unit,
            disclaimer: result.meta.disclaimer,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch transaction emissions');
      }
    } catch (error) {
      console.error('Error fetching transaction emissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});