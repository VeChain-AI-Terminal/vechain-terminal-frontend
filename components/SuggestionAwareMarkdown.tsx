"use client";
import React from "react";
import { Markdown } from "@/components/markdown";
import { SuggestionPills } from "@/components/suggestion-pills";

const SUGGESTION_RE = /:suggestion\[(.+?)\]/g;

function InlineMD({ children }: { children: string }) {
  // Force Markdown output to be inline
  return (
    <span
      className="
      [&_p]:inline [&_p]:m-0
      [&_ul]:inline [&_ol]:inline
      [&_li]:inline [&_li]:list-none
      [&_pre]:inline
      [&_h1]:inline [&_h2]:inline [&_h3]:inline
      [&_blockquote]:inline
    "
    >
      <Markdown>{children}</Markdown>
    </span>
  );
}

export function SuggestionAwareMarkdown({
  text,
  onSend,
}: {
  text: string;
  onSend: (label: string) => void;
}) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = SUGGESTION_RE.exec(text)) !== null) {
    if (m.index > lastIndex) {
      // trim a trailing comma right before the token
      let chunk = text.slice(lastIndex, m.index).replace(/,\s*$/u, " ");
      if (chunk)
        parts.push(<InlineMD key={`md-${lastIndex}`}>{chunk}</InlineMD>);
    }

    const label = m[1];
    parts.push(
      <SuggestionPills key={`s-${m.index}`} label={label} onSend={onSend} />
    );

    lastIndex = SUGGESTION_RE.lastIndex;

    // eat a comma right after the token
    if (text[lastIndex] === ",") {
      lastIndex += 1;
      while (text[lastIndex] === " ") lastIndex += 1;
      SUGGESTION_RE.lastIndex = lastIndex;
    }
  }

  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);
    if (tail.trim()) parts.push(<InlineMD key="md-tail">{tail}</InlineMD>);
  }

  // Inline layout for everything
  return <div className="flex flex-wrap items-center gap-2">{parts}</div>;
}
