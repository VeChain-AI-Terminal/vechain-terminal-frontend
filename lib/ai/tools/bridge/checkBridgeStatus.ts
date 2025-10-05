import { tool } from 'ai';
import { z } from 'zod';

// WanBridge API configuration
const WANBRIDGE_API = {
  mainnet: 'https://bridge-api.wanchain.org/api',
  testnet: 'https://bridge-api.wanchain.org/api/testnet'
};

export const checkBridgeStatus = tool({
  description: 'Check cross-chain bridge transaction status. Accepts hash from either source or destination chain.',
  inputSchema: z.object({
    txHash: z.string().describe('Transaction hash from source or destination chain'),
    network: z.enum(["main", "test"]).optional().describe("Network to use (defaults to environment setting)"),
  }),
  execute: async ({ txHash, network }): Promise<any> => {
    try {
      // Use environment network setting if not specified
      const networkType = network || (process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'mainnet' ? 'main' : 'test');
      const apiUrl = networkType === 'main' ? WANBRIDGE_API.mainnet : WANBRIDGE_API.testnet;

      const response = await fetch(`${apiUrl}/status/${txHash}`);
      const result = await response.json() as any;

      if (!result.success && !result.data) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      const status = result.data.status;
      
      return {
        success: true,
        data: {
          txHash: txHash,
          status: status,
          statusCode: getStatusCode(status),
          tokenPair: result.data.tokenPair,
          lockHash: result.data.lockHash,
          redeemHash: result.data.redeemHash,
          sendAmount: result.data.sendAmount,
          receiveAmount: result.data.receiveAmount,
          timestamp: result.data.timestamp,
          isComplete: status === 'Success',
          isFailed: status === 'Failed',
          isPending: status === 'Processing',
          needsIntervention: status === 'Trusteeship',
          isRefunded: status === 'Refund',
          message: getStatusMessage(status),
          nextSteps: getNextSteps(status),
          network: networkType
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to check bridge status'
      };
    }
  },
});

// Helper functions
function getStatusCode(status: string): number {
  const codes: Record<string, number> = {
    'Success': 1,
    'Failed': 2,
    'Processing': 3,
    'Refund': 4,
    'Trusteeship': 6
  };
  return codes[status] || 0;
}

function getStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    'Success': '✅ Bridge transfer completed successfully',
    'Failed': '❌ Bridge transfer failed',
    'Processing': '⏳ Bridge validators processing your transfer',
    'Refund': '💸 Transfer was refunded (check refund transaction)',
    'Trusteeship': '⚠️ Manual intervention required - contact support@wanchain.org',
    'NotFound': '🔍 Transaction not found in bridge system yet'
  };
  return messages[status] || '❓ Unknown status';
}

function getNextSteps(status: string): string[] {
  const steps: Record<string, string[]> = {
    'Success': [
      'Transfer complete!',
      'Check destination wallet for tokens'
    ],
    'Failed': [
      'Transaction failed',
      'Check error details or contact support'
    ],
    'Processing': [
      'Wait for bridge validators to process',
      'Check status again in 5-10 minutes',
      'Typical completion time: 10-30 minutes'
    ],
    'Refund': [
      'Original tokens returned to source wallet',
      'Check refundHash for refund transaction'
    ],
    'Trusteeship': [
      'Manual intervention needed',
      'Contact techsupport@wanchain.org',
      'Provide transaction hash and details'
    ]
  };
  return steps[status] || ['Check status again later'];
}
