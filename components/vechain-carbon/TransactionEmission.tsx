'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Hash, ExternalLink, AlertTriangle } from 'lucide-react';

type TransactionEmissionData = {
  success: boolean;
  data?: {
    co2e_emitted: string;
  };
  meta?: {
    txid: string;
    type: string;
    unit: string;
    disclaimer: string;
    timestamp: string;
  };
  error?: string;
};

export default function TransactionEmission({ 
  data, 
  isLoading = false 
}: { 
  data: TransactionEmissionData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Transaction Carbon Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-16 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-12 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Transaction Emission Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load transaction emission data'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatEmission = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e6) return `${(num / 1e6).toFixed(3)}M kg`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(3)}K kg`;
    if (num >= 1) return `${num.toFixed(3)} kg`;
    return `${(num * 1000).toFixed(3)} g`;
  };

  const getEmissionLevel = (value: string) => {
    const num = parseFloat(value);
    if (num > 0.1) return { color: 'text-red-400', bg: 'bg-red-500/10', level: 'High' };
    if (num > 0.01) return { color: 'text-orange-400', bg: 'bg-orange-500/10', level: 'Medium' };
    return { color: 'text-green-400', bg: 'bg-green-500/10', level: 'Low' };
  };

  const emissionLevel = getEmissionLevel(data.data.co2e_emitted);

  const shortenTxId = (txid: string) => {
    return `${txid.slice(0, 10)}...${txid.slice(-8)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            Transaction Carbon Footprint
          </span>
          <Badge className={`${emissionLevel.bg} ${emissionLevel.color}`}>
            {emissionLevel.level} Impact
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Hash */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Transaction Hash</span>
          </div>
          <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
            <code className="text-sm font-mono text-white break-all">
              {data.meta && shortenTxId(data.meta.txid)}
            </code>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Emission Data */}
        <div className={`p-6 rounded-lg ${emissionLevel.bg}`}>
          <div className="flex items-center gap-3 mb-4">
            <Leaf className={`w-6 h-6 ${emissionLevel.color}`} />
            <div>
              <h3 className="font-semibold text-white">CO₂ Emissions</h3>
              <p className="text-sm text-zinc-400">Carbon footprint of this transaction</p>
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
          <h4 className="font-semibold text-white mb-3">Environmental Impact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Equivalent to:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) * 2204.62).toFixed(3)} meters driven
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Energy equivalent:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) * 2.5).toFixed(6)} kWh
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Tree offset time:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) / 21.77 * 365).toFixed(2)} days
              </span>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-3">Comparison</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">vs Bitcoin transaction:</span>
              <span className="text-green-400 font-medium">
                {((parseFloat(data.data.co2e_emitted) / 700) * 100).toFixed(4)}% of BTC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">vs Ethereum transaction:</span>
              <span className="text-green-400 font-medium">
                {((parseFloat(data.data.co2e_emitted) / 0.06) * 100).toFixed(4)}% of ETH
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
                <span>Type: </span>
                <span className="text-white">{data.meta.type}</span>
              </div>
              <div>
                <span>Unit: </span>
                <span className="text-white">{data.meta.unit}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Updated: {new Date(data.meta.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}