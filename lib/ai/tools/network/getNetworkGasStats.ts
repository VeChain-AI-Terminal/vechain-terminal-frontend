import { tool } from 'ai';
import { z } from 'zod';

export const getNetworkGasStats = tool({
  description: 'Get gas limit and gas used statistics for VeChain network on a given date',
  parameters: z.object({
    timeframe: z.string().describe('Date or period (e.g., 2023-09-28)'),
  }),
  execute: async ({ timeframe }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/network/gas-stats?timeframe=${timeframe}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch network gas stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            block_count: result.data.block_count,
            gas_total_limit: result.data.gas_total_limit,
            gas_total_used: result.data.gas_total_used,
            gas_intrinsic: result.data.gas_intrinsic,
            gas_evm_incurred: result.data.gas_evm_incurred,
            gas_target_perc: result.data.gas_target_perc,
          },
          meta: {
            timeframe: result.meta.timeframe,
            days: result.meta.days,
            partial_data: result.meta.partial_data,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch network gas stats');
      }
    } catch (error) {
      console.error('Error fetching network gas stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});