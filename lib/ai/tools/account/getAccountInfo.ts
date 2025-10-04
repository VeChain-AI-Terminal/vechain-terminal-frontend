import { tool } from 'ai';
import { z } from 'zod';

export const getAccountInfo = tool({
  description: 'Get detailed information about a VeChain account including balances, first/last seen blocks, and transaction history indicators',
  parameters: z.object({
    address: z.string().describe('VeChain wallet address'),
    expanded: z.boolean().optional().default(true).describe('Include expanded information'),
  }),
  execute: async ({ address, expanded = true }): Promise<any> => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/account/info?address=${address}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch account info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            alias: result.data.vcs_alias,
            has_code: result.data.has_code,
            node_type: result.data.node_type,
            balance_vet: result.data.balance_vet,
            balance_vtho: result.data.balance_vtho,
            first_seen_block: result.data.first_seen_block,
            first_seen_timestamp: result.data.first_seen_timestamp,
            last_seen_block: result.data.last_seen_block,
            last_seen_timestamp: result.data.last_seen_timestamp,
            has_txns_in: result.data.has_txns_in,
            has_txns_out: result.data.has_txns_out,
          },
          meta: {
            address: result.meta.address,
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch account info');
      }
    } catch (error) {
      console.error('Error fetching account info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});