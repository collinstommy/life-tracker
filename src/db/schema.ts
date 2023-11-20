import { sql } from "drizzle-orm";
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
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  createdOn: text("created_on").default(sql`CURRENT_DATE`),
  entryId: integer("entry_id")
    .notNull()
    .references(() => entryTable.id),
  type: text("a_type"),
});

export const userTable = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  googleId: text("google_sub"),
  isSetup: integer("is_setup").default(0),
});

export const activitySettingsTable = sqliteTable("activitySettings", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  value: text("value").notNull(),
  createdOn: text("created_on").default(sql`CURRENT_DATE`),
  categoryId: integer("category_id").references(() => categoryTable.id),
});

export const categoryTable = sqliteTable("category", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  createdOn: text("created_on").default(sql`CURRENT_DATE`),
});

/* ToDo
- indices
*/
