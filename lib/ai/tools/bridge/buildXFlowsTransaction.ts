import { tool } from 'ai';
import { z } from 'zod';

const XFLOWS_API = 'https://xflows.wanchain.org/api/v3';

export const buildXFlowsTransaction = tool({
  description: 'Build cross-chain swap transaction using XFlows',
  inputSchema: z.object({
    fromChainId: z.number().describe('Source chain ID (e.g., 100010 for VeChain testnet)'),
    toChainId: z.number().describe('Destination chain ID'),
    fromTokenAddress: z.string().describe('Source token contract address'),
    toTokenAddress: z.string().describe('Destination token contract address'),
    fromAddress: z.string().describe('Sender wallet address'),
    toAddress: z.string().describe('Recipient wallet address'),
    fromAmount: z.string().describe('Amount to swap/bridge'),
    bridge: z.enum(['wanbridge', 'quix']).optional().default('wanbridge').describe('Bridge to use'),
    dex: z.enum(['wanchain', 'rubic']).optional().describe('DEX to use for swaps'),
    slippage: z.number().optional().default(0.01).describe('Slippage tolerance (e.g., 0.01 for 1%)'),
  }),
  execute: async (parameters): Promise<any> => {
    try {
      const response = await fetch(`${XFLOWS_API}/buildTx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters)
      });

      const result = await response.json() as any;

      if (!result.success) {
        throw new Error(result.data?.error || 'Failed to build XFlows transaction');
      }

      return {
        success: true,
        data: {
          chainId: result.data.chainId,
          transaction: result.data.tx,
          note: 'Sign this transaction with your wallet. For VeChain, use VeWorld or DAppKit.'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to build XFlows transaction'
      };
    }
  },
});
