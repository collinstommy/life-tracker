import { Hono } from "hono";
import { Layout } from "./shared/Layout";
import { todoApi } from "./features/todo";
import { ScoreApp, scoreApi } from "./features/score";
import { ActivityApp, activityApi } from "./features/activity";
import { HonoApp } from "./types";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { DayList } from "./features/dayList";
import { getCurrentDate } from "./lib/date";
import { auth } from "./features/auth";

const app = new Hono<HonoApp>();
app.use("*", auth);

const generateApp = async (db: DrizzleD1Database, date: string) => {
  const scores = await ScoreApp(db, date);
  const activities = await ActivityApp(db, date);

  return (
    <Layout>
      <input name="currentDate" value={date} hidden />
      <DayList current={date} />
      {/* <Todo /> */}
      {scores}
      {activities}
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

app.route("/", todoApi);
app.route("/", scoreApi);
app.route("/", activityApi);

export default app;
