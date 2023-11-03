import { Card } from "../../shared/Card";
import { Layout } from "../../shared/Layout";
import { AppContext } from "../../types";

export async function getSettingsListView(c: AppContext) {
  const { db } = c.var;
  return c.html(
    <Layout>
      <a href="/settings/activities">Activities</a>
    </Layout>,
  );
}

export async function getActivitySettingsView(c: AppContext) {
  const { db } = c.var;
  return c.html(
    <Layout>
      <div class="flex flex-col gap-2 py-4">
        <Card>activities</Card>
        <Card>
          <label for="activity">Add new entry</label>
          <input name="activity" id="activity"></input>
          <button>Add</button>
        </Card>
      </div>
    </Layout>,
  );
}
