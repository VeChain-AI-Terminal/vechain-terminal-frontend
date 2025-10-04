'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, FileText, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ContractInfoData = {
  success: boolean;
  data?: {
    address: string;
    balance: string;
    energy: string;
    has_code: boolean;
    code?: string;
    master?: string;
    sponsor?: string;
    user_plan?: {
      credit: string;
      recovery_rate: string;
    };
    energy_plan?: {
      credit: string;
      recovery_rate: string;
    };
  };
  meta?: {
    address: string;
    timestamp: string;
  };
  error?: string;
};

export default function ContractInfo({ 
  data, 
  isLoading = false 
}: { 
  data: ContractInfoData;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-20 bg-zinc-700 rounded animate-pulse"></div>
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
          <CardTitle className="text-red-400">Contract Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load contract'}</p>
        </CardContent>
      </Card>
    );
  }

  const contract = data.data;
  
  const formatVET = (value: string) => {
    const num = parseFloat(value) / 1e18;
    return `${num.toFixed(6)} VET`;
  };

  const formatVTHO = (value: string) => {
    const num = parseFloat(value) / 1e18;
    return `${num.toFixed(6)} VTHO`;
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Smart Contract
          </span>
          <Badge className={contract.has_code ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
            {contract.has_code ? 'Has Code' : 'No Code'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Contract Address</span>
          </div>
          <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
            <code className="text-sm font-mono text-white break-all">
              {contract.address}
            </code>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance & Energy */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-400 mb-2">VET Balance</h4>
            <p className="text-lg font-bold text-white">{formatVET(contract.balance)}</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-400 mb-2">VTHO Energy</h4>
            <p className="text-lg font-bold text-white">{formatVTHO(contract.energy)}</p>
          </div>
        </div>

        {/* Master & Sponsor */}
        {(contract.master || contract.sponsor) && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <Shield className="w-4 h-4 text-blue-400" />
              Governance
            </h4>
            <div className="space-y-3">
              {contract.master && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-sm text-zinc-400">Master:</span>
                  <code className="block text-sm font-mono text-white mt-1">
                    {shortenAddress(contract.master)}
                  </code>
                </div>
              )}
              {contract.sponsor && (
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-sm text-zinc-400">Sponsor:</span>
                  <code className="block text-sm font-mono text-white mt-1">
                    {shortenAddress(contract.sponsor)}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fee Delegation Plans */}
        {(contract.user_plan || contract.energy_plan) && (
          <div className="space-y-3">
            <h4 className="font-semibold">Fee Delegation Plans</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contract.user_plan && (
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-zinc-400 mb-2">User Plan</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Credit:</span>
                      <span className="text-white">{formatVTHO(contract.user_plan.credit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Recovery:</span>
                      <span className="text-white">{formatVTHO(contract.user_plan.recovery_rate)}/s</span>
                    </div>
                  </div>
                </div>
              )}
              {contract.energy_plan && (
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-zinc-400 mb-2">Energy Plan</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Credit:</span>
                      <span className="text-white">{formatVTHO(contract.energy_plan.credit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Recovery:</span>
                      <span className="text-white">{formatVTHO(contract.energy_plan.recovery_rate)}/s</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contract Code Preview */}
        {contract.has_code && contract.code && (
          <div className="space-y-3">
            <h4 className="font-semibold">Contract Code</h4>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <code className="text-xs font-mono text-zinc-300 break-all">
                {contract.code.slice(0, 200)}...
              </code>
              <Button variant="ghost" size="sm" className="mt-2">
                View Full Code
              </Button>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {data.meta && (
          <div className="pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">
              Updated: {new Date(data.meta.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}