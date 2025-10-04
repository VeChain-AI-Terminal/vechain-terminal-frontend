import { tool } from 'ai';
import { z } from 'zod';

export const verifyContract = tool({
  description: 'Submit a smart contract for verification on VeChain',
  inputSchema: z.object({
    address: z.string().describe('Contract address to verify'),
    stdJsonInput: z.object({}).describe('Solidity standard JSON input'),
    compilerVersion: z.string().describe('Compiler version (e.g., 0.8.7+commit.e28d00a7)'),
    contractIdentifier: z.string().describe('Contract identifier (e.g., contracts/Storage.sol:Storage)'),
    creationTransactionHash: z.string().describe('Transaction hash where contract was created'),
  }),
  execute: async ({ address, stdJsonInput, compilerVersion, contractIdentifier, creationTransactionHash }): Promise<any> => {
    try {
      const response = await fetch(
        `https://verify-api.vechainstats.com/v2/verify/100009/${address}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stdJsonInput,
            compilerVersion,
            contractIdentifier,
            creationTransactionHash,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to verify contract: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error verifying contract:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});