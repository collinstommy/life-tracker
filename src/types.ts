import { DrizzleD1Database } from "drizzle-orm/d1";
import { User } from "./db";

type Bindings = {
  DB: D1Database;
  GOOGLE_SECRET: string;
  JWT_SECRET: string;
};

export type HonoApp = {
  Bindings: Bindings;
  Variables: {
    db: DrizzleD1Database;
    user: User;
  };
};
