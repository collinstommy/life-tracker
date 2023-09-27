import { Hono } from "hono";
import { Layout } from "./shared/Layout";
import { Todo, todoApi } from "./features/todo";
import { ScoreApp, getScoresByUser, scoreApi } from "./features/score";
import { getCurrentDate } from "./lib/date";
import { ActivitySection, activityApi, getActivitiesByUser } from "./features/activity";
import { HonoApp } from './types';
import { drizzle } from 'drizzle-orm/d1';

const app = new Hono<HonoApp>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const scores = await getScoresByUser(db, getCurrentDate(), "1");
  const activities = await getActivitiesByUser(db, getCurrentDate(), "1");
  const selectedActivities = activities.map(({ value}) => value)
  return c.html(
    <Layout>
      <Todo />
      <ScoreApp scores={scores} />
      <ActivitySection selected={selectedActivities} />
    </Layout>,
  );
});

app.route("/", todoApi);
app.route("/", scoreApi);
app.route("/", activityApi);

export default app;
