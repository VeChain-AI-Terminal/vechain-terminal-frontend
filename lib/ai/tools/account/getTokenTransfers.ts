import { tool } from 'ai';
import { z } from 'zod';

export const getTokenTransfers = tool({
  description: 'Get VIP180 token transfers where an address is either sender or receiver',
  parameters: z.object({
    address: z.string().describe('VeChain wallet address'),
    token_type: z.enum(['vip180']).optional().default('vip180').describe('Token type'),
    page: z.number().optional().default(1).describe('Page number for pagination'),
    sort: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order by timestamp'),
  }),
  execute: async ({ address, token_type = 'vip180', page = 1, sort = 'desc' }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/token-transfers?token_type=${token_type}&address=${address}&page=${page}&sort=${sort}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token transfers: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (result?.status?.success) {
        return {
          success: true,
          data: Array.isArray(result.data)
            ? result.data.map((item: any) => ({
                txid: item.txid,
                clause_index: item.clause_index,
                event_index: item.event_index,
                sender: item.sender,
                receiver: item.receiver,
                block_height: item.block_height,
                block_timestamp: item.block_timestamp,
                token: item.token,
                token_symbol: item.token_symbol,
                token_name: item.token_name,
                token_contract: item.token_contract,
                token_decimals: item.token_decimals,
                amount: item.amount,
              }))
            : [],
          meta: {
            token_type: result.meta?.token_type,
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
        throw new Error(result?.status?.message || 'Failed to fetch token transfers');
      }
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});