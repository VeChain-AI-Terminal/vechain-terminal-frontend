import { tool } from 'ai';
import { z } from 'zod';

export const getTransactionStatus = tool({
  description: 'Get the status and possible EVM error of a VeChain transaction',
  inputSchema: z.object({
    txid: z.string().describe('Transaction hash/ID'),
  }),
  execute: async ({ txid }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/transaction/status?txid=${txid}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction status: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            status: result.data.status,
            block_height: result.data.block_height,
            vcs_evm_error: result.data.vcs_evm_error,
          },
          meta: {
            txid: result.meta.txid,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch transaction status');
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});