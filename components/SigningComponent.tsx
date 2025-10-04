'use client';

import React, { useState, useCallback } from 'react';
import { useSignMessage, useSignTypedData, useWallet } from '@vechain/vechain-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Pen } from 'lucide-react';

export type SigningComponentProps = {
  messageType: "text" | "typedData";
  message?: string;
  typedData?: {
    domain: {
      name: string;
      version: string;
      chainId?: number;
    };
    types: Record<string, Array<{ name: string; type: string }>>;
    message: any;
    primaryType: string;
  };
  purpose: string;
  action: string;
  note: string;
};

const SigningComponent: React.FC<SigningComponentProps> = ({
  messageType,
  message,
  typedData,
  purpose,
  action,
  note,
}) => {
  const { account } = useWallet();
  const isConnected = !!account;
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    signMessage: signTextMessage,
    isSigningPending: isTextSignPending,
  } = useSignMessage();

  const {
    signTypedData: signStructuredData,
    isSigningPending: isTypedDataSignPending,
  } = useSignTypedData();

  const handleSignText = useCallback(async () => {
    if (!message || !isConnected || !account) {
      setError("Message or wallet not available");
      return;
    }

    try {
      setError(null);
      const result = await signTextMessage(message);
      setSignature(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    }
  }, [message, isConnected, account, signTextMessage]);

  const handleSignTypedData = useCallback(async () => {
    if (!typedData || !isConnected || !account) {
      setError("Typed data or wallet not available");
      return;
    }

    try {
      setError(null);
      const result = await signStructuredData(typedData, {
        signer: account.address
      });
      setSignature(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    }
  }, [typedData, isConnected, account, signStructuredData]);

  const isPending = isTextSignPending || isTypedDataSignPending;
  const isDisabled = !isConnected || isPending || !!signature;

  const shortenSignature = (sig: string) => {
    return `${sig.slice(0, 10)}...${sig.slice(-8)}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-zinc-900 border-zinc-700 max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Pen className="w-5 h-5 text-blue-400" />
              Message Signing
            </span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {messageType === "typedData" ? "Structured Data" : "Text Message"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Purpose */}
          <div className="p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm font-medium">Purpose</p>
            <p className="text-blue-300 text-sm">{purpose}</p>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-400">Message to Sign</p>
            <div className="bg-zinc-800 p-3 rounded-lg max-h-32 overflow-y-auto">
              {messageType === "text" ? (
                <p className="text-sm text-white font-mono">{message}</p>
              ) : (
                <pre className="text-xs text-white font-mono whitespace-pre-wrap">
                  {JSON.stringify(typedData, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="p-3 bg-amber-900/30 border border-amber-500/50 rounded-lg">
            <p className="text-amber-400 text-sm">{note}</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Signature Display */}
          {signature && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-sm font-medium">Message Signed Successfully</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">Signature:</p>
                <code className="text-xs text-green-300 font-mono break-all block">
                  {signature}
                </code>
                <p className="text-xs text-zinc-400">
                  Short: {shortenSignature(signature)}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={messageType === "text" ? handleSignText : handleSignTypedData}
            disabled={isDisabled}
            className="w-full"
            variant={signature ? "outline" : "default"}
          >
            {isPending && "Signing..."}
            {signature && "✓ Signed"}
            {!isPending && !signature && `Sign ${messageType === "typedData" ? "Structured Data" : "Message"}`}
          </Button>

          {/* Account Info */}
          {isConnected && account && (
            <div className="pt-2 border-t border-zinc-700">
              <p className="text-xs text-zinc-400">
                Signing with: {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SigningComponent;