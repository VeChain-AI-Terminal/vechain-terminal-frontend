"use client";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import type { Vote } from "@/lib/db/schema";
import { PencilEditIcon, SparklesIcon } from "./icons";
import { Markdown } from "./markdown";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";

import TransactionComponent, {
  TransactionComponentProps,
} from "@/components/TransactionComponent";
import ToolCallLoader from "@/components/tool-call-loader";
import { SuggestionAwareMarkdown } from "@/components/SuggestionAwareMarkdown";
import { InfoIcon } from "lucide-react";

// VeChain Card Components
import VETVTHOBalance from "@/components/vechain-portfolio/VETVTHOBalance";
import AccountStats from "@/components/vechain-portfolio/AccountStats";
import TokenList from "@/components/vechain-tokens/TokenList";
import NFTList from "@/components/vechain-nfts/NFTList";
import NetworkStats from "@/components/vechain-network/NetworkStats";
import TransactionInfo from "@/components/vechain-transactions/TransactionInfo";
import ContractInfo from "@/components/vechain-contracts/ContractInfo";
import AddressEmission from "@/components/vechain-carbon/AddressEmission";
import BlockEmission from "@/components/vechain-carbon/BlockEmission";
import TransactionEmission from "@/components/vechain-carbon/TransactionEmission";
import NetworkEmission from "@/components/vechain-carbon/NetworkEmission";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  sendMessage,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];

  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file"
  );

  useDataStream();

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} color="#fc8d36" />
              </div>
            </div>
          )}
          {message.role === "system" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <InfoIcon size={20} color="white" />
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-4 w-full  overflow-clip break-words whitespace-normal",
              {
                "min-h-96":
                  message.role === "assistant" && requiresScrollPadding,
              }
            )}
          >
            {attachmentsFromMessage.length > 0 && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {attachmentsFromMessage.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={{
                      name: attachment.filename ?? "file",
                      contentType: attachment.mediaType,
                      url: attachment.url,
                    }}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning" && part.text?.trim().length > 0) {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.text}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start ">
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <SuggestionAwareMarkdown
                          text={sanitizeText(part.text)}
                          sendMessage={sendMessage}
                        />
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  );
                }
              }

              if (type === "tool-getUserWalletInfo") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting your wallet info..." />
                    </div>
                  );
                }
              }

              if (type === "tool-makeSendTransaction") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Making transaction..." />
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const {
                    from,
                    receiver_address,
                    receiver_ensName,
                    value,
                    network,
                    clauses,
                  } = output as TransactionComponentProps;
                  return (
                    <TransactionComponent
                      from={from}
                      receiver_address={receiver_address}
                      receiver_ensName={receiver_ensName}
                      value={value}
                      network={network}
                      clauses={clauses}
                      key={toolCallId}
                    />
                  );
                }
              }

              // VeChain Portfolio Tools
              if (type === "tool-getVETVTHOBalance") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting VET/VTHO balance..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <VETVTHOBalance
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              if (type === "tool-getAccountStats") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting account statistics..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <AccountStats
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              // VeChain Token Tools
              if (type === "tool-getTokenList") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting token list..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <TokenList
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              // VeChain NFT Tools
              if (type === "tool-getNFTList") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting NFT collections..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <NFTList
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              // VeChain Network Tools
              if (type === "tool-getNetworkStats") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting network statistics..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <NetworkStats
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              // VeChain Transaction Tools
              if (type === "tool-getTransactionInfo") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting transaction details..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <TransactionInfo
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              // VeChain Contract Tools
              if (type === "tool-getContractInfo") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting contract information..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <ContractInfo
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              // VeChain Carbon Emission Tools
              if (type === "tool-getAddressEmission") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting carbon emissions for address..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <AddressEmission
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              if (type === "tool-getBlockEmission") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting block carbon emissions..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <BlockEmission
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              if (type === "tool-getTransactionEmission") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting transaction carbon emissions..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <TransactionEmission
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

              if (type === "tool-getNetworkEmission") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting network carbon emissions..." />
                    </div>
                  );
                }
                if (state === "output-available") {
                  const { output } = part;
                  return (
                    <NetworkEmission
                      key={toolCallId}
                      data={output}
                      isLoading={false}
                    />
                  );
                }
              }

            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return false;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
