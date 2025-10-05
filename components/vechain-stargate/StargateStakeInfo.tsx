import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StargateStakeInfoProps {
  data: {
    success: boolean;
    tokenId: string;
    level: string;
    levelId: number;
    isX: boolean;
    vetStaked: string;
    vetStakedWei: string;
    mintedAtBlock: string;
    lastVthoClaimTimestamp: string;
    maturityBlocks: number;
    maturityDays: number;
    scaledRewardFactor: number;
    claimableVtho: string;
    claimableVthoWei: string;
    canTransfer: boolean;
    maturityEndBlock: string;
    isUnderMaturity?: boolean;
    network: string;
    contractAddress: string;
    message: string;
    error?: string;
  };
  isLoading: boolean;
}

const StargateStakeInfo: React.FC<StargateStakeInfoProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Loading StarGate NFT Details...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!data.success || data.error) {
    return (
      <Card className="w-full border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Stake Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{data.error || data.message}</p>
        </CardContent>
      </Card>
    );
  }

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className={`${data.isX ? 'border-yellow-500 bg-yellow-50/5' : 'border-blue-500 bg-blue-50/5'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {data.level} StarGate NFT #{data.tokenId}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant={data.isX ? "default" : "secondary"}>
                {data.isX ? "X-Series" : "Standard"}
              </Badge>
              <Badge variant="outline">Level {data.levelId}</Badge>
              {data.canTransfer && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Transferable
                </Badge>
              )}
              {!data.canTransfer && !data.isX && (
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  Under Maturity
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400">{data.message}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Token ID:</span>
              <span className="font-mono font-bold">{data.tokenId}</span>
            </div>
            
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Level:</span>
              <span className="font-bold">{data.level} (ID: {data.levelId})</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">VET Staked:</span>
              <span className="font-mono font-bold text-blue-400">{data.vetStaked}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Reward Factor:</span>
              <span className="font-bold text-green-400">{data.scaledRewardFactor}x</span>
            </div>
          </CardContent>
        </Card>

        {/* Staking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Minted At Block:</span>
              <span className="font-mono">{data.mintedAtBlock}</span>
            </div>
            
            {!data.isX && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Maturity Period:</span>
                  <span className="font-mono">{data.maturityDays} days</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Maturity End Block:</span>
                  <span className="font-mono">{data.maturityEndBlock}</span>
                </div>
              </>
            )}
            
            {data.isX && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Maturity Period:</span>
                <span className="font-mono text-green-400">None (X-Series)</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last VTHO Claim:</span>
              <span className="font-mono text-xs">{formatTimestamp(data.lastVthoClaimTimestamp)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Can Transfer:</span>
              <span className={`font-bold ${data.canTransfer ? 'text-green-400' : 'text-orange-400'}`}>
                {data.canTransfer ? 'Yes' : 'No'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* VTHO Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">VTHO Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Claimable VTHO:</span>
              <span className="font-mono font-bold text-purple-400">{data.claimableVtho}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">In Wei:</span>
              <span className="font-mono text-xs">{data.claimableVthoWei}</span>
            </div>
            
            {parseFloat(data.claimableVtho) > 0 && (
              <div className="pt-2">
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  Claim {data.claimableVtho} VTHO
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network:</span>
              <span className="font-mono">{data.network === 'main' ? 'Mainnet' : 'Testnet'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Contract:</span>
              <span className="font-mono text-xs">{shortenAddress(data.contractAddress)}</span>
            </div>
            
            {data.canTransfer && (
              <div className="pt-2">
                <Button size="sm" variant="destructive" className="w-full">
                  Unstake NFT
                </Button>
              </div>
            )}
            
            {!data.canTransfer && !data.isX && (
              <div className="pt-2">
                <Button size="sm" variant="outline" disabled className="w-full">
                  Unstake (Under Maturity)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StargateStakeInfo;