'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Calendar, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

type NetworkEmissionData = {
  success: boolean;
  data?: {
    co2e_emitted: string;
    co2e_clause_avg: string;
  };
  meta?: {
    timeframe: string;
    type: string;
    unit: string;
    days: number;
    partial_data: boolean;
    disclaimer: string;
    timestamp: string;
  };
  error?: string;
};

export default function NetworkEmission({ 
  data, 
  isLoading = false 
}: { 
  data: NetworkEmissionData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Network Carbon Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-zinc-700 rounded animate-pulse"></div>
              <div className="h-20 bg-zinc-700 rounded animate-pulse"></div>
            </div>
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
          <CardTitle className="text-red-400">Network Emission Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load network emission data'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatEmission = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B kg`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M kg`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K kg`;
    return `${num.toFixed(3)} kg`;
  };

  const getEmissionLevel = (value: string) => {
    const num = parseFloat(value);
    if (num > 1e6) return { color: 'text-red-400', bg: 'bg-red-500/10', level: 'High' };
    if (num > 1e3) return { color: 'text-orange-400', bg: 'bg-orange-500/10', level: 'Medium' };
    return { color: 'text-green-400', bg: 'bg-green-500/10', level: 'Low' };
  };

  const totalLevel = getEmissionLevel(data.data.co2e_emitted);
  const avgLevel = getEmissionLevel(data.data.co2e_clause_avg);

  const formatTimeframe = (timeframe: string) => {
    if (timeframe.includes('-')) {
      const parts = timeframe.split('-');
      if (parts.length === 2) {
        return `${parts[1]}/${parts[0]}`;
      } else if (parts.length === 3) {
        return new Date(timeframe).toLocaleDateString();
      }
    }
    return timeframe;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            Network Carbon Emissions
          </span>
          {data.meta?.partial_data && (
            <Badge className="bg-amber-500/20 text-amber-400">
              Partial Data
            </Badge>
          )}
        </CardTitle>
        {data.meta && (
          <p className="text-sm text-zinc-400">
            Period: {formatTimeframe(data.meta.timeframe)} ({data.meta.days} days)
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeframe Info */}
        <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-400">Analysis Period:</span>
          <span className="text-white font-medium">
            {data.meta && formatTimeframe(data.meta.timeframe)}
          </span>
          <span className="text-zinc-400">
            ({data.meta?.days} days)
          </span>
        </div>

        {/* Emissions Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${totalLevel.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className={`w-4 h-4 ${totalLevel.color}`} />
              <span className="text-sm font-medium text-zinc-400">Total Emissions</span>
            </div>
            <p className={`text-xl font-bold ${totalLevel.color}`}>
              {formatEmission(data.data.co2e_emitted)}
            </p>
            <Badge className={`${totalLevel.bg} ${totalLevel.color} text-xs mt-1`}>
              {totalLevel.level}
            </Badge>
          </div>

          <div className={`p-4 rounded-lg ${avgLevel.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-4 h-4 ${avgLevel.color}`} />
              <span className="text-sm font-medium text-zinc-400">Avg Per Clause</span>
            </div>
            <p className={`text-xl font-bold ${avgLevel.color}`}>
              {formatEmission(data.data.co2e_clause_avg)}
            </p>
            <Badge className={`${avgLevel.bg} ${avgLevel.color} text-xs mt-1`}>
              {avgLevel.level}
            </Badge>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-3">Environmental Impact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Daily average:</span>
              <span className="text-white font-medium">
                {formatEmission((parseFloat(data.data.co2e_emitted) / (data.meta?.days || 1)).toString())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Equivalent driving:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) * 2.2).toFixed(2)} miles
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Trees to offset:</span>
              <span className="text-white font-medium">
                {(parseFloat(data.data.co2e_emitted) / 21.77).toFixed(2)} trees/year
              </span>
            </div>
          </div>
        </div>

        {/* Network Efficiency */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-3">Network Efficiency</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Carbon per clause:</span>
              <span className="text-white font-medium">
                {formatEmission(data.data.co2e_clause_avg)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">vs Bitcoin (daily):</span>
              <span className="text-green-400 font-medium">
                {((parseFloat(data.data.co2e_emitted) / (data.meta?.days || 1)) / 164000000 * 100).toFixed(6)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">vs Ethereum (daily):</span>
              <span className="text-green-400 font-medium">
                {((parseFloat(data.data.co2e_emitted) / (data.meta?.days || 1)) / 25000000 * 100).toFixed(4)}%
              </span>
            </div>
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-green-500/20">
          <h4 className="font-semibold text-white mb-2">Sustainability Score</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {data.meta?.days && parseFloat(data.data.co2e_emitted) / data.meta.days < 1000 ? 'Excellent' : 
                 data.meta?.days && parseFloat(data.data.co2e_emitted) / data.meta.days < 10000 ? 'Good' : 'Fair'}
              </p>
              <p className="text-sm text-zinc-400">Environmental rating</p>
            </div>
            <Leaf className="w-8 h-8 text-green-400" />
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