'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, Zap, Hash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TransactionInfoData = {
  success: boolean;
  data?: {
    tx_id: string;
    origin: string;
    delegator?: string;
    gas_payer: string;
    gas_used: number;
    gas_price: string;
    paid_by_delegator: boolean;
    reward: string;
    reverted: boolean;
    gas_price_coefficient: number;
    block_number: number;
    block_timestamp: string;
    tx_index: number;
    clauses: Array<{
      to: string;
      value: string;
      data: string;
    }>;
  };
  meta?: {
    tx_id: string;
    timestamp: string;
  };
  error?: string;
};

export default function TransactionInfo({ 
  data, 
  isLoading = false 
}: { 
  data: TransactionInfoData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-20 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Transaction Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load transaction'}</p>
        </CardContent>
      </Card>
    );
  }

  const tx = data.data;
  
  const formatVTHO = (value: string) => {
    const num = parseFloat(value) / 1e18;
    return `${num.toFixed(6)} VTHO`;
  };

  const formatVET = (value: string) => {
    const num = parseFloat(value) / 1e18;
    return `${num.toFixed(6)} VET`;
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    if (tx.reverted) return 'bg-red-500/20 text-red-400';
    return 'bg-green-500/20 text-green-400';
  };

  const getStatusText = () => {
    if (tx.reverted) return 'Reverted';
    return 'Success';
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction Details</span>
          <Badge className={getStatusColor()}>
            {getStatusText()}
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
              {tx.tx_id}
            </code>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Origin</span>
            </div>
            <code className="text-sm font-mono text-white bg-zinc-800 p-2 rounded block">
              {shortenAddress(tx.origin)}
            </code>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Block</span>
            </div>
            <div className="text-sm text-white bg-zinc-800 p-2 rounded">
              #{tx.block_number?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Gas Info */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold">
            <Zap className="w-4 h-4 text-yellow-400" />
            Gas & Fees
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-zinc-800 p-3 rounded-lg">
              <span className="text-zinc-400">Gas Used:</span>
              <p className="font-medium text-white">{tx.gas_used?.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <span className="text-zinc-400">Gas Price:</span>
              <p className="font-medium text-white">{formatVTHO(tx.gas_price)}</p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <span className="text-zinc-400">Reward:</span>
              <p className="font-medium text-white">{formatVTHO(tx.reward)}</p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <span className="text-zinc-400">Paid by Delegator:</span>
              <p className="font-medium text-white">{tx.paid_by_delegator ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Clauses */}
        <div className="space-y-3">
          <h4 className="font-semibold">
            Clauses ({tx.clauses.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {tx.clauses.map((clause, index) => (
              <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-400">
                    Clause #{index + 1}
                  </span>
                  {clause.value !== '0' && (
                    <span className="text-sm font-medium text-green-400">
                      {formatVET(clause.value)}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">To: </span>
                    <code className="text-white">{shortenAddress(clause.to)}</code>
                  </div>
                  {clause.data !== '0x' && (
                    <div>
                      <span className="text-zinc-400">Data: </span>
                      <code className="text-white break-all">{clause.data.slice(0, 50)}...</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timestamp */}
        {data.meta && (
          <div className="pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">
              Block Time: {new Date(tx.block_timestamp).toLocaleString()}
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