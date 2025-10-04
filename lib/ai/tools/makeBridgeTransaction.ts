import { tool } from "ai";
import z from "zod";

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
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
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
      // Call WanBridge API to create transaction
      const bridgeResponse = await fetch('/api/bridge/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChain,
          toChain,
          fromToken,
          toToken,
          fromAccount,
          toAccount,
          amount,
          partner: 'vechain-ai-app'
        })
      });

      const bridgeResult = await bridgeResponse.json();

      if (!bridgeResult.success) {
        throw new Error(bridgeResult.error || 'Bridge transaction creation failed');
      }

      // Extract VeChain-specific transaction data
      const { transaction, approveRequired, gatewayAddress } = bridgeResult;

      const vechainTransaction = {
        from: fromAccount,
        bridgeDetails: {
          fromChain,
          toChain,
          amount,
          recipient: toAccount,
          gatewayAddress: gatewayAddress || '0xa1Dd5cBF77e1E78C307ecbD7c6AEea90FC71499e',
        },
        network,
        clauses: [
          {
            to: transaction.to,
            value: transaction.value || '0',
            data: transaction.data,
          }
        ],
        approveRequired,
        type: "bridge_transaction",
        receiveAmount: bridgeResult.receiveAmount,
        instructions: bridgeResult.instructions,
      };

      console.log("VeChain bridge transaction", vechainTransaction);

      return vechainTransaction;
    } catch (error) {
      console.error('Bridge transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown bridge error'
      };
    }
  },
});