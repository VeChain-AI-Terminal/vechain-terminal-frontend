import { tool } from 'ai';
import { z } from 'zod';
import { ThorClient } from '@vechain/sdk-network';
import { ABIContract, Address } from '@vechain/sdk-core';

// Token registry for both networks
interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean;
  address?: string;
  mainnetAddress?: string;
  testnetAddress?: string;
}

const TOKENS: Record<string, TokenConfig> = {
  VET: {
    symbol: 'VET',
    name: 'VeChain',
    decimals: 18,
    isNative: true,
    address: undefined,
    mainnetAddress: undefined,
    testnetAddress: undefined,
  },
  VTHO: {
    symbol: 'VTHO',
    name: 'VeThor',
    decimals: 18,
    isNative: false,
    // VTHO is at a fixed address on both networks
    address: '0x0000000000000000000000000000456E65726779',
    mainnetAddress: '0x0000000000000000000000000000456E65726779',
    testnetAddress: '0x0000000000000000000000000000456E65726779',
  },
  B3TR: {
    symbol: 'B3TR',
    name: 'VeBetter',
    decimals: 18,
    isNative: false,
    address: undefined,
    testnetAddress: '0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F',
    mainnetAddress: undefined, // To be added when available
  },
};

// ERC20 ABI for balance queries
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

function getToken(tokenSymbol: string, network: 'mainnet' | 'testnet'): TokenConfig & { address: string } {
  const token = TOKENS[tokenSymbol.toUpperCase()];
  if (!token) {
    throw new Error(`Token ${tokenSymbol} not supported`);
  }
  
  if (token.isNative) {
    throw new Error(`Native token ${tokenSymbol} doesn't need an address`);
  }
  
  const address = network === 'testnet' ? token.testnetAddress : token.mainnetAddress;
  if (!address) {
    throw new Error(`Token ${tokenSymbol} not available on ${network}`);
  }
  
  return {
    ...token,
    address
  };
}

export const getVETVTHOBalance = tool({
  description: 'Get VET and VTHO balance for a VeChain address using direct blockchain calls (works on both mainnet and testnet)',
  inputSchema: z.object({
    address: z.string().describe('VeChain wallet address to check balance for'),
    network: z.enum(['mainnet', 'testnet']).optional().default('testnet').describe('VeChain network'),
    tokenSymbol: z.string().optional().describe('Specific token to check (VET, VTHO, B3TR). If not provided, returns VET and VTHO'),
  }),
  execute: async ({ address, network = 'testnet', tokenSymbol }): Promise<any> => {
    try {
      // Initialize Thor client
      const thorClient = ThorClient.fromUrl(
        network === 'mainnet' 
          ? 'https://mainnet.vechain.org'
          : 'https://testnet.vechain.org'
      );

      // If specific token requested, return only that token's balance
      if (tokenSymbol) {
        const tokenConfig = TOKENS[tokenSymbol.toUpperCase()];
        if (!tokenConfig) {
          throw new Error(`Token ${tokenSymbol} not supported`);
        }
        
        if (tokenConfig.isNative) {
          // Get actual VET balance using VeChain client
          const account = await thorClient.accounts.getAccount(Address.of(address));
          const balance = BigInt(account.balance);
          
          return {
            success: true,
            data: {
              address,
              token: tokenConfig.symbol,
              balance: balance.toString(),
              balanceFormatted: (Number(balance) / Math.pow(10, tokenConfig.decimals)).toString(),
              network,
              decimals: tokenConfig.decimals,
              isNative: true
            }
          };
        } else {
          // Get actual token balance using ERC20 balanceOf
          const token = getToken(tokenSymbol, network);
          const contract = new ABIContract(ERC20_ABI as any);
          const balanceOfFunction = contract.getFunction('balanceOf');
          
          const result = await thorClient.contracts.executeCall(
            token.address,
            balanceOfFunction,
            [Address.of(address)]
          );
          
          const balanceWei = result.result.plain as bigint;
          const balanceFormatted = (Number(balanceWei) / Math.pow(10, token.decimals)).toString();
          
          return {
            success: true,
            data: {
              address,
              token: token.symbol,
              contractAddress: token.address,
              balance: balanceWei.toString(),
              balanceFormatted,
              decimals: token.decimals,
              network
            }
          };
        }
      }

      // Default: return both VET and VTHO balances
      const vetTokenConfig = TOKENS['VET'];
      const vthoToken = getToken('VTHO', network);
      
      // Get account data (includes both VET and VTHO balances)
      const account = await thorClient.accounts.getAccount(Address.of(address));
      const vetBalance = BigInt(account.balance);
      const vthoBalance = BigInt(account.energy);
      
      return {
        success: true,
        data: {
          address,
          network,
            vet: {
              symbol: vetTokenConfig.symbol,
              name: vetTokenConfig.name,
              balance: vetBalance.toString(),
              balanceFormatted: (Number(vetBalance) / Math.pow(10, vetTokenConfig.decimals)).toString(),
              decimals: vetTokenConfig.decimals,
              isNative: true
            },
            vtho: {
              symbol: vthoToken.symbol,
              name: vthoToken.name,
              balance: vthoBalance.toString(),
              balanceFormatted: (Number(vthoBalance) / Math.pow(10, vthoToken.decimals)).toString(),
              decimals: vthoToken.decimals,
              contractAddress: vthoToken.address
            }
        },
        meta: {
          timestamp: new Date().toISOString(),
          network
        }
      };
    } catch (error) {
      console.error('Error getting VET/VTHO balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
});