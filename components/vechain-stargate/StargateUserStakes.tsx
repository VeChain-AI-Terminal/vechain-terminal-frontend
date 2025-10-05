import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StargateStake {
  tokenId: string;
  level: string;
  levelId: number;
  isX: boolean;
  vetStaked: string;
  vetStakedWei: string;
  mintedAtBlock: string;
  lastVthoClaimTimestamp: string;
  maturityBlocks: number;
  scaledRewardFactor: number;
  canTransfer?: boolean;
  claimableVtho?: string;
  claimableVthoWei?: string;
  maturityEndBlock?: string;
  maturityDays?: number;
  isUnderMaturity?: boolean;
}

interface StargateUserStakesProps {
  data: {
    success: boolean;
    address: string;
    totalStakes: number;
    stakes: StargateStake[];
    network: string;
    contractAddress: string;
    message: string;
    error?: string;
  };
  isLoading: boolean;
}

const StargateUserStakes: React.FC<StargateUserStakesProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Loading Your StarGate Stakes...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!data.success || data.error) {
    return (
      <Card className="w-full border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Stakes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{data.error || data.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (data.totalStakes === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No StarGate Stakes Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">{data.message}</p>
          <p className="text-sm text-gray-500 mt-2">
            Address: <code className="bg-gray-800 px-2 py-1 rounded">{data.address}</code>
          </p>
        </CardContent>
      </Card>
    );
  }

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your StarGate Stakes</span>
            <Badge variant="outline">{data.totalStakes} NFT{data.totalStakes !== 1 ? 's' : ''}</Badge>
          </CardTitle>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-400">{data.message}</p>
            <p className="text-xs text-gray-500">
              Address: <code className="bg-gray-800 px-2 py-1 rounded">{shortenAddress(data.address)}</code>
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.stakes?.map((stake) => (
          <Card key={stake.tokenId} className={`${stake.isX ? 'border-yellow-500 bg-yellow-50/5' : 'border-blue-500 bg-blue-50/5'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {stake.level} #{stake.tokenId}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant={stake.isX ? "default" : "secondary"}>
                    {stake.isX ? "X-Series" : "Standard"}
                  </Badge>
                  {stake.canTransfer && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Transferable
                    </Badge>
                  )}
                  {stake.isUnderMaturity && (
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      Maturing
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">VET Staked:</span>
                  <span className="font-mono font-bold text-blue-400">{stake.vetStaked}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reward Factor:</span>
                  <span className="font-bold text-green-400">{stake.scaledRewardFactor}x</span>
                </div>
                
                {stake.claimableVtho && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Claimable VTHO:</span>
                    <span className="font-mono font-bold text-purple-400">{stake.claimableVtho}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Minted At Block:</span>
                  <span className="font-mono text-xs">{stake.mintedAtBlock}</span>
                </div>
                
                {!stake.isX && stake.maturityDays && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Maturity Period:</span>
                    <span className="font-mono">{stake.maturityDays} days</span>
                  </div>
                )}
                
                {stake.isX && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Maturity Period:</span>
                    <span className="font-mono text-green-400">None (X-Series)</span>
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t border-gray-700 flex gap-2">
                {stake.claimableVtho && parseFloat(stake.claimableVtho) > 0 && (
                  <Button size="sm" variant="outline" className="flex-1 text-purple-400 border-purple-400 hover:bg-purple-400/10">
                    Claim VTHO
                  </Button>
                )}
                {stake.canTransfer && (
                  <Button size="sm" variant="outline" className="flex-1 text-red-400 border-red-400 hover:bg-red-400/10">
                    Unstake
                  </Button>
                )}
                {!stake.canTransfer && !stake.isX && (
                  <Button size="sm" variant="outline" disabled className="flex-1">
                    Unstake (Maturing)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StargateUserStakes;