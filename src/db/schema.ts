import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entryTable = sqliteTable("entry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  userId: integer("user_id").notNull(),
  mood: integer("mood").notNull(),
});

export const activityTable = sqliteTable("activity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  value: text("value").notNull(),
  userId: integer("user_id").notNull(),
  createdOn: text("created_on").notNull(),
  entryId: integer("entry_id")
    .notNull()
    .references(() => entryTable.id),
});

export const userTable = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  googleId: text("google_sub"),
});

/* ToDo
- indices
*/
