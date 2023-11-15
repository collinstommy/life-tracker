import type {
  activitySettingsTable,
  activityTable,
  categoryTable,
  entryTable,
  userTable,
} from "./schema";

export type Activity = typeof activityTable.$inferSelect;
export type ActivityPayload = typeof activityTable.$inferInsert;

export type Entry = typeof entryTable.$inferSelect;
export type EntryPayload = typeof entryTable.$inferInsert;

export type User = typeof userTable.$inferSelect;

export type Category = typeof categoryTable.$inferSelect;

export type ActivitySetting = typeof activitySettingsTable.$inferSelect;
