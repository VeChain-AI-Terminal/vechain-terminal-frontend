import { tool } from 'ai';
import { z } from 'zod';

export const getBlockByTimestamp = tool({
  description: 'Get the next VeChain block produced at or after a given timestamp',
  inputSchema: z.object({
    blockts: z.number().describe('Unix timestamp'),
  }),
  execute: async ({ blockts }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/block/blocktime?blockts=${blockts}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block by timestamp: ${response.statusText}`);
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
            blockts: result.meta.blockts,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch block by timestamp');
      }
    } catch (error) {
      console.error('Error fetching block by timestamp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});