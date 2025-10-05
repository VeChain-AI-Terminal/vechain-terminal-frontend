import { tool } from 'ai';
import { z } from 'zod';

// WanBridge API configuration
const WANBRIDGE_API = {
  mainnet: 'https://bridge-api.wanchain.org/api',
  testnet: 'https://bridge-api.wanchain.org/api/testnet'
};

export const getSmgID = tool({
  description: 'Get current Storeman Group ID (smgID) for cross-chain operations. Updated monthly on the 9th.',
  inputSchema: z.object({
    network: z.enum(["main", "test"]).optional().describe("Network to use (defaults to environment setting)"),
  }),
  execute: async ({ network }): Promise<any> => {
    try {
      // Use environment network setting if not specified
      const networkType = network || (process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'mainnet' ? 'main' : 'test');
      const apiUrl = networkType === 'main' ? WANBRIDGE_API.mainnet : WANBRIDGE_API.testnet;

      const response = await fetch(`${apiUrl}/smgID`);
      const result = await response.json() as any;

      if (!result.success) {
        throw new Error('Failed to fetch smgID');
      }

      return {
        success: true,
        data: {
          smgID: result.data,
          network: networkType,
          note: 'smgID is updated on the 9th of each month',
          verifyUrl: `https://www.wanscan.org/osmgroupinfo/${result.data}`,
          recommendation: 'Cache this value and update monthly on the 9th'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get smgID'
      };
    }
  },
});
