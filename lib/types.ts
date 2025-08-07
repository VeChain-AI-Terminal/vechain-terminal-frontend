import { z } from "zod";
import type { getChainContext } from "./ai/tools/getChainContext";
import type { getValidators } from "./ai/tools/getValidators";
import type { nebulaTool } from "./ai/tools/nebulaTool";
import type { makeTransaction } from "./ai/tools/makeTransaction";
import type { InferUITool, UIMessage } from "ai";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type getChainContextTool = InferUITool<typeof getChainContext>;
type getValidatorsTool = InferUITool<typeof getValidators>;
type nebulaToolTool = InferUITool<typeof nebulaTool>;
type makeTransactionTool = InferUITool<typeof makeTransaction>;

export type ChatTools = {
  getChainContext: getChainContextTool;
  getValidators: getValidatorsTool;
  nebulaTool: nebulaToolTool;
  makeTransaction: makeTransactionTool;
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
