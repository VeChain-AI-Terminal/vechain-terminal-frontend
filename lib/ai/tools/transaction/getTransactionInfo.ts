import { tool } from 'ai';
import { z } from 'zod';

export const getTransactionInfo = tool({
  description: 'Get detailed information and receipt for a VeChain transaction',
  inputSchema: z.object({
    txid: z.string().describe('Transaction hash/ID'),
  }),
  execute: async ({ txid }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/transaction/info?txid=${txid}`,
        {
          headers: {
            'X-API-Key': process.env.VCS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            status: result.data.status,
            block_height: result.data.block_height,
            block_timestamp: result.data.block_timestamp,
            vtho_paid: result.data.vtho_paid,
            transaction: result.transaction,
            receipt: result.receipt,
          },
          meta: {
            txid: result.meta.txid,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch transaction info');
      }
    } catch (error) {
      console.error('Error fetching transaction info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});