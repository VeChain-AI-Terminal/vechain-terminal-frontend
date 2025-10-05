import { tool } from "ai";
import z from "zod";
import { ThorClient } from "@vechain/sdk-network";
import { ABIContract } from "@vechain/sdk-core";
import { stargateContract, stargateStaticLevels } from "../../../contracts/stargate";

export const getStakingLevels = tool({
  description: "Get all available StarGate staking levels with requirements and rewards",
  inputSchema: z.object({
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
    category: z.enum(["all", "eco", "x", "new-eco"]).optional().describe("Filter levels by category"),
  }),
  execute: async ({ network, category }) => {
    try {
      // Initialize VeChain SDK connection
      const nodeUrl = network === "main" 
        ? "https://mainnet.vechain.org" 
        : "https://testnet.vechain.org";
      
      const thor = ThorClient.at(nodeUrl);
      const contractAddress = network === "main" 
        ? stargateContract.address.mainnet 
        : stargateContract.address.testnet;

      // Create ABI contract instance
      const stargateAbi = new ABIContract(stargateContract.abi);

      let levels = [];

      try {
        // Get all levels from contract using the getLevels() function
        const levelsResult = await thor.contracts.executeCall(
          contractAddress,
          stargateAbi.getFunction('getLevels'),
          []
        );

        if (levelsResult.result.plain && Array.isArray(levelsResult.result.plain)) {
          const contractLevels = levelsResult.result.plain as any[];
          
          for (let i = 0; i < contractLevels.length; i++) {
            const level = contractLevels[i];
            
            try {
              // Destructure the Level struct
              const { name, isX, id, maturityBlocks, scaledRewardFactor, vetAmountRequiredToStake } = level;
              
              const maturityDays = Math.round(parseInt(maturityBlocks.toString()) / 8640); // ~8640 blocks per day
              const vetFormatted = new Intl.NumberFormat().format(parseInt(vetAmountRequiredToStake.toString()) / Math.pow(10, 18));
              
              levels.push({
                id: parseInt(id.toString()),
                name,
                isX,
                vetAmountRequiredToStake: vetAmountRequiredToStake.toString(),
                vetRequiredFormatted: `${vetFormatted} VET`,
                scaledRewardFactor: parseInt(scaledRewardFactor.toString()),
                maturityBlocks: parseInt(maturityBlocks.toString()),
                maturityDays,
                category: isX ? "x" : "eco",
                description: `${name} node requiring ${vetFormatted} VET with ${maturityDays > 0 ? `${maturityDays}-day maturity period` : 'no maturity period'} and ${parseInt(scaledRewardFactor.toString())/100}x reward multiplier.`
              });
            } catch (levelError) {
              console.warn(`Failed to process level ${i}:`, levelError);
            }
          }
        }
      } catch (contractError) {
        console.warn('Failed to read from contract, using static data:', contractError);
      }

      // Fallback to static data if contract reading failed or returned no levels
      if (levels.length === 0) {
        levels = stargateStaticLevels;
      }

      // Filter by category if specified
      let filteredLevels = levels;
      if (category && category !== "all") {
        filteredLevels = levels.filter(level => level.category === category);
      }

      // Sort by VET requirement (ascending)
      filteredLevels.sort((a, b) => BigInt(a.vetAmountRequiredToStake) > BigInt(b.vetAmountRequiredToStake) ? 1 : -1);

      return {
        success: true,
        data: {
          levels: filteredLevels,
          totalLevels: filteredLevels.length,
          dataSource: levels.length > 0 && levels !== stargateStaticLevels ? "contract" : "static"
        },
        meta: {
          network,
          contractAddress,
          category: category || "all",
          timestamp: new Date().toISOString(),
        },
        message: `Available StarGate staking levels on ${network === "main" ? "VeChain Mainnet" : "VeChain Testnet"}`,
      };
    } catch (error) {
      console.error('Error fetching staking levels:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});