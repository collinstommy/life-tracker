import { Layout } from "./shared/Layout";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { getCurrentDate } from "./lib/date";
import { Entries } from "./features/entry/entries";
import { entryApi } from "./features/singleEntry.tsx/routes";
import { app } from "./app";
import { Login, authApi } from "./features/auth/login";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { settingsApp } from "./features/settings/routes";
import { serveStatic } from "hono/cloudflare-workers";
import { setupApp } from "./features/setup";

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Error", 500);
});

app.get("/static/*", serveStatic({ root: "./" }));

app.use("*", async (c, next) => {
  const isLoginRoute = c.req.path.includes("login");

  const userToken = getCookie(c, "user");
  if (userToken) {
    const user = await verify(userToken, c.env.JWT_SECRET);
    c.set("user", user);
  } else if (!isLoginRoute) {
    return c.redirect("/login");
  }

  const db = drizzle(c.env.DB);
  c.set("db", db);

  await next();
});

const generateApp = async (
  db: DrizzleD1Database,
  date: string,
  userId: number,
) => {
  const entries = await Entries(db, userId);

  return (
    <Layout>
      <input name="currentDate" value={date} hidden />
      {entries}
    </Layout>
  );
};

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const app = await generateApp(db, getCurrentDate(), c.get("user").id);

  return c.html(app);
});

app.get("/day/:date", async (c) => {
  const db = drizzle(c.env.DB);
  const date = c.req.param("date");
  const app = await generateApp(db, date, c.get("user").id);
  return c.html(app);
});

app.get("/login", (c) => {
  return c.html(<Login isLocal={c.env.ENV === "local"} />);
});

app.route("/", entryApi);
app.route("/", authApi);
app.route("/settings", settingsApp);
app.route("/", setupApp);

export default app;
