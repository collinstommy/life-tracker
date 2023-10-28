import { DrizzleD1Database } from "drizzle-orm/d1";
import { User } from "./db";
import { Context } from "hono";

type Bindings = {
  DB: D1Database;
  GOOGLE_SECRET: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
};

export type AppContext<T extends string = ""> = Context<HonoApp, T>;

export type HonoApp = {
  Bindings: Bindings;
  Variables: {
    db: DrizzleD1Database;
    user: User;
  };
};
