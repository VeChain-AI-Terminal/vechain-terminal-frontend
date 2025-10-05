import { tool } from 'ai';
import { z } from 'zod';

const XFLOWS_API = 'https://xflows.wanchain.org/api/v3';

export const getXFlowsQuote = tool({
  description: 'Get quote for cross-chain swap with DEX integration using XFlows API',
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
      const response = await fetch(`${XFLOWS_API}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters)
      });

      const result = await response.json() as any;

      if (!result.success) {
        throw new Error(result.data?.error || 'Failed to get XFlows quote');
      }

      const data = result.data;

      return {
        success: true,
        data: {
          quote: {
            amountOut: data.amountOut,
            amountOutRaw: data.amountOutRaw,
            amountOutMin: data.amountOutMin,
            amountOutMinRaw: data.amountOutMinRaw,
            priceImpact: data.priceImpact,
            slippage: data.slippage,
            workMode: getWorkModeDescription(data.workMode),
            bridge: data.bridge,
            dex: data.dex,
            approvalAddress: data.approvalAddress
          },
          fees: {
            native: data.nativeFees || [],
            token: data.tokenFees || []
          },
          extraData: data.extraData,
          note: 'XFlows supports 6 work modes: direct bridge, QuiX, bridge+swap, and more'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get XFlows quote'
      };
    }
  },
});

// Helper function
function getWorkModeDescription(mode: number): string {
  const modes: Record<number, string> = {
    1: 'Direct WanBridge transfer',
    2: 'QuiX rapid cross-chain',
    3: 'Bridge then swap on destination',
    4: 'Bridge to Wanchain, swap, then bridge to destination',
    5: 'DEX swap only (same chain)',
    6: 'Swap then bridge to destination'
  };
  return modes[mode] || `Work mode ${mode}`;
}
