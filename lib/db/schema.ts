import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: text("id").primaryKey().notNull(),
  address: text("address").notNull(),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  visibility: text("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable("Message", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable("Message_v2", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id),
  role: text("role").notNull(),
  parts: text("parts").notNull(),
  attachments: text("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;


export const stream = pgTable(
  "Stream",
  {
    id: text("id").primaryKey().notNull(),
    chatId: text("chatId").notNull().references(() => chat.id),
    createdAt: timestamp("createdAt").notNull(),
  }
);

export type Stream = InferSelectModel<typeof stream>;
