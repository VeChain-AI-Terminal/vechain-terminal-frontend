'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  ArrowRight, 
  Zap,
  DollarSign,
  Percent
} from 'lucide-react';

type XFlowsQuoteData = {
  success: boolean;
  data?: {
    quote: {
      amountOut: string;
      amountOutRaw: string;
      amountOutMin: string;
      amountOutMinRaw: string;
      priceImpact: string;
      slippage: string;
      workMode: string;
      bridge: string;
      dex: string;
      approvalAddress?: string;
    };
    fees: {
      native: any[];
      token: any[];
    };
    extraData: any;
    note: string;
  };
  error?: string;
};

export default function XFlowsQuote({ 
  data, 
  isLoading = false 
}: { 
  data: XFlowsQuoteData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            XFlows Cross-Chain Quote
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
            <Zap className="w-5 h-5" />
            XFlows Quote Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to get XFlows quote'}</p>
        </CardContent>
      </Card>
    );
  }

  const { quote, fees, extraData, note } = data.data;
  
  const parsePriceImpact = (impact: string) => {
    const num = parseFloat(impact);
    return {
      value: Math.abs(num),
      isPositive: num >= 0
    };
  };

  const priceImpact = parsePriceImpact(quote.priceImpact);

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            XFlows Cross-Chain Quote
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-600 text-blue-400">
              {quote.workMode}
            </Badge>
            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
              {quote.bridge}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Quote Information */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {parseFloat(quote.amountOut).toLocaleString()}
          </div>
          <div className="text-zinc-400 mb-4">Expected Output Amount</div>
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {priceImpact.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={priceImpact.isPositive ? 'text-green-400' : 'text-red-400'}>
                {priceImpact.value.toFixed(2)}% Price Impact
              </span>
            </div>
          </div>
        </div>

        {/* Quote Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-zinc-400">Minimum Output</span>
            </div>
            <div className="text-lg font-semibold text-green-400">
              {parseFloat(quote.amountOutMin).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500">
              (Slippage Protected)
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-zinc-400">Slippage</span>
            </div>
            <div className="text-lg font-semibold text-blue-400">
              {(parseFloat(quote.slippage) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-zinc-500">
              Tolerance
            </div>
          </div>
        </div>

        {/* Work Mode Information */}
        <div className="bg-zinc-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="font-medium text-white">Work Mode</span>
          </div>
          <div className="text-sm text-zinc-300 mb-2">
            {quote.workMode}
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>Bridge: {quote.bridge}</span>
            {quote.dex && <span>DEX: {quote.dex}</span>}
          </div>
        </div>

        {/* Approval Information */}
        {quote.approvalAddress && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-yellow-300">Approval Required</span>
            </div>
            <div className="text-sm text-yellow-200 mb-2">
              Token approval needed before swap execution
            </div>
            <div className="font-mono text-xs text-yellow-300 break-all">
              {quote.approvalAddress}
            </div>
          </div>
        )}

        {/* Fees Information */}
        {(fees.native.length > 0 || fees.token.length > 0) && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-white">Estimated Fees</div>
            
            {fees.native.length > 0 && (
              <div className="bg-zinc-800/30 rounded-lg p-3">
                <div className="text-sm font-medium text-zinc-400 mb-2">Native Token Fees</div>
                {fees.native.map((fee: any, index: number) => (
                  <div key={index} className="text-sm text-zinc-300">
                    {fee.amount} {fee.symbol}
                  </div>
                ))}
              </div>
            )}

            {fees.token.length > 0 && (
              <div className="bg-zinc-800/30 rounded-lg p-3">
                <div className="text-sm font-medium text-zinc-400 mb-2">Token Fees</div>
                {fees.token.map((fee: any, index: number) => (
                  <div key={index} className="text-sm text-zinc-300">
                    {fee.amount} {fee.symbol}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Note */}
        {note && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-300">{note}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Execute Cross-Chain Swap
        </Button>
      </CardContent>
    </Card>
  );
}
