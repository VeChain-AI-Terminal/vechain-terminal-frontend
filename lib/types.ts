import { z } from "zod";
import type { InferUITool, UIMessage } from "ai";

import type { getValidators } from "./ai/tools/coreStakeActions/getValidators";
import type { makeSendTransaction } from "./ai/tools/makeSendTransaction";
import type { makeStakeCoreTransaction } from "./ai/tools/coreStakeActions/makeStakeCoreTransaction";
import type { getDelegatedCoreForEachValidator } from "./ai/tools/coreStakeActions/getDelegatedCoreForEachValidator";
import type { getClaimedAndPendingRewards } from "./ai/tools/coreStakeActions/getClaimedAndPendingRewards";
import type { makeUnDelegateCoreTransaction } from "./ai/tools/coreStakeActions/makeUnDelegateCoreTransaction";
import type { makeClaimRewardsTransaction } from "./ai/tools/coreStakeActions/makeClaimRewardsTransaction";
import type { makeTransferStakedCoreTransaction } from "./ai/tools/coreStakeActions/makeTransferStakedCoreTransaction";
import type { getPortfolio } from "./ai/tools/getPortfolio";
import type { ensToAddress } from "./ai/tools/ensToAddress";
import type { getUserWalletInfo } from "./ai/tools/getUserWalletInfo";
import type { getColendStats } from "./ai/tools/colend/get-colend-stats";
import type { colendSupplyCore } from "./ai/tools/colend/colendSupplyCore";
import type { colendSupplyErc20 } from "./ai/tools/colend/colendSupplyErc20";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type getValidatorsTool = InferUITool<typeof getValidators>;
type getColendStatsTool = InferUITool<typeof getColendStats>;
type colendSupplyCoreTool = InferUITool<typeof colendSupplyCore>;
type colendSupplyErc20Tool = InferUITool<typeof colendSupplyErc20>;
type makeSendTransactionTool = InferUITool<typeof makeSendTransaction>;
type getPortfolioTool = InferUITool<typeof getPortfolio>;
type makeStakeTransactionTool = InferUITool<typeof makeStakeCoreTransaction>;
type getDelegatedCoreForEachValidatorTool = InferUITool<
  typeof getDelegatedCoreForEachValidator
>;
type getClaimedAndPendingRewardsTool = InferUITool<
  typeof getClaimedAndPendingRewards
>;
type makeUnDelegateCoreTransactionTool = InferUITool<
  typeof makeUnDelegateCoreTransaction
>;
type makeClaimRewardsTransactionTool = InferUITool<
  typeof makeClaimRewardsTransaction
>;
type makeTransferStakedCoreTransactionTool = InferUITool<
  typeof makeTransferStakedCoreTransaction
>;
type ensToAddressTool = InferUITool<typeof ensToAddress>;
type getUserWalletInfoTool = InferUITool<typeof getUserWalletInfo>;

export type ChatTools = {
  getValidators: getValidatorsTool;
  makeSendTransaction: makeSendTransactionTool;
  getPortfolio: getPortfolioTool;
  makeStakeCoreTransaction: makeStakeTransactionTool;
  getDelegatedCoreForEachValidator: getDelegatedCoreForEachValidatorTool;
  getClaimedAndPendingRewards: getClaimedAndPendingRewardsTool;
  makeUnDelegateCoreTransaction: makeUnDelegateCoreTransactionTool;
  makeClaimRewardsTransaction: makeClaimRewardsTransactionTool;
  makeTransferStakedCoreTransaction: makeTransferStakedCoreTransactionTool;
  ensToAddress: ensToAddressTool;
  getUserWalletInfo: getUserWalletInfoTool;
  getColendStats: getColendStatsTool;
  colendSupplyCore: colendSupplyCoreTool;
  colendSupplyErc20: colendSupplyErc20Tool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  appendMessage: string;
  id: string;
  title: string;
  clear: null;
  finish: null;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
