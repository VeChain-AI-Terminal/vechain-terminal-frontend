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
import StakeComponent from "@/components/stake-actions-components/StakeComponent";
import { PortfolioDataType } from "@/lib/types/portfolio-data";
import PortfolioTable from "@/components/PortfolioTable";
import { PortfolioData } from "@/lib/ai/tools/getPortfolio";
import { StakeComponentProps } from "@/lib/ai/tools/coreStakeActions/makeStakeCoreTransaction";
import { getDelegatedCoreForEachValidator } from "@/lib/ai/tools/coreStakeActions/getDelegatedCoreForEachValidator";
import { getClaimedAndPendingRewards } from "@/lib/ai/tools/coreStakeActions/getClaimedAndPendingRewards";
import UnDelegateComponent from "@/components/stake-actions-components/UnDelegateComponent";
import TransferComponent from "@/components/stake-actions-components/TransferComponent";
import { TransferStakedCoreTransactionProps } from "@/lib/ai/tools/coreStakeActions/makeTransferStakedCoreTransaction";
import ClaimRewardsComponent from "@/components/stake-actions-components/ClaimRewards";
import ColendSupplyCore from "@/components/colend/colend-supply-core";
import { ColendSupplyCoreTxProps } from "@/lib/ai/tools/colend/colendSupplyCore";
import { ColendSupplyErc20TxProps } from "@/lib/ai/tools/colend/colendSupplyErc20";
import ColendSupplyErc20 from "@/components/colend/colent-supply-erc20";
import ColendTable from "@/components/colend/colend-stats-table";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
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

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
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
                    <div key={key} className="flex flex-row gap-2 items-start">
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
                        <Markdown>{sanitizeText(part.text)}</Markdown>
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
                    <div key={toolCallId} className="skeleton">
                      <p>Getting your wallet info...</p>
                    </div>
                  );
                }
              }

              if (type === "tool-makeSendTransaction") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making transaction...</p>
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
                    chainId,
                  } = output as TransactionComponentProps;
                  return (
                    <TransactionComponent
                      from={from}
                      receiver_address={receiver_address}
                      receiver_ensName={receiver_ensName}
                      value={value}
                      chainId={chainId}
                      key={toolCallId}
                    />
                  );
                }
              }

              if (type === "tool-getPortfolio") {
                const { toolCallId, state } = part;

                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Fetching portfolio...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;

                  // Make sure output has the right shape
                  const {
                    chainId,
                    walletAddress,
                    fungibleTokens,
                    nfts,
                    totalPortfolioValueUSD,
                    stakingPortfolio,
                    totalStakedValue,
                    totalClaimedValue,
                    totalPendingValue,
                  } = output as PortfolioData;

                  return (
                    <PortfolioTable
                      key={toolCallId}
                      chainId={chainId ?? 0}
                      walletAddress={walletAddress ?? ""}
                      fungibleTokens={fungibleTokens ?? []}
                      nfts={nfts ?? []}
                      totalPortfolioValueUSD={totalPortfolioValueUSD ?? 0}
                      stakingPortfolio={stakingPortfolio}
                      totalStakedValue={totalStakedValue}
                      totalClaimedValue={totalClaimedValue}
                      totalPendingValue={totalPendingValue}
                    />
                  );
                }
              }

              if (type === "tool-makeStakeCoreTransaction") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making stake transaction...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const {
                    candidateAddress,
                    candidateName,
                    valueInWei,
                    chainId,
                  } = output as StakeComponentProps;
                  return (
                    <StakeComponent
                      candidateAddress={candidateAddress}
                      candidateName={candidateName}
                      valueInWei={valueInWei}
                      chainId={chainId}
                      key={toolCallId}
                    />
                  );
                }
              }

              if (type === "tool-makeUnDelegateCoreTransaction") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making un-delegate stake transaction...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const {
                    candidateAddress,
                    candidateName,
                    valueInWei,
                    chainId,
                  } = output as StakeComponentProps;
                  return (
                    <UnDelegateComponent
                      candidateAddress={candidateAddress}
                      candidateName={candidateName}
                      valueInWei={valueInWei}
                      chainId={chainId}
                      key={toolCallId}
                    />
                  );
                }
              }
              if (type === "tool-makeClaimRewardsTransaction") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making claim rewards transaction...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const {
                    candidateAddress,
                    candidateName,
                    valueInWei,
                    chainId,
                  } = output as StakeComponentProps;
                  return (
                    <ClaimRewardsComponent
                      candidateAddress={candidateAddress}
                      candidateName={candidateName}
                      valueInWei={valueInWei}
                      chainId={chainId}
                      key={toolCallId}
                    />
                  );
                }
              }

              if (type === "tool-makeTransferStakedCoreTransaction") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making transfer stake transaction...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const {
                    sourceCandidateAddress,
                    sourceCandidateName,
                    targetCandidateAddress,
                    targetCandidateName,
                    valueInWei,
                    chainId,
                  } = output as TransferStakedCoreTransactionProps;

                  return (
                    <TransferComponent
                      sourceCandidateAddress={sourceCandidateAddress}
                      sourceCandidateName={sourceCandidateName}
                      targetCandidateAddress={targetCandidateAddress}
                      targetCandidateName={targetCandidateName}
                      valueInWei={valueInWei}
                      chainId={chainId}
                      key={toolCallId}
                    />
                  );
                }
              }

              if (type === "tool-getValidators") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Getting validators...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;

                  return (
                    <div key={toolCallId}>
                      <p>Validators fetched</p>
                    </div>
                  );
                }
              }

              if (type === "tool-getDelegatedCoreForEachValidator") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Looking up your staked CORE across validators...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;

                  return (
                    <div key={toolCallId}>
                      <p>Done</p>
                    </div>
                  );
                }
              }
              if (type === "tool-getClaimedAndPendingRewards") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Looking up your rewards across validators...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;

                  return (
                    <div key={toolCallId}>
                      <p>Done</p>
                    </div>
                  );
                }
              }

              if (type === "tool-ensToAddress") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Getting address...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;

                  return (
                    <div key={toolCallId}>
                      <p>Address fetched</p>
                    </div>
                  );
                }
              }

              if (type === "tool-getColendStats") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Fetching defi stats from colend protocol...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part as any; // output.data is the array
                  return (
                    <ColendTable
                      key={toolCallId}
                      data={output.data.map((item: any) => ({
                        symbol: item.symbol,
                        poolMeta: item.poolMeta,
                        project: item.project,
                        tvlUsd: item.tvlUsd,
                        apy: item.apy,
                        apyBase: item.apyBase,
                        apyReward: item.apyReward,
                        apyMean30d: item.apyMean30d,
                        apyPct1D: item.apyPct1D,
                        apyPct7D: item.apyPct7D,
                      }))}
                    />
                  );
                }
              }

              if (type === "tool-colendSupplyCore") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making supply core transaction on colend...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const tx = output as ColendSupplyCoreTxProps; // from your supplyCore tool
                  // console.log(" ts in supply ---", tx);
                  return <ColendSupplyCore tx={tx} key={toolCallId} />;
                }
              }

              if (type === "tool-colendSupplyErc20") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId} className="skeleton">
                      <p>Making supply token transaction on colend...</p>
                    </div>
                  );
                }

                if (state === "output-available") {
                  const { output } = part;
                  const tx = output as ColendSupplyErc20TxProps; // from your supplyCore tool
                  // console.log(" ts in supply ---", tx);
                  return <ColendSupplyErc20 tx={tx} key={toolCallId} />;
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
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
