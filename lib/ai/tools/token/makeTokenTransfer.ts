import { tool } from "ai";
import z from "zod";

export const makeTokenTransfer = tool({
  description:
    "Transfer VIP-180 tokens (like VTHO, B3TR, USDT) on VeChain. Handles encoding automatically.",
  inputSchema: z.object({
    from: z.string().describe("The sender address"),
    tokenAddress: z.string().describe("The token contract address"),
    to: z.string().describe("The recipient address"),
    amount: z.string().describe("Amount to transfer (human readable, e.g., '100.5')"),
    tokenSymbol: z.string().optional().describe("Token symbol for display (e.g., 'VTHO', 'B3TR')"),
    tokenDecimals: z.number().default(18).describe("Token decimals (default: 18)"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({
    from,
    tokenAddress,
    to,
    amount,
    tokenSymbol,
    tokenDecimals,
    network,
  }) => {
    // Convert amount to base units (wei equivalent for the token)
    const amountInBaseUnits = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, tokenDecimals)));
    
    // Build ERC20 transfer data: transfer(address,uint256) = 0xa9059cbb
    const methodId = "0xa9059cbb";
    const addressPadded = to.slice(2).padStart(64, '0');
    const amountPadded = amountInBaseUnits.toString(16).padStart(64, '0');
    const data = methodId + addressPadded + amountPadded;

    const transaction = {
      from,
      tokenAddress,
      to,
      amount,
      tokenSymbol: tokenSymbol || "TOKEN",
      tokenDecimals,
      network,
      data,
      comment: `Transfer ${amount} ${tokenSymbol || 'tokens'} to ${to}`,
      clauses: [
        {
          to: tokenAddress,
          value: "0x0", // No VET sent for token transfer
          data: data,
          comment: `Transfer ${amount} ${tokenSymbol || 'tokens'} to ${to}`,
        }
      ],
      type: "token_transfer",
    };

    console.log("VeChain token transfer transaction", transaction);

    return transaction;
  },
});