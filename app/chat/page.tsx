"use client";

import { useState, useEffect } from "react";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { ConnectButton } from "@/components/ConnectButton";

export default function Page() {
  const [id] = useState(() => generateUUID());
  const [chatModel, setChatModel] = useState(DEFAULT_CHAT_MODEL);
  const { isConnected, isLoading } = useWalletAuth();

  useEffect(() => {
    // Get chat model from cookie on client side
    const cookies = document.cookie.split(';');
    const chatModelCookie = cookies.find(cookie => 
      cookie.trim().startsWith('chat-model=')
    );
    
    if (chatModelCookie) {
      const modelValue = chatModelCookie.split('=')[1];
      setChatModel(modelValue);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-primary/30 animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-primary">VeChain AI Terminal</p>
          <p className="text-sm text-muted-foreground">Initializing AI systems...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 terminal-bg">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-theme-orange mb-4 vechain-glow">
            Welcome to VeChain AI Terminal
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Your AI co-pilot for the VeChain blockchain. Connect your wallet to get started and explore the power of VeChain with intelligent assistance.
          </p>
          <ConnectButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl">
          <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-theme-orange">Blockchain Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Get insights into transactions, blocks, and network statistics with real-time data
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-theme-orange">Smart Contract Tools</h3>
            <p className="text-sm text-muted-foreground">
              Verify contracts, analyze code, and interact with deployed contracts seamlessly
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-theme-orange">Token & NFT Management</h3>
            <p className="text-sm text-muted-foreground">
              Track balances, transfers, and manage your digital assets with ease
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      initialChatModel={chatModel}
      initialVisibilityType="private"
      isReadonly={false}
      autoResume={false}
    />
  );
}
