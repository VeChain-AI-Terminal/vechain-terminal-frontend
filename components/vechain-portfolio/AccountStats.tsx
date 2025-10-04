'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Activity, Eye } from 'lucide-react';

type AccountStatsData = {
  success: boolean;
  data?: {
    addresses_known: number;
    addresses_new: number;
    addresses_active: number;
    addresses_seen: number;
  };
  meta?: {
    date: string;
    expanded: boolean;
    partial_data: boolean;
    timestamp: string;
  };
  error?: string;
};

export default function AccountStats({ 
  data, 
  isLoading = false 
}: { 
  data: AccountStatsData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
          <CardTitle className="text-red-400">Stats Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load account stats'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const stats = [
    {
      label: 'Total Known',
      value: data.data.addresses_known,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'New Addresses',
      value: data.data.addresses_new,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Active Today',
      value: data.data.addresses_active,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Addresses Seen',
      value: data.data.addresses_seen,
      icon: Eye,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
        {data.meta && (
          <p className="text-sm text-zinc-400">
            Date: {data.meta.date}
            {data.meta.partial_data && (
              <span className="ml-2 text-yellow-400">(Partial Data)</span>
            )}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-4 rounded-lg ${stat.bgColor}`}>
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>
                    {formatNumber(stat.value)}
                  </p>
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