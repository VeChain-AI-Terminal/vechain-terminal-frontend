export type PortfolioDataType = {
  chainId: number;
  walletAddress: string;
  fungibleTokens: {
    name: string;
    symbol: string;
    balance: number;
    usdValue: number;
    tokenAddress: string;
    currentPrice: number;
    change24hPercent: number;
    marketCap?: number;
  }[];
  nfts: {
    name: string;
    tokenId: string;
    contractAddress: string;
  }[];
  totalPortfolioValueUSD: number;
};
