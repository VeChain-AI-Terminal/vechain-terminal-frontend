'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Search, 
  DollarSign, 
  Clock, 
  Zap,
  Info
} from 'lucide-react';
import { useState } from 'react';
import BridgeTokenPairs from './BridgeTokenPairs';
import BridgeQuotaAndFee from './BridgeQuotaAndFee';
import BridgeStatus from './BridgeStatus';
import XFlowsQuote from './XFlowsQuote';

type BridgeDashboardProps = {
  // Token Pairs Data
  tokenPairsData?: any;
  tokenPairsLoading?: boolean;
  
  // Quota & Fee Data
  quotaData?: any;
  quotaLoading?: boolean;
  
  // Status Data
  statusData?: any;
  statusLoading?: boolean;
  
  // XFlows Data
  xflowsData?: any;
  xflowsLoading?: boolean;
  
  // Callbacks
  onSearchPairs?: (fromChain?: string, toChain?: string) => void;
  onCheckQuota?: (params: any) => void;
  onCheckStatus?: (txHash: string) => void;
  onGetXFlowsQuote?: (params: any) => void;
};

export default function BridgeDashboard({
  tokenPairsData,
  tokenPairsLoading = false,
  quotaData,
  quotaLoading = false,
  statusData,
  statusLoading = false,
  xflowsData,
  xflowsLoading = false,
  onSearchPairs,
  onCheckQuota,
  onCheckStatus,
  onGetXFlowsQuote
}: BridgeDashboardProps) {
  const [activeTab, setActiveTab] = useState('discover');

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'discover':
        return <Search className="w-4 h-4" />;
      case 'quota':
        return <DollarSign className="w-4 h-4" />;
      case 'status':
        return <Clock className="w-4 h-4" />;
      case 'xflows':
        return <Zap className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ArrowRight className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Cross-Chain Bridge</h2>
        </div>
        <p className="text-zinc-400">
          Bridge tokens across 25+ blockchains with VeChain integration
        </p>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-800 border-zinc-700">
          <TabsTrigger 
            value="discover" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600"
          >
            {getTabIcon('discover')}
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger 
            value="quota" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600"
          >
            {getTabIcon('quota')}
            <span className="hidden sm:inline">Quota & Fees</span>
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600"
          >
            {getTabIcon('status')}
            <span className="hidden sm:inline">Status</span>
          </TabsTrigger>
          <TabsTrigger 
            value="xflows" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600"
          >
            {getTabIcon('xflows')}
            <span className="hidden sm:inline">XFlows</span>
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Available Token Pairs</h3>
              <p className="text-sm text-zinc-400">
                Discover cross-chain routes and available tokens
              </p>
            </div>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              25+ Chains
            </Badge>
          </div>
          <BridgeTokenPairs 
            data={tokenPairsData || { success: false }}
            isLoading={tokenPairsLoading}
          />
        </TabsContent>

        {/* Quota & Fees Tab */}
        <TabsContent value="quota" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Bridge Limits & Fees</h3>
              <p className="text-sm text-zinc-400">
                Check minimum/maximum amounts and fee structure
              </p>
            </div>
            <Badge variant="outline" className="border-green-500 text-green-400">
              Real-time
            </Badge>
          </div>
          <BridgeQuotaAndFee 
            data={quotaData || { success: false }}
            isLoading={quotaLoading}
          />
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Transaction Status</h3>
              <p className="text-sm text-zinc-400">
                Monitor your cross-chain bridge transactions
              </p>
            </div>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              Live Updates
            </Badge>
          </div>
          <BridgeStatus 
            data={statusData || { success: false }}
            isLoading={statusLoading}
            onRefresh={onCheckStatus ? () => onCheckStatus('') : undefined}
          />
        </TabsContent>

        {/* XFlows Tab */}
        <TabsContent value="xflows" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">XFlows Cross-Chain Swaps</h3>
              <p className="text-sm text-zinc-400">
                Advanced swap+bridge combinations with DEX integration
              </p>
            </div>
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              6 Work Modes
            </Badge>
          </div>
          <XFlowsQuote 
            data={xflowsData || { success: false }}
            isLoading={xflowsLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => onSearchPairs?.('VET')}
              className="p-3 border border-zinc-700 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-medium text-white">VeChain Routes</div>
              <div className="text-sm text-zinc-400">From VET</div>
            </button>
            
            <button 
              onClick={() => onSearchPairs?.('ETH')}
              className="p-3 border border-zinc-700 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-medium text-white">Ethereum Routes</div>
              <div className="text-sm text-zinc-400">From ETH</div>
            </button>
            
            <button 
              onClick={() => onSearchPairs?.('BNB')}
              className="p-3 border border-zinc-700 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-medium text-white">BSC Routes</div>
              <div className="text-sm text-zinc-400">From BNB</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('xflows')}
              className="p-3 border border-zinc-700 rounded-lg hover:border-orange-500 transition-colors text-left"
            >
              <div className="font-medium text-white">XFlows Swaps</div>
              <div className="text-sm text-zinc-400">Advanced</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
