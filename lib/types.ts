import { z } from "zod";
import type { getChainContext } from "./ai/tools/getChainContext";
import type { getValidators } from "./ai/tools/getValidators";
import type { coreDaoTool } from "./ai/tools/coreDaoTool";
import type { makeTransaction } from "./ai/tools/makeTransaction";
import type { ensToAddress } from "./ai/tools/ensToAddress";
import type { InferUITool, UIMessage } from "ai";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type getChainContextTool = InferUITool<typeof getChainContext>;
type getValidatorsTool = InferUITool<typeof getValidators>;
type coreDaoToolType = InferUITool<typeof coreDaoTool>;
type makeTransactionTool = InferUITool<typeof makeTransaction>;
type ensToAddressTool = InferUITool<typeof ensToAddress>;

export type ChatTools = {
  getChainContext: getChainContextTool;
  getValidators: getValidatorsTool;
  coreDaoTool: coreDaoToolType;
  makeTransaction: makeTransactionTool;
  ensToAddress: ensToAddressTool;
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
