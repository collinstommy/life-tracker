import { DrizzleD1Database } from "drizzle-orm/d1";

type Bindings = {
  DB: D1Database;
};

export type HonoApp = {
  Bindings: Bindings;
  Variables: {
    db: DrizzleD1Database;
  };
};
