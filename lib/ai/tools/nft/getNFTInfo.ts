import { tool } from 'ai';
import { z } from 'zod';

export const getNFTInfo = tool({
  description: 'Get contract and social information about a VeChain NFT project',
  inputSchema: z.object({
    id: z.string().describe('NFT project ID'),
    expanded: z.boolean().optional().default(true).describe('Include expanded information'),
  }),
  execute: async ({
    id,
    expanded = true,
  }: {
    id: string;
    expanded?: boolean;
  }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/nft/info?id=${id}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT info: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status && result.status.success) {
        // Structure the response to include all relevant fields as in the docs
        return {
          success: true,
          data: {
            name: result.data.name,
            type: result.data.type,
            contract: result.data.contract,
            creation_timestamp: result.data.creation_timestamp,
            creation_block: result.data.creation_block,
            deployer_address: result.data.deployer_address,
            website: result.data.website,
            telegram: result.data.telegram,
            twitter: result.data.twitter,
            reddit: result.data.reddit,
            medium: result.data.medium,
            github: result.data.github,
            token_holders: result.data.token_holders,
          },
          meta: {
            id: result.meta.id,
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          },
        };
      } else {
        throw new Error(
          (result.status && result.status.message) ||
            "Failed to fetch NFT info"
        );
      }
    } catch (error) {
      console.error("Error fetching NFT info:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});