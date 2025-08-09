"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";

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
  const { address, isConnected, caipAddress } = useAppKitAccount();

  const suggestedActions = [
    {
      title: "Highest yield options for CORE staking?",
      label: "for maximizing yield on Core blockchain",
      action: "Find me the highest CORE staking yields available on Core.",
    },
    {
      title: "Show my portfolio",
      label: "for checking your portfolio",
      action: "Give me a breakdown of my portfolio",
    },
    {
      title: "What is dual staking?",
      label: "for earning more rewards",
      action: "Explain how dual staking works in Core blockchain",
    },
    {
      title: "Send CORE tokens",
      label: "for 1-click transactions",
      action: "Send core tokens",
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
            onClick={async (e) => {
              e.preventDefault();
              if (!isConnected) {
                toast.error("Please connect your wallet to send a message");
                return;
              }

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
