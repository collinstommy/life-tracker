import type { score, todo, activity } from "./schema";
import { Database } from "bun:sqlite";
import { drizzle, BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export type Todo = typeof todo.$inferSelect;

export type Score = typeof score.$inferSelect;
export type ScorePayload = typeof score.$inferInsert;

export type Activity = typeof activity.$inferSelect;
export type ActivityPayload = typeof activity.$inferInsert;

const sqlite = new Database("db.sqlite");

export const db: BunSQLiteDatabase = drizzle(sqlite);
