import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entryTable = sqliteTable("entry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  userId: text("user_id").notNull(),
  mood: integer("mood").notNull(),
});

export const activityTable = sqliteTable("activity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  value: text("value").notNull(),
  userId: text("user_id").notNull(),
  createdOn: text("created_on").notNull(),
  entryId: integer("entry_id")
    .notNull()
    .references(() => entryTable.id),
});

/*
how to handle remove activities from an existing entry
- get all items that were not checked and batch delete by id?
- use check boxes or buttons?
*/
