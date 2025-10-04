import { tool } from 'ai';
import { z } from 'zod';

export const getTokenList = tool({
  description: 'Get a list of all VIP180 and native tokens supported on VeChain',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/token/list?VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: result.data,
          meta: {
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch token list');
      }
    } catch (error) {
      console.error('Error fetching token list:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});