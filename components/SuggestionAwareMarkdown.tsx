"use client";
import React from "react";
import { Markdown } from "@/components/markdown";
import { SuggestionPills } from "@/components/suggestion-pills";
import { UseChatHelpers } from "@ai-sdk/react";
import { ChatMessage } from "@/lib/types";

const SUGGESTION_RE = /:suggestion\[(.+?)\]/g;

export function SuggestionAwareMarkdown({
  text,
  sendMessage,
}: {
  text: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SUGGESTION_RE.exec(text)) !== null) {
    // push preceding text
    if (match.index > lastIndex) {
      const chunk = text.slice(lastIndex, match.index);
      if (chunk.trim()) {
        parts.push(<Markdown key={`md-${lastIndex}`}>{chunk}</Markdown>);
      }
    }

    // push pill
    const label = match[1];
    parts.push(
      <SuggestionPills
        key={`pill-${match.index}`}
        label={label}
        sendMessage={sendMessage}
      />
    );

    lastIndex = SUGGESTION_RE.lastIndex;
  }

  // push trailing text
  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);
    if (tail.trim()) {
      parts.push(<Markdown key="md-tail">{tail}</Markdown>);
    }
  }

  return <div>{parts}</div>;
}
