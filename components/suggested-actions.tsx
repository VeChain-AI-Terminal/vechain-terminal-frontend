"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Show me the best yield options",
      label: "for staking CORE across different protocols",
      action:
        "Show me the best yield options for staking CORE across different protocols",
    },
    {
      title: "What are the top staking methods",
      label: "for maximizing yield on Core blockchain?",
      action:
        "What are the top staking methods for maximizing yield on Core blockchain?",
    },
    {
      title: "Compare APYs",
      label: "across Core blockchain staking options",
      action: "Compare APYs across Core blockchain staking options",
    },
    {
      title: "What is the best option",
      label: "for 1-click staking with the highest yield?",
      action:
        "What is the best option for 1-click staking with the highest yield?",
    },
    {
      title: "Help me find the best staking method",
      label: "based on my risk and reward preferences",
      action:
        "Help me find the best staking method based on my risk and reward preferences",
    },
    {
      title: "What are the best DeFi options",
      label: "for Core blockchain with cross-protocol integration?",
      action:
        "What are the best DeFi options for Core blockchain with cross-protocol integration?",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, "", `/chat/${chatId}`);

              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  }
);
