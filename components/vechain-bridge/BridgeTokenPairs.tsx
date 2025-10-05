'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';

type TokenPair = {
  tokenPairID: string;
  symbol: string;
  fromChain: {
    type: string;
    name: string;
    chainId: string;
  };
  toChain: {
    type: string;
    name: string;
    chainId: string;
  };
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
};

type BridgeTokenPairsData = {
  success: boolean;
  data?: {
    pairs: TokenPair[];
    total: number;
    filtered: boolean;
    network: string;
    note: string;
  };
  error?: string;
};

export default function BridgeTokenPairs({ 
  data, 
  isLoading = false 
}: { 
  data: BridgeTokenPairsData;
  isLoading?: boolean;
}) {
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Cross-Chain Token Pairs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="w-20 h-4 bg-zinc-700 rounded"></div>
                    <div className="w-16 h-3 bg-zinc-700 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-8 bg-zinc-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <ArrowRight className="w-5 h-5" />
            Bridge Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load token pairs'}</p>
        </CardContent>
      </Card>
    );
  }

  const { pairs, total, filtered, network, note } = data.data;

  const getChainColor = (chainType: string) => {
    const colors: Record<string, string> = {
      'VET': 'bg-blue-600',
      'ETH': 'bg-gray-600',
      'BNB': 'bg-yellow-600',
      'MATIC': 'bg-purple-600',
      'ARETH': 'bg-cyan-600',
      'OETH': 'bg-red-600',
      'BASEETH': 'bg-blue-500',
      'AVAX': 'bg-orange-600',
    };
    return colors[chainType] || 'bg-zinc-600';
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Cross-Chain Token Pairs
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
              {total} pairs
            </Badge>
            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
              {network}
            </Badge>
          </div>
        </CardTitle>
        {note && (
          <p className="text-sm text-zinc-400">{note}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pairs.map((pair) => (
            <div 
              key={pair.tokenPairID}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                selectedPair?.tokenPairID === pair.tokenPairID 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
              onClick={() => setSelectedPair(selectedPair?.tokenPairID === pair.tokenPairID ? null : pair)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${getChainColor(pair.fromChain.type)} flex items-center justify-center text-xs font-bold text-white`}>
                      {pair.fromChain.type.slice(0, 2)}
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                    <div className={`w-6 h-6 rounded-full ${getChainColor(pair.toChain.type)} flex items-center justify-center text-xs font-bold text-white`}>
                      {pair.toChain.type.slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {pair.symbol} Bridge
                    </div>
                    <div className="text-sm text-zinc-400">
                      {pair.fromChain.name} → {pair.toChain.name}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                >
                  Bridge
                </Button>
              </div>
              
              {selectedPair?.tokenPairID === pair.tokenPairID && (
                <div className="mt-4 pt-4 border-t border-zinc-700 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">From Token</div>
                      <div className="text-sm">
                        <div className="font-medium text-white">{pair.fromToken.symbol}</div>
                        <div className="text-zinc-400 font-mono text-xs">
                          {shortenAddress(pair.fromToken.address)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">To Token</div>
                      <div className="text-sm">
                        <div className="font-medium text-white">{pair.toToken.symbol}</div>
                        <div className="text-zinc-400 font-mono text-xs">
                          {shortenAddress(pair.toToken.address)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Info className="w-3 h-3" />
                    <span>Token Pair ID: {pair.tokenPairID}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
