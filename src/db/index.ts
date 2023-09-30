import type { score, todo, activity } from "./schema";

export type Todo = typeof todo.$inferSelect;

export type Score = typeof score.$inferSelect;
export type ScorePayload = typeof score.$inferInsert;

export type Activity = typeof activity.$inferSelect;
export type ActivityPayload = typeof activity.$inferInsert;
