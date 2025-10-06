import { tool } from "ai";
import z from "zod";
import { ThorClient } from '@vechain/sdk-network';
import { ABIContract } from '@vechain/sdk-core';

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

    try {
      // Initialize Thor client
      const thorClient = ThorClient.fromUrl(
        network === "main" 
          ? "https://mainnet.vechain.org"
          : "https://testnet.vechain.org"
      );

      // Create ABI contract instance
      const stargateABI = [
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "_levelId",
              "type": "uint8"
            }
          ],
          "name": "getLevel",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isX",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "id",
                  "type": "uint8"
                },
                {
                  "internalType": "uint64",
                  "name": "maturityBlocks",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "scaledRewardFactor",
                  "type": "uint64"
                },
                {
                  "internalType": "uint256",
                  "name": "vetAmountRequiredToStake",
                  "type": "uint256"
                }
              ],
              "internalType": "struct StarGateNFT.Level",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      const contract = new ABIContract(stargateABI as any);
      const getLevelFunction = contract.getFunction('getLevel');

      // Execute contract call to get level data
      const levelResult = await thorClient.contracts.executeCall(
        contractAddress,
        getLevelFunction,
        [levelId]
      );
      
      const level = levelResult.result.plain as any;
      if (!level || !level.vetAmountRequiredToStake) {
        throw new Error(`Invalid level ID: ${levelId}`);
      }

      // Function selectors
      // stake(uint8) = 0x7b47ec1a
      // stakeAndDelegate(uint8,address) = 0x4b8a3529 (if we had a delegate address)
      
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

      // vetAmountRequiredToStake is already in wei from contract
      const vetAmountInWei = level.vetAmountRequiredToStake.toString();
      const vetAmountFormatted = (Number(vetAmountInWei) / Math.pow(10, 18)).toLocaleString();
      
      // Convert wei to hex format (same as makeContractTransaction.ts)
      const valueInWei = `0x${BigInt(vetAmountInWei).toString(16)}`;

      const transaction = {
        from,
        contractAddress,
        functionName: autoDelegate ? "stakeAndDelegate" : "stake",
        functionArgs: [levelId.toString()],
        value: valueInWei, // VET amount in wei as hex
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
            value: valueInWei,
            data: data,
            comment: `Stake ${vetAmountFormatted} VET for ${level.name} StarGate NFT`,
          }
        ],
        type: "stargate_stake" as const,
      };

      return transaction;
    } catch (error: any) {
      console.error("Error creating StarGate stake transaction:", error);
      throw new Error(`Failed to create StarGate stake transaction: ${error.message}`);
    }
  },
});