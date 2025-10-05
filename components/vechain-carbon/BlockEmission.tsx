'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Clock, Hash, ExternalLink, AlertTriangle } from 'lucide-react';

type BlockEmissionData = {
  success: boolean;
  data?: {
    number: number;
    hash: string;
    co2e_emitted: string;
    timestamp: string;
  };
  meta?: {
    blocknum: number;
    type: string;
    unit: string;
    disclaimer: string;
    timestamp: string;
  };
  error?: string;
};

export default function BlockEmission({ 
  data, 
  isLoading = false 
}: { 
  data: BlockEmissionData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Block Carbon Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-20 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-16 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Block Emission Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load block emission data'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatEmission = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e6) return `${(num / 1e6).toFixed(3)}M kg`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(3)}K kg`;
    return `${num.toFixed(6)} kg`;
  };

  const getEmissionLevel = (value: string) => {
    const num = parseFloat(value);
    if (num > 1) return { color: 'text-red-400', bg: 'bg-red-500/10', level: 'High' };
    if (num > 0.1) return { color: 'text-orange-400', bg: 'bg-orange-500/10', level: 'Medium' };
    return { color: 'text-green-400', bg: 'bg-green-500/10', level: 'Low' };
  };

  const emissionLevel = getEmissionLevel(data.data.co2e_emitted);

  const shortenHash = (hash: string) => {
    return `${hash?.slice(0, 10)}...${hash?.slice(-8)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            Block Carbon Footprint
          </span>
          <Badge className={`${emissionLevel.bg} ${emissionLevel.color}`}>
            {emissionLevel.level} Impact
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Block Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Block Hash</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
              <code className="text-sm font-mono text-white break-all">
                {shortenHash(data.data.hash)}
              </code>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-400">Block Number</span>
              </div>
              <div className="text-lg font-bold text-white bg-zinc-800 p-3 rounded-lg">
                #{data.data.number?.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-400">Block Time</span>
              </div>
              <div className="text-sm text-white bg-zinc-800 p-3 rounded-lg">
                {new Date(data.data.timestamp)?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Emission Data */}
        <div className={`p-6 rounded-lg ${emissionLevel.bg}`}>
          <div className="flex items-center gap-3 mb-4">
            <Leaf className={`w-6 h-6 ${emissionLevel.color}`} />
            <div>
              <h3 className="font-semibold text-white">CO₂ Emissions</h3>
              <p className="text-sm text-zinc-400">Carbon footprint of this block</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-3xl font-bold ${emissionLevel.color}`}>
                {formatEmission(data.data.co2e_emitted)}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                {data.meta?.unit || 'kg CO₂'}
              </p>
            </div>
            <Badge className={`${emissionLevel.bg} ${emissionLevel.color}`}>
              {emissionLevel.level}
            </Badge>
          </div>
        </div>

        {/* Environmental Context */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-3">Environmental Context</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Equivalent to:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) * 2.2).toFixed(3)} miles driven
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Trees needed to offset:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) / 21.77).toFixed(4)} trees/year
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        {data.meta?.disclaimer && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-300">{data.meta.disclaimer}</p>
            </div>
          </div>
        )}

        {/* Metadata */}
        {data.meta && (
          <div className="pt-4 border-t border-zinc-700">
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400">
              <div>
                <span>Block Number: </span>
                <span className="text-white">#{data.meta.blocknum}</span>
              </div>
              <div>
                <span>Type: </span>
                <span className="text-white">{data.meta.type}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Updated: {new Date(data.meta.timestamp)?.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}