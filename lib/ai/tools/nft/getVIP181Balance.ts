import { tool } from 'ai';
import { z } from 'zod';

export const getVIP181Balance = tool({
  description: 'Get VIP181 NFT token balance for a VeChain address',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address'),
    id: z.string().optional().describe('Specific NFT project ID to check'),
    expanded: z.boolean().optional().default(true).describe('Include expanded NFT information'),
  }),
  execute: async ({
    address,
    id,
    expanded = true,
  }) => {
    try {
      const idParam = id ? `&id=${id}` : '';
      const response = await fetch(
        `https://api.vechainstats.com/v2/nft/vip181?address=${address}${idParam}&expanded=${expanded}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch VIP181 balance: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status && result.status.success) {
        // If a specific id is requested, structure the response for that project
        if (id && result.data && result.data[id]) {
          return {
            success: true,
            data: {
              id,
              name: result.data[id].name,
              amount: result.data[id].amount,
              contract: result.data[id].contract,
              token_ids: result.data[id].token_ids,
            },
            meta: {
              address: result.meta.address,
              id: result.meta.id,
              expanded: result.meta.expanded,
              nfts_total: result.meta.nfts_total,
              timestamp: result.meta.timestamp,
            }
          };
        }
        // Otherwise, return all NFT balances for the address
        return {
          success: true,
          data: result.data,
          meta: {
            address: result.meta.address,
            expanded: result.meta.expanded,
            nfts_total: result.meta.nfts_total,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(
          (result.status && result.status.message) ||
          'Failed to fetch VIP181 balance'
        );
      }
    } catch (error) {
      console.error('Error fetching VIP181 balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});