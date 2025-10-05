import { tool } from "ai";
import z from "zod";

export const unstakeStargate = tool({
  description: "Unstake a StarGate NFT to burn it and retrieve the staked VET (only available after maturity period)",
  inputSchema: z.object({
    from: z.string().describe("The owner's wallet address"),
    tokenId: z.string().describe("StarGate NFT token ID to unstake"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({ from, tokenId, network }) => {
    // StarGate contract addresses
    const contractAddress = network === "main"
      ? "0x5E5b2c8DB3c74B4d1d5BC1baE90b473Cf13E8eD1" // Mainnet StarGate NFT
      : "0x5E5b2c8DB3c74B4d1d5BC1baE90b473Cf13E8eD1"; // Testnet StarGate NFT

    try {
      // Validate token ID
      const tokenIdNum = parseInt(tokenId);
      if (isNaN(tokenIdNum) || tokenIdNum < 0) {
        throw new Error(`Invalid token ID: ${tokenId}`);
      }

      // Function selector for unstake(uint256) = 0x2def6620
      const tokenIdHex = BigInt(tokenIdNum).toString(16).padStart(64, '0');
      const data = "0x2def6620" + tokenIdHex;

      const transaction = {
        from,
        contractAddress,
        functionName: "unstake",
        functionArgs: [tokenId],
        value: "0", // No VET value for unstaking
        data: data,
        network,
        tokenId,
        comment: `Unstake StarGate NFT #${tokenId} and retrieve staked VET`,
        clauses: [
          {
            to: contractAddress,
            value: "0x0",
            data: data,
            comment: `Unstake StarGate NFT #${tokenId}`,
          }
        ],
        type: "stargate_unstake" as const,
      };

      console.log("VeChain StarGate unstake transaction", transaction);

      return transaction;
    } catch (error: any) {
      console.error("Error creating StarGate unstake transaction:", error);
      throw new Error(`Failed to create StarGate unstake transaction: ${error.message}`);
    }
  },
});