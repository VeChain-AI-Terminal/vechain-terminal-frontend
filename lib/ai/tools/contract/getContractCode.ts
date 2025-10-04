import { tool } from 'ai';
import { z } from 'zod';

export const getContractCode = tool({
  description: 'Get verified contract source code from VeChainStats',
  parameters: z.object({
    address: z.string().describe('Contract address'),
    expanded: z.boolean().optional().default(true).describe('Include expanded information'),
  }),
  execute: async ({ address, expanded = true }) => {
    try {
      const response = await fetch(
        `https://api.vechainstats.com/v2/contract/code?address=${address}&expanded=${expanded}&VCS_API_KEY=${process.env.VCS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contract code: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status.success) {
        return {
          success: true,
          data: {
            // Contract code data fields - need to check API docs for exact fields
            sources: result.data.sources,
            abi: result.data.abi,
            contract_name: result.data.contract_name,
            compiler_version: result.data.compiler_version,
            optimization_enabled: result.data.optimization_enabled,
            optimization_runs: result.data.optimization_runs,
            constructor_arguments: result.data.constructor_arguments,
            library_info: result.data.library_info,
          },
          meta: {
            address: result.meta.address,
            expanded: result.meta.expanded,
            timestamp: result.meta.timestamp,
          }
        };
      } else {
        throw new Error(result.status.message || 'Failed to fetch contract code');
      }
    } catch (error) {
      console.error('Error fetching contract code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});
