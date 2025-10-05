'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText, Settings, Download, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

type ContractCodeData = {
  success: boolean;
  data?: {
    sources: Record<string, string>;
    abi: any[];
    contract_name: string;
    compiler_version: string;
    optimization_enabled: boolean;
    optimization_runs: number;
    constructor_arguments: string;
    library_info: any;
  };
  meta?: {
    address: string;
    expanded: boolean;
    timestamp: string;
  };
  error?: string;
};

export default function ContractCode({ 
  data, 
  isLoading = false 
}: { 
  data: ContractCodeData;
  isLoading?: boolean;
}) {
  const [activeSourceFile, setActiveSourceFile] = useState<string>('');
  const [copiedSection, setCopiedSection] = useState<string>('');

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle>Contract Source Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-32 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-48 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data) {
    return (
      <Card className="bg-zinc-900 border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-400">Contract Code Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{data.error || 'Failed to load contract source code'}</p>
        </CardContent>
      </Card>
    );
  }

  const contract = data.data;
  const sourceFiles = Object.keys(contract.sources || {});
  
  // Set initial active file if not set
  if (sourceFiles.length > 0 && !activeSourceFile) {
    setActiveSourceFile(sourceFiles[0]);
  }

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Contract Source Code
          </span>
          <Badge className="bg-green-500/20 text-green-400">
            Verified
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Contract Name</h4>
            <p className="text-white font-mono">{contract.contract_name}</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Compiler Version</h4>
            <p className="text-white font-mono text-sm">{contract.compiler_version}</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Optimization</h4>
            <div className="space-y-1">
              <p className="text-white">
                {contract.optimization_enabled ? 'Enabled' : 'Disabled'}
              </p>
              {contract.optimization_enabled && (
                <p className="text-xs text-zinc-400">
                  {contract.optimization_runs} runs
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contract Address */}
        {data.meta && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-400">Contract Address</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
              <code className="text-sm font-mono text-white break-all">
                {data.meta.address}
              </code>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(data.meta!.address, 'address')}
                >
                  {copiedSection === 'address' ? '✓' : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Source Code Tabs */}
        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Source Files
            </TabsTrigger>
            <TabsTrigger value="abi" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ABI
            </TabsTrigger>
            {contract.constructor_arguments && (
              <TabsTrigger value="constructor">Constructor Args</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            {sourceFiles.length > 0 && (
              <>
                {/* File Selector */}
                {sourceFiles.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {sourceFiles.map((fileName) => (
                      <Button
                        key={fileName}
                        variant={activeSourceFile === fileName ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveSourceFile(fileName)}
                        className="text-xs"
                      >
                        {fileName}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Source Code Display */}
                {activeSourceFile && contract.sources[activeSourceFile] && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{activeSourceFile}</h4>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(contract.sources[activeSourceFile], 'source')}
                        >
                          {copiedSection === 'source' ? '✓ Copied' : 'Copy Code'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
                        <code>{contract.sources[activeSourceFile]}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="abi" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">Contract ABI</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(contract.abi, null, 2), 'abi')}
                >
                  {copiedSection === 'abi' ? '✓ Copied' : 'Copy ABI'}
                </Button>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs text-zinc-300">
                  <code>{JSON.stringify(contract.abi, null, 2)}</code>
                </pre>
              </div>
            </div>
          </TabsContent>

          {contract.constructor_arguments && (
            <TabsContent value="constructor" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Constructor Arguments</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(contract.constructor_arguments, 'constructor')}
                  >
                    {copiedSection === 'constructor' ? '✓ Copied' : 'Copy Args'}
                  </Button>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <code className="text-xs text-zinc-300 break-all">
                    {contract.constructor_arguments}
                  </code>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Library Info */}
        {contract.library_info && Object.keys(contract.library_info).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Library Information</h4>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <pre className="text-xs text-zinc-300">
                <code>{JSON.stringify(contract.library_info, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {data.meta && (
          <div className="pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">
              Retrieved: {new Date(data.meta.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}