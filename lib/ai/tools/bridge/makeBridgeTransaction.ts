import { tool } from "ai";
import { z } from "zod";

// WanBridge API configuration
const WANBRIDGE_API = {
  mainnet: 'https://bridge-api.wanchain.org/api',
  testnet: 'https://bridge-api.wanchain.org/api/testnet'
};

const VECHAIN_GATEWAY = '0xa1Dd5cBF77e1E78C307ecbD7c6AEea90FC71499e';

export const makeBridgeTransaction = tool({
  description:
    "Create a VeChain bridge transaction using WanBridge. Supports cross-chain transfers to 25+ blockchains.",
  inputSchema: z.object({
    fromAccount: z.string().describe("The sender VeChain address"),
    toAccount: z.string().describe("The recipient address on destination chain"),
    fromChain: z.string().default("VET").describe("Source chain (VET for VeChain)"),
    toChain: z.string().describe("Destination chain (e.g., ETH, BNB, MATIC)"),
    fromToken: z.string().describe("Token address on VeChain (0x0000000000000000000000000000000000000000 for VET)"),
    toToken: z.string().describe("Token address on destination chain"),
    amount: z.string().describe("Amount to bridge (decimal string, e.g., '100.5')"),
    network: z.enum(["main", "test"]).optional().describe("VeChain network to use (defaults to environment setting)"),
  }),
  execute: async ({
    fromAccount,
    toAccount,
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    network,
  }) => {
    try {
      // Validate required fields
      if (!fromChain || !toChain || !fromToken || !toToken || !fromAccount || !toAccount || !amount) {
        throw new Error('Missing required bridge parameters');
      }

      // Use environment network setting if not specified
      const networkType = network || (process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'mainnet' ? 'main' : 'test');
      const apiUrl = networkType === 'main' ? WANBRIDGE_API.mainnet : WANBRIDGE_API.testnet;
      
      const requestBody = {
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAccount,
        toAccount,
        amount,
        partner: 'vechain-ai-app'
      };

      console.log('Creating bridge transaction:', requestBody);

      // Call WanBridge API directly
      const bridgeResponse = await fetch(`${apiUrl}/createTx2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const bridgeResult = await bridgeResponse.json();

      if (!bridgeResult.success) {
        console.error('Bridge API error:', bridgeResult);
        throw new Error(bridgeResult.error || 'Bridge transaction creation failed');
      }

      const txData = bridgeResult.data.tx;
      const approveCheck = bridgeResult.data.approveCheck;
      
      // Debug: Log the bridge result to understand what data we're getting
      console.log('🔍 Bridge API Response:', bridgeResult);
      console.log('🔍 Bridge result data:', bridgeResult.data);
      console.log('🔍 Approval check:', approveCheck);
      console.log('🔍 From token address:', fromToken);
      console.log('🔍 From token (lowercase):', fromToken.toLowerCase());
      console.log('🔍 Symbol from API:', bridgeResult.data?.symbol);
      console.log('🔍 Request parameters:', { fromChain, toChain, fromToken, toToken, amount });

      // Check if approval is needed based on API response
      let approvalRequired = null;
      if (approveCheck && approveCheck.token !== '0x0000000000000000000000000000000000000000') {
        approvalRequired = {
          token: approveCheck.token,
          spender: approveCheck.to,
          amount: approveCheck.amount,
          note: 'For this transaction to be successful, you must have approved this token spending first'
        };
      }

      // VeChain-specific response formatting
      if (fromChain === 'VET') {
        // Determine token symbol based on fromToken address
        let tokenSymbol = 'TOKEN';
        
        // Known token addresses mapping (case-insensitive)
        // Note: The truncated address 0x0000...6779 likely refers to VTHO
        const KNOWN_TOKENS: { [key: string]: string } = {
          '0x0000000000000000000000000000000000000000': 'VET',
          '0x0000000000000000000000000000456e65726779': 'VTHO', // VTHO (lowercase)
          '0x0000000000000000000000000000456E65726779': 'VTHO', // VTHO (uppercase)
          // Add more known tokens as needed
        };
        
        // Check both original and lowercase versions
        const fromTokenLower = fromToken.toLowerCase();
        
        // Also check if the address contains the VTHO pattern (ends with 6779)
        const isVTHOAddress = fromTokenLower.includes('456e65726779') || fromTokenLower.endsWith('6779');
        if (KNOWN_TOKENS[fromToken] || KNOWN_TOKENS[fromTokenLower]) {
          tokenSymbol = KNOWN_TOKENS[fromToken] || KNOWN_TOKENS[fromTokenLower];
        } else if (isVTHOAddress) {
          // Special case for VTHO addresses that end with 6779
          tokenSymbol = 'VTHO';
        } else {
          // Try to determine token symbol from API response
          tokenSymbol = bridgeResult.data?.symbol || 'TOKEN';
        }
        
        console.log('🔍 From token original:', fromToken);
        console.log('🔍 From token lowercase:', fromTokenLower);
        console.log('🔍 Found in mapping:', !!KNOWN_TOKENS[fromToken] || !!KNOWN_TOKENS[fromTokenLower]);
        console.log('🔍 Is VTHO address pattern:', isVTHOAddress);
        console.log('🔍 Determined token symbol:', tokenSymbol);
        console.log('🔍 API symbol:', bridgeResult.data?.symbol);

        const vechainTransaction = {
          from: fromAccount,
          tokenSymbol, // Add token symbol for proper display
          bridgeDetails: {
            fromChain,
            toChain,
            amount,
            recipient: toAccount,
            gatewayAddress: VECHAIN_GATEWAY,
          },
          network: networkType,
          clauses: [
            {
              to: txData.to,
              value: txData.value || '0x0',
              data: txData.data,
            }
          ],
          approveRequired: approvalRequired,
          type: "bridge_transaction",
          receiveAmount: bridgeResult.data.receiveAmount,
          feeAndQuota: bridgeResult.data.feeAndQuota,
          txDataDetail: bridgeResult.data.txDataDetail,
          instructions: [
            approveCheck ? '1. First approve token spending (use VeWorld or wallet)' : null,
            approveCheck ? '2. Wait for approval confirmation' : null,
            `${approveCheck ? '3' : '1'}. Sign and send the bridge transaction`,
            `${approveCheck ? '4' : '2'}. Monitor status using the transaction hash`
          ].filter(Boolean),
          note: 'Use DAppKit or VeWorld to sign this transaction. The gateway contract handles the cross-chain logic.'
        };

        console.log("VeChain bridge transaction", vechainTransaction);
        return vechainTransaction;
      }

      // Standard EVM chains response
      const evmTransaction = {
        from: fromAccount,
        to: txData.to,
        value: txData.value || '0x0',
        data: txData.data,
        chainId: bridgeResult.data.chainId,
        approveRequired: approveCheck ? {
          token: approveCheck.token,
          spender: approveCheck.to,
          amount: approveCheck.amount
        } : null,
        receiveAmount: bridgeResult.data.receiveAmount,
        feeAndQuota: bridgeResult.data.feeAndQuota,
        txDataDetail: bridgeResult.data.txDataDetail,
        message: `Bridge ${amount} from ${fromChain} to ${toChain}`,
        type: "bridge_transaction"
      };

      console.log("EVM bridge transaction", evmTransaction);
      return evmTransaction;

    } catch (error) {
      console.error('Bridge transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown bridge error'
      };
    }
  },
});