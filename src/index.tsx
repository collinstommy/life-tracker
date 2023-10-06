import { Layout } from "./shared/Layout";
// import { ScoreApp, scoreApi } from "./features/score";
// import { ActivityApp, activityApi } from "./features/activity";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { getCurrentDate } from "./lib/date";
import { Entries } from "./features/entries";
import { CreateEntry, createEntryApi } from "./features/createEntry";
import { app } from "./app";

app.use("*", async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);
  await next();
});

const generateApp = async (db: DrizzleD1Database, date: string) => {
  // const scores = await ScoreApp(db, date);
  // const activities = await ActivityApp(db, date);

  return (
    <Layout>
      <input name="currentDate" value={date} hidden />
      {/* <DayList current={date} /> */}
      {/* {scores} */}
      {/* {activities} */}
      <Entries />
    </Layout>
  );
};

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const app = await generateApp(db, getCurrentDate());
  return c.html(app);
});

app.get("/new", async (c) => {
  return c.html(
    <Layout>
      <CreateEntry />
    </Layout>,
  );
});

app.get("/day/:date", async (c) => {
  const db = drizzle(c.env.DB);
  const date = c.req.param("date");
  const app = await generateApp(db, date);
  return c.html(app);
});

// app.route("/", todoApi);
// app.route("/", scoreApi);
app.route("/", createEntryApi);

export default app;
