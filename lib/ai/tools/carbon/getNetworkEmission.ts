import { tool } from 'ai';
import { z } from 'zod';

export const getNetworkEmission = tool({
  description: 'Get CO2 emissions data for the VeChain network for a given timeframe',
  inputSchema: z.object({
    timeframe: z.string().describe('Date or period (e.g., 2023-09 for month, 2023-09-01 for day)'),
  }),
  execute: async ({ timeframe }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/carbon/co2e-network?timeframe=${timeframe}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch network emissions: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            co2e_emitted: result.data.co2e_emitted,
            co2e_clause_avg: result.data.co2e_clause_avg,
          },
          meta: {
            timeframe: result.meta.timeframe,
            type: result.meta.type,
            unit: result.meta.unit,
            days: result.meta.days,
            partial_data: result.meta.partial_data,
            disclaimer: result.meta.disclaimer,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch network emissions');
      }
    } catch (error) {
      console.error('Error fetching network emissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});