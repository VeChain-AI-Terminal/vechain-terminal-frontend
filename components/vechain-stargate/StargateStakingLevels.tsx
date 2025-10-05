import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Zap, Clock, Coins } from 'lucide-react';

interface StargateLevel {
  id: number;
  name: string;
  isX: boolean;
  vetAmountRequiredToStake: string;
  vetRequiredFormatted: string;
  scaledRewardFactor: number;
  maturityBlocks: number;
  maturityDays: number;
  category: string;
  description: string;
}

interface StargateStakingLevelsProps {
  data: {
    success: boolean;
    data?: {
      levels?: StargateLevel[];
      totalLevels?: number;
      dataSource?: string;
    };
    meta?: {
      network?: string;
      contractAddress?: string;
      category?: string;
      timestamp?: string;
    };
    levels?: StargateLevel[]; // For backward compatibility
    totalLevels?: number; // For backward compatibility
    network?: string; // For backward compatibility
    message?: string;
    error?: string;
  };
  isLoading: boolean;
}

const StargateStakingLevels: React.FC<StargateStakingLevelsProps> = ({ data, isLoading }) => {
  const [selectedLevel, setSelectedLevel] = useState<StargateLevel | null>(null);
  
  // Handle both data.levels and data.data.levels structures
  const actualData = data?.data || data;
  const levels = actualData?.levels;
  
  // Color generator based on level ID
  const generateLevelColor = (id: number, isX: boolean) => {
    if (isX) {
      const hue = 45; // Gold/yellow for X-series
      return `hsl(${hue}, 80%, 60%)`;
    }
    const hue = (id * 60) % 360; // Different colors for standard levels
    return `hsl(${hue}, 70%, 50%)`;
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>StarGate Staking Levels</CardTitle>
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

  if (!data.success || data.error) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">StarGate Levels Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || data.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!levels || levels.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>No Staking Levels Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">{data.message || actualData?.totalLevels?.toString() || 'No levels found'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            StarGate Staking Levels
            <div className="flex items-center gap-2">
              <Badge variant="outline">{data.meta?.network === 'main' ? 'Mainnet' : data.meta?.network === 'test' ? 'Testnet' : data.network === 'main' ? 'Mainnet' : data.network === 'test' ? 'Testnet' : 'Unknown'}</Badge>
              <span className="text-sm font-normal text-zinc-400">
                {levels.length} levels
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {levels.map((level) => (
              <div 
                key={level.id} 
                className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors cursor-pointer"
                onClick={() => setSelectedLevel(level)}
              >
                {/* Level Identicon - similar to NFT */}
                <div 
                  className="w-full h-32 rounded-lg mb-3 flex items-center justify-center"
                  style={{ backgroundColor: generateLevelColor(level.id, level.isX) }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {level.isX ? <Zap className="w-4 h-4 text-white/80" /> : <Coins className="w-4 h-4 text-white/80" />}
                  </div>
                </div>
                
                {/* Level Info - matching NFT layout */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{level.name}</h3>
                        {level.isX && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                            X-Series
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 truncate">Level {level.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={level.isX ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}>
                      {level.scaledRewardFactor}x
                    </Badge>
                    <span className="text-xs text-zinc-400">
                      {level.vetRequiredFormatted}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-xs text-zinc-400">
                      {level.isX ? 'No lock period' : `${level.maturityDays} days`}
                    </span>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-zinc-700">
                    <span className="text-xs text-zinc-500 truncate">
                      {level.description}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {data.meta && (
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <p className="text-xs text-zinc-400">
                Updated: {new Date(data.meta.timestamp || '').toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedLevel} onOpenChange={() => setSelectedLevel(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedLevel ? generateLevelColor(selectedLevel.id, selectedLevel.isX) : '#666' }}
              >
                {selectedLevel?.isX ? <Zap className="w-5 h-5 text-white/80" /> : <Coins className="w-5 h-5 text-white/80" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedLevel?.name}</h2>
                <p className="text-sm text-zinc-400">Level {selectedLevel?.id}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLevel && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">VET Required</p>
                  <p className="font-mono font-bold text-blue-400">{selectedLevel.vetRequiredFormatted}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">Reward Multiplier</p>
                  <p className="font-bold text-green-400">{selectedLevel.scaledRewardFactor}x</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">Maturity Period</p>
                  <p className="font-mono text-white">
                    {selectedLevel.isX ? 'No lock period' : `${selectedLevel.maturityDays} days`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">Type</p>
                  <Badge variant={selectedLevel.isX ? "default" : "secondary"}>
                    {selectedLevel.isX ? "X-Series" : "Standard"}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-700">
                <p className="text-xs text-zinc-400 mb-2">Description</p>
                <p className="text-sm text-zinc-300">{selectedLevel.description}</p>
              </div>
              
              {selectedLevel.maturityBlocks > 0 && (
                <div className="bg-zinc-800 rounded-lg p-3">
                  <p className="text-xs text-zinc-400 mb-1">Maturity Details</p>
                  <p className="text-xs text-zinc-300">
                    {selectedLevel.maturityBlocks.toLocaleString()} blocks (~{selectedLevel.maturityDays} days)
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StargateStakingLevels;