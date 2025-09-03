// components/SuggestionPills.tsx
"use client";
import { SparklesIcon } from "@/components/icons";
import { ChatMessage } from "@/lib/types";
import { UseChatHelpers } from "@ai-sdk/react";
import React from "react";

export function SuggestionPills({
  label,
  sendMessage,
}: {
  label: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}) {
  return (
    <button
      onClick={() => {
        sendMessage({
          role: "user",
          parts: [{ type: "text", text: label }],
        });
      }}
      className=""
    >
      <div className="inline-flex items-center rounded-lg px-3 py-1 text-sm border border-neutral-700/50  hover:bg-neutral-900 mx-1 font-semibold gap-2 mt-2">
        <SparklesIcon size={12} color="fff" />
        <span>{label}</span>
      </div>
    </button>
  );
}
