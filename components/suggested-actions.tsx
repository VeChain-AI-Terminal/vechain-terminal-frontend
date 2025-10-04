"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { toast } from "sonner";
import { useWallet } from "@vechain/vechain-kit";

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
  const { account, connection } = useWallet();

  const suggestedActions = [
    {
      title: "Best yield-generating opportunity for my CORE",
      label: "find the most rewarding strategy",
      action: "What is the best yield-generating opportunity for my CORE?",
    },
    {
      title: "Highest APYs right now across protocols",
      label: "to make your tokens work for you",
      action: "List the highest APYs available right now across protocols.",
    },

    {
      title: "Swap all my USDC to CORE",
      label: "instant 1-click swap",
      action: "Swap all my USDC to CORE",
    },
    {
      title: "What is dual staking?",
      label: "learn all about CORE",
      action: "Explain how dual staking works in Core blockchain",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="block"
        >
          <Button
            variant="ghost"
            onClick={async (e) => {
              e.preventDefault();
              if (!connection.isConnected) {
                toast.error("Please connect your wallet to send a message");
                return;
              }

              window.history.replaceState({}, "", `/chat/${chatId}`);

              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex flex-col gap-1 w-full h-auto justify-start items-start"
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
