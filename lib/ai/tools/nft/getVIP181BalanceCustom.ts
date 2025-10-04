import { tool } from 'ai';
import { z } from 'zod';

export const getVIP181BalanceCustom = tool({
  description: 'Get VIP181 NFT balance for a given address and contract',
  parameters: z.object({
    address: z.string().describe('VeChain wallet address'),
    contract: z.string().describe('VIP181 NFT contract address'),
  }),
  execute: async ({ address, contract }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/nft/vip181-custom?address=${address}&contract=${contract}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch custom VIP181 balance: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            amount: result.data.amount,
          },
          meta: {
            address: result.meta.address,
            contract: result.meta.contract,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch custom VIP181 balance');
      }
    } catch (error) {
      console.error('Error fetching custom VIP181 balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});