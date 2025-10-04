import { tool } from 'ai';
import { z } from 'zod';

export const getHistoricBalance = tool({
  description: 'Get historic VET/VTHO balance for an address on a specific date or block',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address'),
    date: z.string().optional().describe('Date in YYYY-MM-DD format'),
    blocknum: z.number().optional().describe('Specific block number'),
  }),
  execute: async ({ address, date, blocknum }) => {
    try {
      let params = `address=${address}`;
      if (date) params += `&date=${date}`;
      if (blocknum) params += `&blocknum=${blocknum}`;
      
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/historic-vet-vtho?${params}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historic balance: ${response.statusText}`);
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
            blocknum: result.meta.blocknum,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch historic balance');
      }
    } catch (error) {
      console.error('Error fetching historic balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});