import { tool } from 'ai';
import { z } from 'zod';

const XFLOWS_API = 'https://xflows.wanchain.org/api/v3';

export const checkXFlowsStatus = tool({
  description: 'Check XFlows cross-chain swap status',
  inputSchema: z.object({
    hash: z.string().describe('Transaction hash to check status for'),
  }),
  execute: async ({ hash }): Promise<any> => {
    try {
      const requestBody = {
        hash: hash
      };

      const response = await fetch(`${XFLOWS_API}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json() as any;

      if (!result.success) {
        throw new Error('Failed to check XFlows status');
      }

      const data = result.data;

      return {
        success: true,
        data: {
          status: {
            statusCode: data.statusCode,
            statusMsg: data.statusMsg,
            workMode: getWorkModeDescription(data.workMode),
            sourceHash: data.sourceHash,
            destinationHash: data.destinationHash,
            swapHash: data.swapHash,
            refundHash: data.refundHash,
            receiveAmount: data.receiveAmount,
            receiveAmountRaw: data.receiveAmountRaw,
            timestamp: data.timestamp,
            isComplete: data.statusCode === 1,
            isFailed: data.statusCode === 2,
            isPending: data.statusCode === 3
          },
          extraData: data.extraData
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to check XFlows status'
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
