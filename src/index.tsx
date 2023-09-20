import { Hono } from "hono";
import { Layout } from "./shared/Layout";
import { Todo, todoApi } from "./features/todo";
import { ScoreApp, getScoresByUser, scoreApi } from "./features/score";
import { getCurrentDate } from "./lib/date";
import { ActivitySection, activityApi } from "./features/activity";

const app = new Hono();

app.get("/", async (c) => {
  const scores = await getScoresByUser(getCurrentDate(), "1");
  return c.html(
    <Layout>
      <Todo />
      <ScoreApp scores={scores} />
      <ActivitySection />
    </Layout>,
  );
});

app.route("/", todoApi);
app.route("/", scoreApi);
app.route("/", activityApi);

export default app;
