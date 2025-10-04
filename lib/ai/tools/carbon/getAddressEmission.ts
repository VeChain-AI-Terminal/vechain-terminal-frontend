import { tool } from 'ai';
import { z } from 'zod';

export const getAddressEmission = tool({
  description: 'Get CO2 emissions emitted and incoming for a VeChain address',
  parameters: z.object({
    address: z.string().describe('VeChain wallet address'),
  }),
  execute: async ({ address }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/carbon/co2e-address?address=${address}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch address emissions: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            alias: result.data.vcs_alias,
            has_code: result.data.has_code,
            co2e_emitted: result.data.co2e_emitted,
            co2e_incoming: result.data.co2e_incoming,
          },
          meta: {
            address: result.meta.address,
            type: result.meta.type,
            unit: result.meta.unit,
            disclaimer: result.meta.disclaimer,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch address emissions');
      }
    } catch (error) {
      console.error('Error fetching address emissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});