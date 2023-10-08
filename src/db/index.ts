import type { activity, entry } from "./schema";

export type Activity = typeof activity.$inferSelect;
export type ActivityPayload = typeof activity.$inferInsert;

export type Entry = typeof entry.$inferSelect;
export type EntryPayload = typeof entry.$inferInsert;
