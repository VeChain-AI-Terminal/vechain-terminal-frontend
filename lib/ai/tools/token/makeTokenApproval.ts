import { tool } from "ai";
import z from "zod";

export const makeTokenApproval = tool({
  description:
    "Approve a spender to use your VIP-180 tokens. Required before most DeFi operations.",
  inputSchema: z.object({
    from: z.string().describe("The token owner address"),
    tokenAddress: z.string().describe("The token contract address"),
    spender: z.string().describe("The address to approve (usually a smart contract)"),
    amount: z.string().describe("Amount to approve (human readable, e.g., '1000' or 'unlimited')"),
    tokenSymbol: z.string().optional().describe("Token symbol for display (e.g., 'VTHO', 'B3TR')"),
    tokenDecimals: z.number().default(18).describe("Token decimals (default: 18)"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({
    from,
    tokenAddress,
    spender,
    amount,
    tokenSymbol,
    tokenDecimals,
    network,
  }) => {
    // Handle unlimited approval
    let amountInBaseUnits: bigint;
    if (amount.toLowerCase() === 'unlimited' || amount.toLowerCase() === 'max') {
      // Use max uint256 for unlimited approval
      amountInBaseUnits = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    } else {
      amountInBaseUnits = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, tokenDecimals!)));
    }
    
    // Build ERC20 approve data: approve(address,uint256) = 0x095ea7b3
    const methodId = "0x095ea7b3";
    const addressPadded = spender.slice(2).padStart(64, '0');
    const amountPadded = amountInBaseUnits.toString(16).padStart(64, '0');
    const data = methodId + addressPadded + amountPadded;

    const displayAmount = amount.toLowerCase() === 'unlimited' || amount.toLowerCase() === 'max' 
      ? 'unlimited' 
      : amount;

    const transaction = {
      from,
      tokenAddress,
      spender,
      amount: displayAmount,
      tokenSymbol: tokenSymbol || "TOKEN",
      tokenDecimals,
      network,
      data,
      comment: `Approve ${spender} to spend ${displayAmount} ${tokenSymbol || 'tokens'}`,
      clauses: [
        {
          to: tokenAddress,
          value: "0x0", // No VET sent for approval
          data: data,
          comment: `Approve ${spender} to spend ${displayAmount} ${tokenSymbol || 'tokens'}`,
        }
      ],
      type: "token_approval",
    };

    console.log("VeChain token approval transaction", transaction);

    return transaction;
  },
});