import { tool } from 'ai';
import { z } from 'zod';

export const getAPIPing = tool({
  description: 'Ping the VeChainStats API to ensure connection is live',
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/api-ping?VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to ping API: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            ping: result.data.ping,
          },
          meta: {
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to ping API');
      }
    } catch (error) {
      console.error('Error pinging API:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});
