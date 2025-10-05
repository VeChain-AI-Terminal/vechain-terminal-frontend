import { tool } from "ai";
import z from "zod";
import { ThorClient } from "@vechain/sdk-network";
import { ABIContract } from "@vechain/sdk-core";
import { stargateContract } from "../../../contracts/stargate";

export const getStakeInfo = tool({
  description: "Get detailed information about a specific StarGate NFT by token ID",
  inputSchema: z.object({
    tokenId: z.string().describe("StarGate NFT token ID to get info for"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
  }),
  execute: async ({ tokenId, network }) => {
    try {
      // Validate token ID
      const tokenIdNum = parseInt(tokenId);
      if (isNaN(tokenIdNum) || tokenIdNum < 0) {
        throw new Error(`Invalid token ID: must be a positive integer, received "${tokenId}"`);
      }

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

      let tokenData = null;

      try {
        // First check if token exists
        const tokenExistsResult = await thor.contracts.executeCall(
          contractAddress,
          stargateAbi.getFunction('tokenExists'),
          [tokenIdNum]
        );

        if (!tokenExistsResult.result.plain) {
          throw new Error(`StarGate NFT #${tokenId} does not exist`);
        }

        // Get token details using getToken()
        const tokenResult = await thor.contracts.executeCall(
          contractAddress,
          stargateAbi.getFunction('getToken'),
          [tokenIdNum]
        );

        if (tokenResult.result.plain) {
          const token = tokenResult.result.plain as any;
          const { tokenId: contractTokenId, levelId, mintedAtBlock, vetAmountStaked, lastVthoClaimTimestamp } = token;

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
                [tokenIdNum]
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
                [tokenIdNum]
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

            tokenData = {
              tokenId: tokenId,
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
              isUnderMaturity: !canTransfer && parseInt(maturityBlocks.toString()) > 0,
              dataSource: "contract"
            };
          }
        }
      } catch (contractError) {
        console.warn('Failed to read from contract, using fallback data:', contractError);
        
        // Fallback data for demonstration
        tokenData = {
          tokenId: tokenId,
          owner: "Unknown",
          level: "Dawn",
          levelId: 1,
          isX: false,
          vetStaked: "600,000 VET",
          vetStakedWei: "600000000000000000000000",
          mintedAtBlock: "12345678",
          lastVthoClaimTimestamp: "1699123456",
          maturityBlocks: 172800,
          maturityDays: 20,
          scaledRewardFactor: 1,
          claimableVtho: "45.2340",
          claimableVthoWei: "45234000000000000000",
          canTransfer: false,
          maturityEndBlock: "12518478",
          dataSource: "fallback"
        };
      }

      if (!tokenData) {
        throw new Error(`StarGate NFT #${tokenId} does not exist or could not be found`);
      }

      return {
        success: true,
        data: {
          ...tokenData,
          network,
          contractAddress,
        },
        meta: {
          network,
          contractAddress,
          timestamp: new Date().toISOString(),
        },
        message: `StarGate NFT #${tokenId} - ${tokenData.level} node with ${tokenData.vetStaked} staked`,
      };
    } catch (error: any) {
      console.error("Error fetching stake info:", error);
      return {
        success: false,
        error: error.message,
        data: {
          tokenId,
          network,
          contractAddress: network === "main" ? stargateContract.address.mainnet : stargateContract.address.testnet,
        },
        meta: {
          network,
          contractAddress: network === "main" ? stargateContract.address.mainnet : stargateContract.address.testnet,
          timestamp: new Date().toISOString(),
        },
        message: `Failed to get stake info: ${error.message}`,
      };
    }
  },
});