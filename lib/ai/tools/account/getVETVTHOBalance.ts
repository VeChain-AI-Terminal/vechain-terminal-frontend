import { tool } from 'ai';
import { z } from 'zod';

export const getVETVTHOBalance = tool({
  description: 'Get VET and VTHO balance for a VeChain address. Returns the native VET balance, VTHO balance, and staked VET amount.',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address to check balance for'),
  }),
  execute: async ({ address }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/vet-vtho?address=${address}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            vet: result.data.vet,
            vet_staked: result.data.vet_staked,
            vtho: result.data.vtho,
          },
          meta: {
            address: result.meta.address,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch balance');
      }
    } catch (error) {
      console.error('Error fetching VET/VTHO balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});