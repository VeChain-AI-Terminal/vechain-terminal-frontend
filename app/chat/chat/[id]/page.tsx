"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { ConnectButton } from "@/components/ConnectButton";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isConnected, address } = useWalletAuth();

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  useEffect(() => {
    if (!params?.id || !isConnected || !address) return;

    async function fetchChatData() {
      try {
        setLoading(true);
        
        // Fetch chat details (this would need to be through an API route)
        const chatResponse = await fetch(`/api/chat/${params!.id}?wallet_address=${encodeURIComponent(address!)}`);
        if (!chatResponse.ok) {
          if (chatResponse.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch chat");
        }
        
        const chatData = await chatResponse.json();
        setChat(chatData);
        setMessages(chatData.messages || []);
      } catch (err) {
        console.error("Error fetching chat:", err);
        setError("Failed to load chat");
      } finally {
        setLoading(false);
      }
    }

    fetchChatData();
  }, [params?.id, isConnected, address]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Please connect your VeChain wallet to access this chat.
        </p>
        <ConnectButton />
      </div>
    );
  }

  if (loading) {
    return (
      <LoadingScreen message="VeChain AI Terminal" submessage="Loading chat session..." />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!chat) {
    notFound();
  }

  const isReadonly = chat.visibility === "private" && chat.userId !== user?.id;

  return (
    <Chat
      id={chat.id}
      initialMessages={messages}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType={chat.visibility}
      isReadonly={isReadonly}
      session={undefined}
      autoResume={true}
    />
  );
}
