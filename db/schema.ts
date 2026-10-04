import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
export const entries = sqliteTable("entries", {
  userId: text("user_id").notNull(), date: text("date").notNull(),
  content: text("content").notNull(), metrics: text("metrics").notNull().default("{}"),
  revision: integer("revision").notNull().default(1), updatedAt: text("updated_at").notNull(),
}, t=>[primaryKey({columns:[t.userId,t.date]})]);

export const profiles = sqliteTable("profiles", {userId:text("user_id").primaryKey(),nickname:text("nickname").notNull()});
