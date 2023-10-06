import type { activity } from "./schema";

export type Activity = typeof activity.$inferSelect;
export type ActivityPayload = typeof activity.$inferInsert;
