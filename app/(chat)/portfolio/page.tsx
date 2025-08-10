import { ChatHeader } from "@/components/chat-header";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <div className="p-5">hello</div>
    </div>
  );
}
