import { tool } from "ai";
import z from "zod";
import { ThorClient } from "@vechain/sdk-network";
import { ABIContract } from "@vechain/sdk-core";
import { stargateContract } from "../../../contracts/stargate";

export const getUserStakes = tool({
  description: "Get all StarGate NFTs owned by an address with detailed information",
  inputSchema: z.object({
    address: z.string().describe("User address to check stakes for"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({ address, network }) => {
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

      let stakes = [];

      try {
        // Get all tokens owned by the user using tokensOwnedBy()
        const tokensResult = await thor.contracts.executeCall(
          contractAddress,
          stargateAbi.getFunction('tokensOwnedBy'),
          [address]
        );

        if (tokensResult.result.plain && Array.isArray(tokensResult.result.plain)) {
          const userTokens = tokensResult.result.plain as any[];
          
          for (let i = 0; i < userTokens.length; i++) {
            const token = userTokens[i];
            
            try {
              // Destructure the Token struct
              const { tokenId, levelId, mintedAtBlock, vetAmountStaked, lastVthoClaimTimestamp } = token;
              
              // Get level details for this token
              const levelResult = await thor.contracts.executeCall(
                contractAddress,
                stargateAbi.getFunction('getLevel'),
                [levelId]
              );

              if (levelResult.result.plain) {
                const level = levelResult.result.plain as any;
                const { name, isX, maturityBlocks, scaledRewardFactor } = level;
                
                // Get claimable VTHO for this specific token
                let claimableVtho = "0";
                try {
                  const vthoResult = await thor.contracts.executeCall(
                    contractAddress,
                    stargateAbi.getFunction('claimableVetGeneratedVtho'),
                    [tokenId]
                  );
                  if (vthoResult.result.plain) {
                    claimableVtho = vthoResult.result.plain.toString();
                  }
                } catch (vthoError) {
                  console.warn(`Failed to get claimable VTHO for token ${tokenId}:`, vthoError);
                }

                // Check if token can transfer
                let canTransfer = false;
                try {
                  const canTransferResult = await thor.contracts.executeCall(
                    contractAddress,
                    stargateAbi.getFunction('canTransfer'),
                    [tokenId]
                  );
                  if (canTransferResult.result.plain !== undefined) {
                    canTransfer = Boolean(canTransferResult.result.plain);
                  }
                } catch (transferError) {
                  console.warn(`Failed to get canTransfer for token ${tokenId}:`, transferError);
                }

                const maturityDays = Math.round(parseInt(maturityBlocks.toString()) / 8640); // ~8640 blocks per day
                const vetFormatted = new Intl.NumberFormat().format(parseInt(vetAmountStaked.toString()) / Math.pow(10, 18));
                const claimableVthoFormatted = (parseInt(claimableVtho) / Math.pow(10, 18)).toFixed(4);

                stakes.push({
                  tokenId: tokenId.toString(),
                  level: name,
                  levelId: parseInt(levelId.toString()),
                  isX,
                  vetStaked: `${vetFormatted} VET`,
                  vetStakedWei: vetAmountStaked.toString(),
                  mintedAtBlock: mintedAtBlock.toString(),
                  lastVthoClaimTimestamp: lastVthoClaimTimestamp.toString(),
                  maturityBlocks: parseInt(maturityBlocks.toString()),
                  maturityDays,
                  scaledRewardFactor: parseInt(scaledRewardFactor.toString()) / 100,
                  canTransfer,
                  claimableVtho: claimableVthoFormatted,
                  claimableVthoWei: claimableVtho,
                  maturityEndBlock: (parseInt(mintedAtBlock.toString()) + parseInt(maturityBlocks.toString())).toString(),
                  isUnderMaturity: !canTransfer && parseInt(maturityBlocks.toString()) > 0
                });
              }
            } catch (tokenError) {
              console.warn(`Failed to process token ${i}:`, tokenError);
            }
          }
        }
      } catch (contractError) {
        console.warn('Failed to read user tokens from contract:', contractError);
      }

      return {
        success: true,
        data: {
          address,
          totalStakes: stakes.length,
          stakes,
          dataSource: stakes.length > 0 && !contractError ? "contract" : "fallback"
        },
        meta: {
          network,
          contractAddress,
          timestamp: new Date().toISOString(),
        },
        message: stakes.length > 0 
          ? `Found ${stakes.length} StarGate NFT${stakes.length !== 1 ? 's' : ''} for address ${address}`
          : `No StarGate NFTs found for address ${address}`,
      };
    } catch (error: any) {
      console.error("Error fetching user stakes:", error);
      return {
        success: false,
        error: error.message,
        data: {
          address,
          totalStakes: 0,
          stakes: [],
        },
        meta: {
          network,
          contractAddress: network === "main" ? stargateContract.address.mainnet : stargateContract.address.testnet,
          timestamp: new Date().toISOString(),
        },
        message: `Failed to get user stakes: ${error.message}`,
      };
    }
  },
});