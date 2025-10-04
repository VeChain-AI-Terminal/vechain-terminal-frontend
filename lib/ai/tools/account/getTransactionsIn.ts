import { tool } from 'ai';
import { z } from 'zod';

export const getTransactionsIn = tool({
  description: 'Get incoming transactions to a VeChain address with pagination support',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address'),
    page: z.number().optional().default(1).describe('Page number for pagination'),
    sort: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order by timestamp'),
  }),
  execute: async ({ address, page = 1, sort = 'desc' }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/txin?address=${address}&page=${page}&sort=${sort}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch transactions: ${response.statusText}`,
        };
      }

      const result = await response.json();

      if (
        result &&
        result.status &&
        typeof result.status.success === 'boolean'
      ) {
        if (result.status.success) {
          // Map the transaction data to proper structure
          const transactions = Array.isArray(result.data) 
            ? result.data.map((tx: any) => ({
                txid: tx.txid,
                status: tx.status,
                block_height: tx.block_height,
                block_timestamp: tx.block_timestamp,
                clauses: tx.clauses,
                vtho_paid: tx.vtho_paid,
              }))
            : [];

          return {
            success: true,
            data: transactions,
            meta: {
              address: result.meta?.address ?? address,
              count: result.meta?.count ?? 0,
              page: result.meta?.page ?? page,
              pages: result.meta?.pages ?? 0,
              per_page: result.meta?.per_page ?? 0,
              sort: result.meta?.sort ?? sort,
              timestamp: result.meta?.timestamp,
            },
          };
        } else {
          return {
            success: false,
            error: result.status.message || 'Failed to fetch transactions',
          };
        }
      } else {
        return {
          success: false,
          error: 'Unexpected response format from vechainstats API',
        };
      }
    } catch (error) {
      console.error('Error fetching incoming transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});