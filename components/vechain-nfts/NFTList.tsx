'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

type NFTData = {
  contract: string;
  name: string;
  symbol: string;
  type: string;
  nft?: number;
  official?: boolean;
  verified?: boolean;
};

type NFTListData = {
  success: boolean;
  data?: NFTData[];
  meta?: {
    timestamp: string;
  };
  error?: string;
};

// Simple identicon generator based on address
const generateIdenticon = (address: string) => {
  const hash = address.slice(2); // Remove 0x
  const hue = parseInt(hash.slice(0, 6), 16) % 360;
  const saturation = 70 + (parseInt(hash.slice(6, 8), 16) % 30);
  const lightness = 40 + (parseInt(hash.slice(8, 10), 16) % 20);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function NFTList({ 
  data, 
  isLoading = false 
}: { 
  data: NFTListData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>VeChain NFTs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-4 space-y-3">
                <div className="w-full h-32 bg-zinc-700 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-zinc-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  console.log(data);

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">NFT List Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load NFT list'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatSupply = (supply: number | undefined) => {
    if (!supply) return 'Unknown';
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(1)}M`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(1)}K`;
    return supply.toLocaleString();
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'erc721':
      case 'vip181':
        return 'bg-blue-500/20 text-blue-400';
      case 'erc1155':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          VeChain NFT Collections
          <span className="text-sm font-normal text-zinc-400">
            {data.data.length} collections
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {data.data.map((nft, index) => (
            <div 
              key={nft.contract || index} 
              className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors"
            >
              {/* NFT Identicon */}
              <div 
                className="w-full h-32 rounded-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: generateIdenticon(nft.contract || '') }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white/80" />
                </div>
              </div>
              
              {/* NFT Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{nft.name}</h3>
                      {nft.official && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          Official
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{nft.symbol}</p>
                  </div>
                  <a 
                    href={`https://vechainstats.com/account/${nft.contract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-zinc-700 rounded ml-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
                  </a>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(nft.type)}>
                    {nft.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    {formatSupply(nft.nft)} items
                  </span>
                </div>
                
                {nft.verified && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-green-400">Verified</span>
                  </div>
                )}
                
                <div className="mt-2 pt-2 border-t border-zinc-700">
                  <code className="text-xs text-zinc-500 break-all">
                    {nft.contract?.slice(0, 10)}...{nft.contract?.slice(-8)}
                  </code>
                </div>
              </div>
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