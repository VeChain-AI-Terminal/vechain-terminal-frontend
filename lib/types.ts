import { z } from "zod";
import type { InferUITool, UIMessage } from "ai";

import type { getValidators } from "./ai/tools/coreStakeActions/getValidators";
import type { coreDaoTool } from "./ai/tools/coreDaoTool";
import type { makeTransaction } from "./ai/tools/makeTransaction";
import type { makeStakeCoreTransaction } from "./ai/tools/coreStakeActions/makeStakeCoreTransaction";
import type { getDelegatedCoreForEachValidator } from "./ai/tools/coreStakeActions/getDelegatedCoreForEachValidator";
import type { getClaimedAndPendingRewards } from "./ai/tools/coreStakeActions/getClaimedAndPendingRewards";
import type { makeUnDelegateCoreTransaction } from "./ai/tools/coreStakeActions/makeUnDelegateCoreTransaction";
import type { makeClaimRewardsTransaction } from "./ai/tools/coreStakeActions/makeClaimRewardsTransaction";
import type { makeTransferStakedCoreTransaction } from "./ai/tools/coreStakeActions/makeTransferStakedCoreTransaction";
import type { getPortfolio } from "./ai/tools/getPortfolio";
import type { ensToAddress } from "./ai/tools/ensToAddress";
import type { getUserWalletInfo } from "./ai/tools/getUserWalletInfo";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type getValidatorsTool = InferUITool<typeof getValidators>;
type coreDaoToolType = InferUITool<typeof coreDaoTool>;
type makeTransactionTool = InferUITool<typeof makeTransaction>;
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
  coreDaoTool: coreDaoToolType;
  makeTransaction: makeTransactionTool;
  getPortfolio: getPortfolioTool;
  makeStakeCoreTransaction: makeStakeTransactionTool;
  getDelegatedCoreForEachValidator: getDelegatedCoreForEachValidatorTool;
  getClaimedAndPendingRewards: getClaimedAndPendingRewardsTool;
  makeUnDelegateCoreTransaction: makeUnDelegateCoreTransactionTool;
  makeClaimRewardsTransaction: makeClaimRewardsTransactionTool;
  makeTransferStakedCoreTransaction: makeTransferStakedCoreTransactionTool;
  ensToAddress: ensToAddressTool;
  getUserWalletInfo: getUserWalletInfoTool;
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
