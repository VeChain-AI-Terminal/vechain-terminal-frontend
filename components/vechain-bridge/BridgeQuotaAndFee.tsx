'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

type QuotaAndFeeData = {
  success: boolean;
  data?: {
    symbol: string;
    route: string;
    quota: {
      min: string;
      max: string;
      unit: string;
    };
    fees: {
      network: {
        value: string;
        isPercent: boolean;
        description: string;
      };
      operation: {
        value: string;
        isPercent: boolean;
        minLimit?: string;
        maxLimit?: string;
        description: string;
      };
    };
    network: string;
    note: string;
  };
  error?: string;
};

export default function BridgeQuotaAndFee({ 
  data, 
  isLoading = false 
}: { 
  data: QuotaAndFeeData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Bridge Quota & Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="w-32 h-4 bg-zinc-700 rounded mb-2"></div>
              <div className="w-48 h-3 bg-zinc-700 rounded"></div>
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
            <AlertTriangle className="w-5 h-5" />
            Bridge Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load quota and fee information'}</p>
        </CardContent>
      </Card>
    );
  }

  const { symbol, route, quota, fees, network, note } = data.data;
  
  // Debug: Log the data being passed to the component
  console.log('🔍 BridgeQuotaAndFee received data:', {
    symbol,
    route,
    quota,
    fees,
    network,
    note
  });

  const formatAmount = (amount: string, isPercent: boolean) => {
    if (isPercent) {
      return `${(parseFloat(amount) * 100).toFixed(2)}%`;
    }
    return amount;
  };

  const formatLargeNumber = (amount: string, unit: string) => {
    console.log('🔍 formatLargeNumber input:', { amount, unit });
    
    // Convert wei to human readable format (divide by 1e18)
    const weiToToken = BigInt('1000000000000000000'); // 1e18
    const bigAmount = BigInt(amount);
    const humanReadableAmount = bigAmount / weiToToken;
    
    console.log('🔍 Human readable amount:', humanReadableAmount.toString());
    
    // Now format the human readable amount with appropriate units
    const amountStr = humanReadableAmount.toString();
    const digitCount = amountStr.length;
    console.log('🔍 Digit count after conversion:', digitCount);
    
    // Handle large numbers with word-based formatting
    if (digitCount >= 13) {
      // Trillions (12+ digits)
      const divisor = BigInt('1000000000000'); // 1e12
      const result = `${(humanReadableAmount / divisor).toString()} Trillion ${unit}`;
      console.log('🔍 Trillion result:', result);
      return result;
    } else if (digitCount >= 10) {
      // Billions (9+ digits)
      const divisor = BigInt('1000000000'); // 1e9
      const result = `${(humanReadableAmount / divisor).toString()} Billion ${unit}`;
      console.log('🔍 Billion result:', result);
      return result;
    } else if (digitCount >= 7) {
      // Millions (6+ digits)
      const divisor = BigInt('1000000'); // 1e6
      const result = `${(humanReadableAmount / divisor).toString()} Million ${unit}`;
      console.log('🔍 Million result:', result);
      return result;
    } else if (digitCount >= 4) {
      // Thousands (3+ digits)
      const divisor = BigInt('1000'); // 1e3
      const result = `${(humanReadableAmount / divisor).toString()} Thousand ${unit}`;
      console.log('🔍 Thousand result:', result);
      return result;
    } else {
      // Normal numbers - add commas for readability
      const result = `${humanReadableAmount.toLocaleString()} ${unit}`;
      console.log('🔍 Normal result:', result);
      return result;
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Bridge Quota & Fees
          </div>
          <Badge variant="outline" className="border-zinc-600 text-zinc-300">
            {network}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Information */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {symbol}
          </div>
          <div className="text-zinc-400">
            {route}
          </div>
        </div>

        {/* Quota Information */}
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="font-medium text-white">Transfer Limits</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-zinc-500 mb-1">Minimum Amount</div>
              <div className="text-lg font-semibold text-green-400">
                {formatLargeNumber(quota.min, quota.unit)}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">Maximum Amount</div>
              <div className="text-lg font-semibold text-blue-400">
                {formatLargeNumber(quota.max, quota.unit)}
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="space-y-4">
          <div className="text-lg font-semibold text-white mb-3">Fee Structure</div>
          
          {/* Network Fee */}
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">Network Fee</span>
              <Badge variant="outline" className="border-orange-500 text-orange-400">
                {formatLargeNumber(fees.network.value, fees.network.isPercent ? '%' : 'wei')}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400">
              {fees.network.description}
            </p>
          </div>

          {/* Operation Fee */}
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">Operation Fee</span>
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                {formatLargeNumber(fees.operation.value, fees.operation.isPercent ? '%' : 'tokens')}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400 mb-2">
              {fees.operation.description}
            </p>
            {(fees.operation.minLimit || fees.operation.maxLimit) && (
              <div className="text-xs text-zinc-500">
                {fees.operation.minLimit && (
                  <span>Min: {formatLargeNumber(fees.operation.minLimit, 'tokens')} | </span>
                )}
                {fees.operation.maxLimit && (
                  <span>Max: {formatLargeNumber(fees.operation.maxLimit, 'tokens')}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        {note && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-300">{note}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
