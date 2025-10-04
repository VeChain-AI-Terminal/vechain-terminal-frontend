import { tool } from 'ai';
import { z } from 'zod';

export const getNFTList = tool({
  description: 'Get a list of all NFT projects supported on VeChain',
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/nft/list?VCS_API_KEY=${process.env.VCS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT list: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status && result.status.success) {
        // Structure the response to match the vechainstats API docs example
        return {
          success: true,
          data: result.data.map((nft: any) => ({
            id: nft.id,
            name: nft.name,
            type: nft.type,
            nfts: nft.nfts,
            contract: nft.contract,
          })),
          meta: {
            count: result.meta.count,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(
          (result.status && result.status.message) ||
          "Failed to fetch NFT list"
        );
      }
    } catch (error) {
      console.error("Error fetching NFT list:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },
});