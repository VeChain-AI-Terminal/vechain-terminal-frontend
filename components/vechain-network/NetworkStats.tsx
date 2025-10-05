'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Zap, Database, TrendingUp } from 'lucide-react';

type NetworkStatsData = {
  success: boolean;
  data?: {
    block_time: number;
    block_count: number;
    transaction_count: number;
    clause_count: number;
    average_clause_per_transaction: number;
    average_fee_per_transaction: string;
    average_fee_per_clause: string;
  };
  meta?: {
    start_timestamp: string;
    end_timestamp: string;
    timestamp: string;
  };
  error?: string;
};

export default function NetworkStats({ 
  data, 
  isLoading = false 
}: { 
  data: NetworkStatsData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Network Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
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
          <CardTitle className="text-red-400">Network Stats Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load network stats'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num?.toLocaleString();
  };

  const formatFee = (fee: string) => {
    const num = parseFloat(fee);
    return `${(num / 1e18).toFixed(6)} VTHO`;
  };

  const stats = [
    {
      label: 'Block Time',
      value: `${data.data.block_time}s`,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Blocks',
      value: formatNumber(data.data.block_count),
      icon: Database,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Transactions',
      value: formatNumber(data.data.transaction_count),
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Total Clauses',
      value: formatNumber(data.data.clause_count),
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Avg Clauses/Tx',
      value: data.data.average_clause_per_transaction?.toFixed(2),
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Avg Fee/Tx',
      value: formatFee(data.data.average_fee_per_transaction),
      icon: Activity,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    }
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle>VeChain Network Statistics</CardTitle>
        {data.meta && (
          <p className="text-sm text-zinc-400">
            Period: {new Date(data.meta.start_timestamp).toLocaleDateString()} - {new Date(data.meta.end_timestamp).toLocaleDateString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-4 rounded-lg ${stat.bgColor}`}>
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Fee Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Per Transaction:</span>
              <p className="font-medium text-white">{formatFee(data.data.average_fee_per_transaction)}</p>
            </div>
            <div>
              <span className="text-zinc-400">Per Clause:</span>
              <p className="font-medium text-white">{formatFee(data.data.average_fee_per_clause)}</p>
            </div>
          </div>
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