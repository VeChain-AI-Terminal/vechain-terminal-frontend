'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  ArrowUpDown
} from 'lucide-react';
import { useState } from 'react';

type BridgeStatusData = {
  success: boolean;
  data?: {
    txHash: string;
    status: string;
    statusCode: number;
    tokenPair?: string;
    lockHash?: string;
    redeemHash?: string;
    sendAmount?: string;
    receiveAmount?: string;
    timestamp?: string;
    isComplete: boolean;
    isFailed: boolean;
    isPending: boolean;
    needsIntervention: boolean;
    isRefunded: boolean;
    message: string;
    nextSteps: string[];
    network: string;
  };
  error?: string;
};

export default function BridgeStatus({ 
  data, 
  isLoading = false,
  onRefresh
}: { 
  data: BridgeStatusData;
  isLoading?: boolean;
  onRefresh?: () => void;
}) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = async (text: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'Processing':
        return <Clock className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'Refund':
        return <RefreshCw className="w-5 h-5 text-orange-400" />;
      case 'Trusteeship':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'border-green-500 bg-green-900/20';
      case 'Failed':
        return 'border-red-500 bg-red-900/20';
      case 'Processing':
        return 'border-blue-500 bg-blue-900/20';
      case 'Refund':
        return 'border-orange-500 bg-orange-900/20';
      case 'Trusteeship':
        return 'border-yellow-500 bg-yellow-900/20';
      default:
        return 'border-zinc-500 bg-zinc-900/20';
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Bridge Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="w-48 h-6 bg-zinc-700 rounded mb-2"></div>
              <div className="w-32 h-4 bg-zinc-700 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-pulse">
                <div className="w-24 h-4 bg-zinc-700 rounded mb-2"></div>
                <div className="w-20 h-3 bg-zinc-700 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="w-24 h-4 bg-zinc-700 rounded mb-2"></div>
                <div className="w-20 h-3 bg-zinc-700 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <XCircle className="w-5 h-5" />
            Bridge Status Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load bridge status'}</p>
        </CardContent>
      </Card>
    );
  }

  const { 
    txHash, 
    status, 
    statusCode, 
    tokenPair, 
    lockHash, 
    redeemHash, 
    sendAmount, 
    receiveAmount, 
    timestamp, 
    isComplete, 
    isFailed, 
    isPending, 
    needsIntervention, 
    isRefunded, 
    message, 
    nextSteps,
    network
  } = data.data;

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            Bridge Status
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${getStatusColor(status)} text-white`}
            >
              {status}
            </Badge>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Message */}
        <div className="text-center">
          <p className="text-lg font-medium text-white mb-1">
            {message}
          </p>
          <p className="text-sm text-zinc-400">
            Last updated: {formatTimestamp(timestamp)}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4">
          {/* Transaction Hash */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400">Transaction Hash</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(txHash, 'txHash')}
                className="text-zinc-400 hover:text-white"
              >
                {copiedHash === 'txHash' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="font-mono text-sm text-white break-all">
              {shortenHash(txHash)}
            </div>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4">
            {sendAmount && (
              <div className="bg-zinc-800/30 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">Sent Amount</div>
                <div className="font-semibold text-white">{sendAmount}</div>
              </div>
            )}
            {receiveAmount && (
              <div className="bg-zinc-800/30 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">Receive Amount</div>
                <div className="font-semibold text-green-400">{receiveAmount}</div>
              </div>
            )}
          </div>

          {/* Additional Hashes */}
          {(lockHash || redeemHash) && (
            <div className="space-y-3">
              {lockHash && (
                <div className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-400">Lock Hash</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(lockHash, 'lockHash')}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copiedHash === 'lockHash' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="font-mono text-sm text-white break-all">
                    {shortenHash(lockHash)}
                  </div>
                </div>
              )}
              {redeemHash && (
                <div className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-400">Redeem Hash</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(redeemHash, 'redeemHash')}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copiedHash === 'redeemHash' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="font-mono text-sm text-white break-all">
                    {shortenHash(redeemHash)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Token Pair */}
          {tokenPair && (
            <div className="bg-zinc-800/30 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">Token Pair</div>
              <div className="font-semibold text-white">{tokenPair}</div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        {nextSteps && nextSteps.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-blue-300">Next Steps</span>
            </div>
            <ul className="space-y-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-200">
                  <span className="text-blue-400 font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Intervention Warning */}
        {needsIntervention && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="font-medium text-yellow-300">Manual Intervention Required</span>
            </div>
            <p className="text-sm text-yellow-200">
              Contact support@wanchain.org with your transaction hash for assistance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
