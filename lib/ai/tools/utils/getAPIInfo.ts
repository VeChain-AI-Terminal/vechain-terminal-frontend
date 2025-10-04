import { tool } from 'ai';
import { z } from 'zod';

export const getAPIInfo = tool({
  description: 'Get information about your VeChainStats API key plan and usage limits',
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/api-info?VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            plan: result.data.plan,
            daily_limit: result.data.daily_limit,
            daily_used: result.data.daily_used,
            daily_remaining: result.data.daily_remaining,
            user_note: result.data.user_note,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch API info');
      }
    } catch (error) {
      console.error('Error fetching API info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});