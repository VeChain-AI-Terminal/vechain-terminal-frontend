'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, AlertTriangle, User, Code } from 'lucide-react';

type AddressEmissionData = {
  success: boolean;
  data?: {
    alias: string;
    has_code: boolean;
    co2e_emitted: string;
    co2e_incoming: string;
  };
  meta?: {
    address: string;
    type: string;
    unit: string;
    disclaimer: string;
    timestamp: string;
  };
  error?: string;
};

export default function AddressEmission({ 
  data, 
  isLoading = false 
}: { 
  data: AddressEmissionData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Carbon Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-zinc-700 rounded animate-pulse"></div>
              <div className="h-16 bg-zinc-700 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Emission Data Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load emission data'}</p>
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
    if (num > 1000) return { color: 'text-red-400', bg: 'bg-red-500/10', level: 'High' };
    if (num > 100) return { color: 'text-orange-400', bg: 'bg-orange-500/10', level: 'Medium' };
    return { color: 'text-green-400', bg: 'bg-green-500/10', level: 'Low' };
  };

  const emittedLevel = getEmissionLevel(data.data.co2e_emitted);
  const incomingLevel = getEmissionLevel(data.data.co2e_incoming);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            Carbon Emissions
          </span>
          {data.data.has_code && (
            <Badge className="bg-blue-500/20 text-blue-400">
              <Code className="w-3 h-3 mr-1" />
              Contract
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Address</span>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <code className="text-sm font-mono text-white">
                  {data.meta && shortenAddress(data.meta.address)}
                </code>
                {data.data.alias && (
                  <p className="text-sm text-zinc-400 mt-1">{data.data.alias}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emissions Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${emittedLevel.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${emittedLevel.color}`} />
              <span className="text-sm font-medium text-zinc-400">CO₂ Emitted</span>
            </div>
            <p className={`text-lg font-bold ${emittedLevel.color}`}>
              {formatEmission(data.data.co2e_emitted)}
            </p>
            <Badge className={`${emittedLevel.bg} ${emittedLevel.color} text-xs mt-1`}>
              {emittedLevel.level}
            </Badge>
          </div>

          <div className={`p-4 rounded-lg ${incomingLevel.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className={`w-4 h-4 ${incomingLevel.color}`} />
              <span className="text-sm font-medium text-zinc-400">CO₂ Incoming</span>
            </div>
            <p className={`text-lg font-bold ${incomingLevel.color}`}>
              {formatEmission(data.data.co2e_incoming)}
            </p>
            <Badge className={`${incomingLevel.bg} ${incomingLevel.color} text-xs mt-1`}>
              {incomingLevel.level}
            </Badge>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-3">Environmental Impact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Net Emissions:</span>
              <span className="text-white font-medium">
                {formatEmission((parseFloat(data.data.co2e_emitted) - parseFloat(data.data.co2e_incoming)).toString())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Carbon Efficiency:</span>
              <span className="text-white font-medium">
                {parseFloat(data.data.co2e_incoming) > parseFloat(data.data.co2e_emitted) ? 'Carbon Negative' : 'Carbon Positive'}
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
                <span>Unit: </span>
                <span className="text-white">{data.meta.unit}</span>
              </div>
              <div>
                <span>Type: </span>
                <span className="text-white">{data.meta.type}</span>
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