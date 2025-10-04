import type { InferSelectModel } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("User", {
  id: text("id").primaryKey().notNull(),
  address: text("address").notNull(),
});

export type User = InferSelectModel<typeof user>;

export const chat = sqliteTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
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
export const messageDeprecated = sqliteTable("Message", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id),
  role: text("role").notNull(),
  content: text("content", { mode: "json" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = sqliteTable("Message_v2", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id),
  role: text("role").notNull(),
  parts: text("parts", { mode: "json" }).notNull(),
  attachments: text("attachments", { mode: "json" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;


export const stream = sqliteTable(
  "Stream",
  {
    id: text("id").primaryKey().notNull(),
    chatId: text("chatId").notNull().references(() => chat.id),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  }
);

export type Stream = InferSelectModel<typeof stream>;
