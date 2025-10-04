import { tool } from "ai";
import z from "zod";

export const makeContractTransaction = tool({
  description:
    "Create a VeChain contract interaction transaction. Use this for calling smart contract functions like ERC20 transfers, approvals, swaps, etc.",
  inputSchema: z.object({
    from: z.string().describe("The sender address"),
    contractAddress: z.string().describe("The smart contract address"),
    functionName: z.string().describe("The contract function name (e.g., 'transfer', 'approve', 'swap')"),
    functionArgs: z.array(z.any()).optional().describe("Array of function arguments in order"),
    abi: z.array(z.any()).optional().describe("Contract ABI (if available)"),
    data: z.string().optional().describe("Pre-encoded function call data (alternative to functionName/args)"),
    value: z
      .string()
      .default("0")
      .describe("Amount of VET to send with the transaction (for payable functions)"),
    network: z.enum(["main", "test"]).default("test").describe("VeChain network to use"),
    gasLimit: z.number().optional().describe("Gas limit for the transaction"),
    comment: z.string().optional().describe("Human-readable description of what this transaction does"),
  }),
  execute: async ({
    from,
    contractAddress,
    functionName,
    functionArgs = [],
    abi,
    data,
    value,
    network,
    gasLimit,
    comment,
  }) => {
    // Convert human readable value to wei (18 decimals for VET)
    const valueInWei = value === "0" ? "0x0" : `0x${(parseFloat(value) * Math.pow(10, 18)).toString(16)}`;
    
    // If data is provided, use it directly, otherwise try to encode from function info
    let encodedData = data;
    
    if (!encodedData && functionName) {
      // For common functions, provide basic encoding
      if (functionName === "transfer" && functionArgs.length === 2) {
        // ERC20 transfer(address,uint256)
        const methodId = "0xa9059cbb";
        const addressPadded = functionArgs[0].slice(2).padStart(64, '0');
        const amountPadded = BigInt(functionArgs[1]).toString(16).padStart(64, '0');
        encodedData = methodId + addressPadded + amountPadded;
      } else if (functionName === "approve" && functionArgs.length === 2) {
        // ERC20 approve(address,uint256)
        const methodId = "0x095ea7b3";
        const addressPadded = functionArgs[0].slice(2).padStart(64, '0');
        const amountPadded = BigInt(functionArgs[1]).toString(16).padStart(64, '0');
        encodedData = methodId + addressPadded + amountPadded;
      } else {
        // For other functions, require pre-encoded data
        throw new Error(`Function encoding for '${functionName}' not supported. Please provide pre-encoded data.`);
      }
    }

    if (!encodedData) {
      throw new Error("Either 'data' or 'functionName' with supported encoding must be provided.");
    }

    const transaction = {
      from,
      contractAddress,
      functionName,
      functionArgs,
      value: valueInWei,
      data: encodedData,
      network,
      gasLimit,
      comment: comment || `Call ${functionName || 'function'} on ${contractAddress}`,
      clauses: [
        {
          to: contractAddress,
          value: valueInWei,
          data: encodedData,
          comment: comment || `Call ${functionName || 'function'} on ${contractAddress}`,
        }
      ],
      type: "contract_interaction",
    };

    console.log("VeChain contract transaction", transaction);

    return transaction;
  },
});