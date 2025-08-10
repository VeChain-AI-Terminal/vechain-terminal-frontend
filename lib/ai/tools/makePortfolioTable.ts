import { tool } from "ai";
import z from "zod";

const FungibleTokenSchema = z.object({
  name: z
    .string()
    .describe(
      "The full name of the fungible token, e.g., Core Blockchain Native Token"
    ),
  symbol: z.string().describe("The ticker symbol of the token, e.g., CORE"),
  balance: z.number().describe("The balance of this token in the wallet"),
  usdValue: z.number().describe("The USD value of the token balance"),
  tokenAddress: z
    .string()
    .describe("The on-chain contract address of the token"),
  currentPrice: z.number().describe("The current token price in USD"),
  change24hPercent: z
    .number()
    .describe("The percentage price change in the last 24 hours"),
  marketCap: z
    .number()
    .optional()
    .describe("The market capitalization of the token, if available"),
});

const NftSchema = z.object({
  name: z.string().describe("The name of the NFT"),
  tokenId: z.string().describe("The token ID of the NFT"),
  contractAddress: z
    .string()
    .describe("The contract address of the NFT collection"),
});

const PortfolioSchema = z.object({
  chainId: z
    .number()
    .describe("The chain ID of the blockchain (1116 for Core blockchain)"),
  walletAddress: z.string().describe("The address of the wallet"),
  fungibleTokens: z
    .array(FungibleTokenSchema)
    .describe("A list of fungible tokens held by the wallet"),
  nfts: z.array(NftSchema).describe("A list of NFTs held by the wallet"),
  totalPortfolioValueUSD: z
    .number()
    .describe("The total value of the portfolio in USD"),
});

export type PortfolioData = z.infer<typeof PortfolioSchema>;

export const makePortfolioTable = tool({
  description:
    "Create a PortfolioData object for a Core wallet with chainId, walletAddress, fungibleTokens, nfts, and totalPortfolioValueUSD.",
  inputSchema: PortfolioSchema,
  execute: async (input: PortfolioData) => {
    console.log("portfolio in makePortfolioTable", input);
    return input;
  },
});
