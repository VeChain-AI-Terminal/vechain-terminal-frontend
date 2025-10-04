import { tool } from 'ai';
import { z } from 'zod';

export const getBlockEmission = tool({
  description: 'Get CO2 emissions for producing a specific VeChain block',
  parameters: z.object({
    blocknum: z.number().describe('Block number'),
  }),
  execute: async ({ blocknum }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/carbon/co2e-block?blocknum=${blocknum}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block emissions: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            number: result.data.number,
            hash: result.data.hash,
            co2e_emitted: result.data.co2e_emitted,
            timestamp: result.data.timestamp,
          },
          meta: {
            blocknum: result.meta.blocknum,
            type: result.meta.type,
            unit: result.meta.unit,
            disclaimer: result.meta.disclaimer,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch block emissions');
      }
    } catch (error) {
      console.error('Error fetching block emissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});