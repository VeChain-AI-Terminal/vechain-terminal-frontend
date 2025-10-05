import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Upload, FileText } from 'lucide-react';

interface ContractVerificationProps {
  onVerify: (data: any) => void;
}

export default function ContractVerification({ onVerify }: ContractVerificationProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [creationTxHash, setCreationTxHash] = useState('');
  const [stdJsonInput, setStdJsonInput] = useState('');
  const [compilerVersion, setCompilerVersion] = useState('');
  const [contractIdentifier, setContractIdentifier] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const jsonData = JSON.parse(content);
          setStdJsonInput(JSON.stringify(jsonData, null, 2));
          
          // Try to extract compiler version and contract identifier
          if (jsonData.settings?.compiler?.version) {
            setCompilerVersion(jsonData.settings.compiler.version);
          }
          
          // Extract contract identifier from sources
          if (jsonData.sources) {
            const sourceKeys = Object.keys(jsonData.sources);
            if (sourceKeys.length > 0) {
              const mainSource = sourceKeys[0];
              setContractIdentifier(`${mainSource}:Contract`);
            }
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: false,
  });

  const handleVerify = () => {
    const data = {
      address: contractAddress,
      stdJsonInput: JSON.parse(stdJsonInput),
      compilerVersion,
      contractIdentifier,
      creationTransactionHash: creationTxHash,
    };
    onVerify(data);
  };

  const isFormValid = contractAddress && creationTxHash && stdJsonInput && compilerVersion && contractIdentifier;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Verification
        </CardTitle>
        <CardDescription>
          Verify your smart contract source code on VeChain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json-upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json-upload">Upload JSON</TabsTrigger>
            <TabsTrigger value="manual-input">Manual Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json-upload" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contract-address">Contract Address</Label>
                <Input
                  id="contract-address"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="creation-tx">Creation Transaction Hash</Label>
                <Input
                  id="creation-tx"
                  placeholder="0x..."
                  value={creationTxHash}
                  onChange={(e) => setCreationTxHash(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Standard JSON Input</Label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {uploadedFile ? (
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        ✓ {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        File uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Drop your standard JSON input file here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to browse (.json files only)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {stdJsonInput && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="compiler-version">Compiler Version</Label>
                      <Input
                        id="compiler-version"
                        placeholder="0.8.7+commit.e28d00a7"
                        value={compilerVersion}
                        onChange={(e) => setCompilerVersion(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contract-identifier">Contract Identifier</Label>
                      <Input
                        id="contract-identifier"
                        placeholder="contracts/MyContract.sol:MyContract"
                        value={contractIdentifier}
                        onChange={(e) => setContractIdentifier(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manual-input" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-contract-address">Contract Address</Label>
                <Input
                  id="manual-contract-address"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="manual-creation-tx">Creation Transaction Hash</Label>
                <Input
                  id="manual-creation-tx"
                  placeholder="0x..."
                  value={creationTxHash}
                  onChange={(e) => setCreationTxHash(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="manual-compiler-version">Compiler Version</Label>
                <Input
                  id="manual-compiler-version"
                  placeholder="0.8.7+commit.e28d00a7"
                  value={compilerVersion}
                  onChange={(e) => setCompilerVersion(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="manual-contract-identifier">Contract Identifier</Label>
                <Input
                  id="manual-contract-identifier"
                  placeholder="contracts/MyContract.sol:MyContract"
                  value={contractIdentifier}
                  onChange={(e) => setContractIdentifier(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="manual-std-json">Standard JSON Input</Label>
                <Textarea
                  id="manual-std-json"
                  placeholder="Paste your standard JSON input here..."
                  value={stdJsonInput}
                  onChange={(e) => setStdJsonInput(e.target.value)}
                  className="min-h-40 font-mono text-xs"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Ensure all fields are filled correctly before verification</span>
          </div>
          <Button 
            onClick={handleVerify} 
            disabled={!isFormValid}
            className="px-6"
          >
            Verify Contract
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}