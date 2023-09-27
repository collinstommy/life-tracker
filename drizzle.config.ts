import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/4d478301-53a8-45c3-afc4-e5b41a8831d5/db.sqlite",
  },
} satisfies Config;
