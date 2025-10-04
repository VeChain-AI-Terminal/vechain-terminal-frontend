import { tool } from 'ai';
import { z } from 'zod';

export const getNFTHolderList = tool({
  description: 'Get list of addresses holding NFTs from a specific project',
  inputSchema: z.object({
    id: z.string().describe('NFT project ID'),
    threshold: z.number().optional().describe('Minimum NFT count threshold'),
    page: z.number().optional().default(1).describe('Page number for pagination'),
  }),
  execute: async ({
    id,
    threshold,
    page = 1,
  }) => {
    try {
      let params = `id=${encodeURIComponent(id)}&page=${page}`;
      if (typeof threshold === 'number') params += `&threshold=${threshold}`;

      const response = await fetch(
        `https://api.vechainstats.com/v2/nft/holder-list?${params}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT holder list: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status && result.status.success) {
        // Convert the data object to an array of { address, count } objects
        const holders = Object.entries(result.data).map(([address, count]) => ({
          address,
          count,
        }));
        return {
          success: true,
          data: holders,
          meta: {
            count: result.meta.count,
            id: result.meta.id,
            threshold: result.meta.threshold,
            name: result.meta.name,
            contract: result.meta.contract,
            holders: result.meta.holders,
            timestamp: result.meta.timestamp,
          },
        };
      } else {
        throw new Error(result.status?.message || 'Failed to fetch NFT holder list');
      }
    } catch (error) {
      console.error('Error fetching NFT holder list:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});