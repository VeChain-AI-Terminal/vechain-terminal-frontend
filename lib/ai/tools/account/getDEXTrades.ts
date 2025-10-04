import { tool } from 'ai';
import { z } from 'zod';

export const getDEXTrades = tool({
  description: 'Get DEX trades executed by a VeChain address',
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
      const url = `https://api.vechainstats.com/v2/account/dex-trades?address=${address}&page=${page}&sort=${sort}&VCS_API_KEY=${process.env.VCS_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch DEX trades: ${response.statusText}`);
      }

      const result = await response.json();

      if (result?.status?.success) {
        // The API returns an array of trade objects in result.data and meta info in result.meta
        return {
          success: true,
          data: Array.isArray(result.data) ? result.data.map((trade: any) => ({
            txid: trade.txid,
            origin: trade.origin,
            block_height: trade.block_height,
            block_timestamp: trade.block_timestamp,
            platform: trade.platform,
            input_token: trade.input_token,
            input_amount: trade.input_amount,
            output_token: trade.output_token,
            output_amount: trade.output_amount,
          })) : [],
          meta: {
            address: result.meta?.address,
            count: result.meta?.count,
            page: result.meta?.page,
            pages: result.meta?.pages,
            per_page: result.meta?.per_page,
            sort: result.meta?.sort,
            timestamp: result.meta?.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch DEX trades');
      }
    } catch (error) {
      console.error('Error fetching DEX trades:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});