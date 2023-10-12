import type { activityTable, entryTable } from "./schema";

export type Activity = typeof activityTable.$inferSelect;
export type ActivityPayload = typeof activityTable.$inferInsert;

export type Entry = typeof entryTable.$inferSelect;
export type EntryPayload = typeof entryTable.$inferInsert;
