import { Layout } from "./shared/Layout";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { getCurrentDate } from "./lib/date";
import { Entries } from "./features/entry/entries";
import { entryApi } from "./features/entry/singleEntry";
import { app } from "./app";
import { Login, authApi } from "./features/auth/login";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

app.use("*", async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);

  const userToken = getCookie(c, "user");

  if (userToken) {
    const user = await verify(userToken, c.env.JWT_SECRET);
    c.set("user", user);
  }
  await next();
});

app.get("/test", async (c) => {
  console.log(c.get("user"));

  return c.body(null);
});

const generateApp = async (db: DrizzleD1Database, date: string) => {
  const entries = await Entries(db);

  return (
    <Layout>
      <input name="currentDate" value={date} hidden />
      {entries}
    </Layout>
  );
};

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const app = await generateApp(db, getCurrentDate());

  return c.html(app);
});

app.get("/day/:date", async (c) => {
  const db = drizzle(c.env.DB);
  const date = c.req.param("date");
  const app = await generateApp(db, date);
  return c.html(app);
});

app.get("/login", (c) => {
  return c.html(<Login />);
});

app.route("/", entryApi);
app.route("/", authApi);

export default app;
