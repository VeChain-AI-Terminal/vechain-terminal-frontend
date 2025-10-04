import { tool } from 'ai';
import { z } from 'zod';

export const getBlockHeight = tool({
  description: 'Get the most recent VeChain block height and information',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/block/height?VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block height: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            block_height: result.data.block_height,
            block_hash: result.data.block_hash,
            block_timestamp: result.data.block_timestamp,
            tx_count: result.data.tx_count,
          },
          meta: {
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch block height');
      }
    } catch (error) {
      console.error('Error fetching block height:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});