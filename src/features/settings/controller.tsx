import { and, eq } from "drizzle-orm";
import { activitySettingsTable, categoryTable } from "../../db/schema";
import { Card } from "../../shared/Card";
import { Layout } from "../../shared/Layout";
import { AppContext } from "../../types";
import {
  ActivityList,
  CategoryList,
  CreateActivityForm,
  CreateCategoryForm,
} from "./components";
import { CATEGORY_PATH } from "./routes";

export async function settingsListView(c: AppContext) {
  return c.html(
    <Layout>
      <a href="/settings/categories">Activities Categories</a>
    </Layout>,
  );
}

export async function categoriesListView(c: AppContext) {
  const userId = c.get("user").id;
  const categories = await c.var.db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.userId, userId));

  return c.html(
    <Layout>
      <div class="flex flex-col gap-2 py-4">
        <CategoryList categories={categories} />
        <CreateCategoryForm />
      </div>
    </Layout>,
  );
}

export async function activitySettingsListView(
  c: AppContext<"/settings/categories/:id">,
) {
  const categoryId = c.req.param("id");
  const activities = await c.var.db
    .select()
    .from(activitySettingsTable)
    .where(eq(activitySettingsTable.categoryId, +categoryId));

  // ToDo: check if user owns category
  return c.html(
    <Layout>
      <div class="flex flex-col gap-2 py-4">
        <ActivityList activities={activities} categoryId={categoryId} />
        <CreateActivityForm categoryId={categoryId} />
      </div>
    </Layout>,
  );
}

export async function createCategory(c: AppContext<typeof CATEGORY_PATH>) {
  const { db } = c.var;
  const userId = c.get("user").id;

  const { activityGroup } = await c.req.parseBody<{ activityGroup: string }>();
  await db.insert(categoryTable).values({ label: activityGroup, userId });
  const categories = await c.var.db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.userId, userId));

  return c.html(<CategoryList categories={categories} />);
}

export async function deleteCategory(
  c: AppContext<`/settings/categories/:id`>,
) {
  const { db } = c.var;
  const userId = c.get("user").id;
  const id = c.req.param("id");

  await db.delete(categoryTable).where(eq(categoryTable.id, +id));

  const categories = await c.var.db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.userId, userId));

  return c.html(<CategoryList categories={categories} />);
}

export async function createActivity(
  c: AppContext<"/settings/categories/:id/activities">,
) {
  const { db } = c.var;
  const categoryId = c.req.param("id");

  const { value } = await c.req.parseBody<{ value: string }>();
  await db
    .insert(activitySettingsTable)
    .values({ value, categoryId: +categoryId });

  // ToDo: check if user owns category
  const activities = await c.var.db
    .select()
    .from(activitySettingsTable)
    .where(eq(activitySettingsTable.categoryId, +categoryId));

  return c.html(
    <ActivityList activities={activities} categoryId={categoryId} />,
  );
}

export async function deleteActivity(
  c: AppContext<"/settings/categories/:categoryId/activities/:activityId">,
) {
  const { db } = c.var;
  const activityId = c.req.param("activityId");
  const categoryId = c.req.param("categoryId");

  await db
    .delete(activitySettingsTable)
    .where(eq(activitySettingsTable.id, +activityId));

  const activities = await c.var.db
    .select()
    .from(activitySettingsTable)
    .where(eq(activitySettingsTable.categoryId, +categoryId));

  return c.html(
    <ActivityList activities={activities} categoryId={categoryId} />,
  );
}
