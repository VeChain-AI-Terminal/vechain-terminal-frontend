'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

type TokenData = {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  circulating_supply?: string;
  total_supply?: string;
  official?: boolean;
  price?: string;
};

type TokenListData = {
  success: boolean;
  data?: TokenData[];
  meta?: {
    timestamp: string;
  };
  error?: string;
};

export default function TokenList({ 
  data, 
  isLoading = false 
}: { 
  data: TokenListData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>VeChain Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-zinc-800 rounded-lg">
                <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-zinc-700 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="w-16 h-4 bg-zinc-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Token List Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load token list'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatSupply = (supply: string | undefined, decimals: number) => {
    if (!supply) return 'N/A';
    const num = parseFloat(supply) / Math.pow(10, decimals);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'N/A';
    const num = parseFloat(price);
    return `$${num.toFixed(6)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          VeChain Tokens
          <span className="text-sm font-normal text-zinc-400">
            {data.data.length} tokens
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data?.data?.map((token, index) => (
            <div 
              key={token.address || index} 
              className="flex items-center space-x-4 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {token.symbol.slice(0, 2)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{token.symbol}</h3>
                  {token.official && (
                    <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                      Official
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 truncate">{token.name}</p>
                <p className="text-xs text-zinc-500">
                  Supply: {formatSupply(token.circulating_supply || token.total_supply, token.decimals)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {formatPrice(token.price)}
                </p>
                <p className="text-xs text-zinc-400">
                  {token.decimals} decimals
                </p>
              </div>
              
              <button className="p-1 hover:bg-zinc-700 rounded">
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>
        
        {data.meta && (
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">
              Updated: {new Date(data.meta.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}