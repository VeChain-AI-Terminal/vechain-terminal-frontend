import { tool } from 'ai';
import { z } from 'zod';

export const getTransactionsOut = tool({
  description: 'Get outgoing transactions from a VeChain address with pagination support',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address'),
    page: z.number().optional().default(1).describe('Page number for pagination'),
    sort: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order by timestamp'),
  }),
  execute: async ({ address, page = 1, sort = 'desc' }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/txout?address=${address}&page=${page}&sort=${sort}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (result.status && result.status.success) {
        // Map the transactions to include only relevant fields for clarity
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
        throw new Error(result.status?.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions out:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});