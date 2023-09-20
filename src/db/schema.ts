import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// sleep, mood
export const score = sqliteTable(
  "score",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    quality: integer("quality").notNull(),
    date: text("date"),
    userId: text("userId"),
    type: text("type"),
    createdOn: text("created_on"),
  },
  (table) => ({
    userIdx: index("userId_score_idx").on(table.userId),
    type: index("type_idx").on(table.type),
    date: index("date_idx").on(table.date),
  }),
);

export const todo = sqliteTable(
  "todo",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    complete: integer("complete"),
    text: text("text"),
    userId: text("userId"),
  },
  (table) => ({
    userIdx: index("userId_idx").on(table.userId),
  }),
);

export const activity = sqliteTable(
  "activity",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    value: text("value"),
    userId: text("userId"),
    date: text("date"),
    createdOn: text("created_on"),
  },
  (table) => ({
    userIdx: index("userId_activity_idx").on(table.userId),
    date: index("date_activity_idx").on(table.date),
  }),
);
