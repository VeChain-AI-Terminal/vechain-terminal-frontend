'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type VETVTHOBalanceData = {
  success: boolean;
  data?: {
    vet: string;
    vet_staked: string;
    vtho: string;
  };
  meta?: {
    address: string;
    timestamp: string;
  };
  error?: string;
};

export default function VETVTHOBalance({ 
  data, 
  isLoading = false 
}: { 
  data: VETVTHOBalanceData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image src="/images/vechain.png" alt="VeChain" width={24} height={24} />
            VET & VTHO Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Balance Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load balance'}</p>
        </CardContent>
      </Card>
    );
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image src="/images/vechain.png" alt="VeChain" width={24} height={24} />
          VET & VTHO Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">VET</span>
            </div>
            <span className="font-bold text-lg">{formatBalance(data.data.vet)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium">VTHO</span>
            </div>
            <span className="font-bold text-lg">{formatBalance(data.data.vtho)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium">VET Staked</span>
            </div>
            <span className="font-bold text-lg">{formatBalance(data.data.vet_staked)}</span>
          </div>
        </div>
        
        {data.meta && (
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">
              Address: {data.meta.address.slice(0, 6)}...{data.meta.address.slice(-4)}
            </p>
            <p className="text-xs text-zinc-400">
              Updated: {new Date(data.meta.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}