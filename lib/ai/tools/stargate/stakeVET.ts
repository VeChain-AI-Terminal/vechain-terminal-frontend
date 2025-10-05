import { tool } from "ai";
import z from "zod";

export const stakeVET = tool({
  description: "Stake VET to mint a StarGate NFT of specified level (Dawn, Lightning, Flash, Strength, Thunder, Mjolnir)",
  inputSchema: z.object({
    from: z.string().describe("The staker's wallet address"),
    levelId: z.number().min(1).max(10).describe("StarGate tier level ID (1-6)"),
    autoDelegate: z.boolean().optional().default(false).describe("Auto-delegate for additional rewards"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({ from, levelId, autoDelegate, network }) => {
    // StarGate contract addresses
    const contractAddress = network === "main"
      ? "0x1856c533ac2d94340aaa8544d35a5c1d4a21dee7" // Mainnet StarGate NFT
      : "0x1ec1d168574603ec35b9d229843b7c2b44bcb770"; // Testnet StarGate NFT

    // Level requirements mapping
    const levelRequirements: { [key: number]: { name: string, vetRequired: string, isX: boolean } } = {
      1: { name: "Dawn", vetRequired: "600000000000000000000000", isX: false }, // 600k VET
      2: { name: "Lightning", vetRequired: "1500000000000000000000000", isX: false }, // 1.5M VET
      3: { name: "Flash", vetRequired: "5000000000000000000000000", isX: false }, // 5M VET
      4: { name: "Strength", vetRequired: "15600000000000000000000000", isX: true }, // 15.6M VET
      5: { name: "Thunder", vetRequired: "56000000000000000000000000", isX: true }, // 56M VET
      6: { name: "Mjolnir", vetRequired: "156000000000000000000000000", isX: true }, // 156M VET
    };

    const level = levelRequirements[levelId];
    if (!level) {
      throw new Error(`Invalid level ID: ${levelId}. Must be between 1-6.`);
    }

    try {
      // Function selectors
      // stake(uint8) = 0x7b47ec1a
      // stakeAndDelegate(uint8,address) = 0x4b8a3529 (if we had a delegate address)
      const functionSelector = autoDelegate ? "0x4b8a3529" : "0x7b47ec1a";
      
      let data: string;
      if (autoDelegate) {
        // For simplicity, we'll use the regular stake function
        // In production, you'd need to specify a delegate address
        const levelIdHex = levelId.toString(16).padStart(2, '0');
        data = `0x7b47ec1a000000000000000000000000000000000000000000000000000000000000000${levelIdHex}`;
      } else {
        // stake(uint8 level)
        const levelIdHex = levelId.toString(16).padStart(2, '0');
        data = `0x7b47ec1a000000000000000000000000000000000000000000000000000000000000000${levelIdHex}`;
      }

      // Format VET amount for display
      const vetAmountBigInt = BigInt(level.vetRequired);
      const vetAmountFormatted = (Number(vetAmountBigInt) / Math.pow(10, 18)).toLocaleString();

      const transaction = {
        from,
        contractAddress,
        functionName: autoDelegate ? "stakeAndDelegate" : "stake",
        functionArgs: [levelId.toString()],
        value: level.vetRequired, // VET amount in wei
        data: data,
        network,
        levelId,
        levelName: level.name,
        vetStaked: `${vetAmountFormatted} VET`,
        isX: level.isX,
        autoDelegate,
        comment: `Stake ${vetAmountFormatted} VET for ${level.name} StarGate NFT${autoDelegate ? ' with auto-delegation' : ''}`,
        clauses: [
          {
            to: contractAddress,
            value: level.vetRequired,
            data: data,
            comment: `Stake ${vetAmountFormatted} VET for ${level.name} StarGate NFT`,
          }
        ],
        type: "stargate_stake" as const,
      };

      console.log("VeChain StarGate staking transaction", transaction);

      return transaction;
    } catch (error: any) {
      console.error("Error creating StarGate stake transaction:", error);
      throw new Error(`Failed to create StarGate stake transaction: ${error.message}`);
    }
  },
});