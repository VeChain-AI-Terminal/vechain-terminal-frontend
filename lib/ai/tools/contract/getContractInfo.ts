import { tool } from 'ai';
import { z } from 'zod';

export const getContractInfo = tool({
  description: 'Get information and metadata about a VeChain smart contract',
  parameters: z.object({
    address: z.string().describe('Contract address'),
    expanded: z.boolean().optional().default(true).describe('Include expanded information'),
  }),
  execute: async ({ address, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/contract/info?address=${address}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contract info: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            contract_name: result.data.contract_name,
            vcs_alias: result.data.vcs_alias,
            type: result.data.type,
            balance_vet: result.data.balance_vet,
            balance_vtho: result.data.balance_vtho,
            contract_total_supply: result.data.contract_total_supply,
            creation_block: result.data.creation_block,
            creation_txid: result.data.creation_txid,
            creation_timestamp: result.data.creation_timestamp,
            creation_type: result.data.creation_type,
            deployer_address: result.data.deployer_address,
            master_address: result.data.master_address,
            has_interface: result.data.has_interface,
            has_total_supply: result.data.has_total_supply,
            has_txns_in: result.data.has_txns_in,
            has_txns_out: result.data.has_txns_out,
            nft_royalties: result.data.nft_royalties,
            token_decimals: result.data.token_decimals,
            token_symbol: result.data.token_symbol,
          },
          meta: {
            address: result.meta.address,
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch contract info');
      }
    } catch (error) {
      console.error('Error fetching contract info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});