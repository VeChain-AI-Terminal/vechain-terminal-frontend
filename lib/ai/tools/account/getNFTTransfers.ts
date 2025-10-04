import { tool } from 'ai';
import { z } from 'zod';

export const getNFTTransfers = tool({
  description: 'Get NFT transfers where an address is either sender or receiver',
  parameters: z.object({
    address: z.string().describe('VeChain wallet address'),
    page: z.number().optional().default(1).describe('Page number for pagination'),
    sort: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order by timestamp'),
  }),
  execute: async ({
    address,
    page = 1,
    sort = 'desc',
  }: {
    address: string;
    page?: number;
    sort?: 'asc' | 'desc';
  }) => {
    try {
      const apiKey = process.env.VCS_API_KEY;
      if (!apiKey) {
        throw new Error('VCS_API_KEY is not set in environment variables');
      }

      const url = new URL('https://api.vechainstats.com/v2/account/nft-transfers');
      url.searchParams.set('address', address);
      url.searchParams.set('page', String(page));
      url.searchParams.set('sort', sort);
      url.searchParams.set('VCS_API_KEY', apiKey);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT transfers: ${response.statusText}`);
      }

      const result = await response.json();

      if (result?.status?.success) {
        // Map the response to a more descriptive structure
        return {
          success: true,
          data: Array.isArray(result.data)
            ? result.data.map((item: any) => ({
                txid: item.txid,
                clause_index: item.clause_index,
                sender: item.sender,
                receiver: item.receiver,
                block_height: item.block_height,
                block_timestamp: item.block_timestamp,
                nft_project_id: item.nft_project_id,
                nft_name: item.nft_name,
                nft_contract: item.nft_contract,
                nft_token_id: item.nft_token_id,
                type: item.type,
              }))
            : [],
          meta: {
            address: result.meta?.address,
            count: result.meta?.count,
            page: result.meta?.page,
            pages: result.meta?.pages,
            per_page: result.meta?.per_page,
            sort: result.meta?.sort,
            timestamp: result.meta?.timestamp,
          },
        };
      } else {
        throw new Error(result?.status?.message || 'Failed to fetch NFT transfers');
      }
    } catch (error) {
      console.error('Error fetching NFT transfers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});