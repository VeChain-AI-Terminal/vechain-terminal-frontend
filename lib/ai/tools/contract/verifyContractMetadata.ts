import { tool } from 'ai';
import { z } from 'zod';

export const verifyContractMetadata = tool({
  description: 'Submit a smart contract for verification using Solidity metadata.json',
  parameters: z.object({
    address: z.string().describe('Contract address to verify'),
    sources: z.record(z.string()).describe('Contract source files'),
    metadata: z.object({}).describe('Solidity metadata object'),
  }),
  execute: async ({ address, sources, metadata }) => {
    try {
      const response = await fetch(
        `https://verify-api.vechainstats.com/v2/verify/metadata/100009/${address}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sources,
            metadata,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to verify contract metadata: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return {
        success: true,
        data: {
          verificationId: result.verificationId,
        },
      };
    } catch (error) {
      console.error('Error verifying contract metadata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});

