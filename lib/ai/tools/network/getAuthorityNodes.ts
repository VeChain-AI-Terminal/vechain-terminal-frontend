import { tool } from 'ai';
import { z } from 'zod';

export const getAuthorityNodes = tool({
  description: 'Get list of all VeChain authority nodes and their relevant data',
  parameters: z.object({
    expanded: z.boolean().optional().default(true).describe('Include expanded information'),
  }),
  execute: async ({ expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/network/authority-nodes?expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch authority nodes: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status.success) {
        // Transform the data object into an array of authority node info
        const nodes = Object.entries(result.data).map(([address, nodeInfo]) => ({
          address,
          endorser: nodeInfo.endorser,
          blocks_total_signed: nodeInfo.blocks_total_signed,
          vtho_total_rewarded: nodeInfo.vtho_total_rewarded,
          last_block_signed: nodeInfo.last_block_signed,
          last_block_timestamp: nodeInfo.last_block_timestamp,
        }));

        return {
          success: true,
          data: nodes,
          meta: {
            count: result.meta.count,
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch authority nodes');
      }
    } catch (error) {
      console.error('Error fetching authority nodes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});