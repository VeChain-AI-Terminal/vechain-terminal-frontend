import { tool } from 'ai';
import { z } from 'zod';

export const getBlockByReference = tool({
  description: 'Get block number and variables for a given block reference (blockref)',
  parameters: z.object({
    blockref: z.string().describe('Block reference (e.g., 0x00fb6fb52e0d6d67)'),
  }),
  execute: async ({ blockref }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/block/blockref?blockref=${blockref}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block by reference: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            number: result.data.number,
            hash: result.data.hash,
            timestamp: result.data.timestamp,
          },
          meta: {
            blockref: result.meta.blockref,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch block by reference');
      }
    } catch (error) {
      console.error('Error fetching block by reference:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});