import { Layout } from "./shared/Layout";
// import { ScoreApp, scoreApi } from "./features/score";
// import { ActivityApp, activityApi } from "./features/activity";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { getCurrentDate } from "./lib/date";
import { Entries } from "./features/entry/entries";
import { entryApi } from "./features/entry/singleEntry";
import { app } from "./app";

app.use("*", async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);
  await next();
});

const generateApp = async (db: DrizzleD1Database, date: string) => {
  // const scores = await ScoreApp(db, date);
  // const scores = await ScoreApp(db, date);
  const entries = await Entries(db);

  return (
    <Layout>
      <input name="currentDate" value={date} hidden />
      {/* <DayList current={date} /> */}
      {/* {scores} */}
      {/* {activities} */}
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

// app.route("/", todoApi);
// app.route("/", scoreApi);
app.route("/", entryApi);

export default app;
