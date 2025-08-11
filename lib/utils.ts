import type {
  CoreAssistantMessage,
  CoreToolMessage,
  UIMessage,
  UIMessagePart,
} from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DBMessage } from "@/lib/db/schema";
import { ChatSDKError, type ErrorCode } from "./errors";
import type { ChatMessage, ChatTools, CustomUIDataTypes } from "./types";
import { formatISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatSDKError(code as ErrorCode, cause);
  }

  return response.json();
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ChatSDKError("offline:chat");
    }

    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function sanitizeText(text: string) {
  return text.replace("<has_function_call>", "");
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

/**
 * Convert a big integer string with `decimals` to a human string without losing precision.
 * Example: toUnit("2000000000000000000", 18) -> "2"
 */
export const toUnit = (value: string | undefined, decimals = 18): string => {
  const v = (value ?? "0").replace(/^0+/, "") || "0";
  if (v === "0") return "0";
  if (decimals === 0) return v;

  const pad = Math.max(decimals - v.length + 1, 0);
  const whole = v.length > decimals ? v.slice(0, v.length - decimals) : "0";
  const frac =
    (pad ? "0".repeat(pad) : "") +
    (v.length > decimals ? v.slice(v.length - decimals) : v);

  // remove trailing zeros in fractional part
  const fracTrimmed = frac.replace(/0+$/, "");
  return fracTrimmed ? `${whole}.${fracTrimmed}` : whole;
};

export const addStrNums = (a: string, b: string): string => {
  // add two decimal strings safely
  const [ai, af = ""] = a.split(".");
  const [bi, bf = ""] = b.split(".");
  const maxF = Math.max(af.length, bf.length);
  const A = ai + (af + "0".repeat(maxF - af.length));
  const B = bi + (bf + "0".repeat(maxF - bf.length));

  // big integer string add
  let carry = 0,
    res = "";
  for (
    let i = A.length - 1, j = B.length - 1;
    i >= 0 || j >= 0 || carry;
    i--, j--
  ) {
    const da = i >= 0 ? Number(A[i]) : 0;
    const db = j >= 0 ? Number(B[j]) : 0;
    const sum = da + db + carry;
    res = String(sum % 10) + res;
    carry = Math.floor(sum / 10);
  }
  // insert decimal point
  if (maxF > 0) {
    const head = res.slice(0, res.length - maxF) || "0";
    let tail = res.slice(res.length - maxF);
    tail = tail.replace(/0+$/, "");
    return tail ? `${head}.${tail}` : head;
  }
  return res;
};
