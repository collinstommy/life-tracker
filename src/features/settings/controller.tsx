import { and, eq } from "drizzle-orm";
import { activitySettingsTable, categoryTable } from "../../db/schema";
import { Card } from "../../shared/Card";
import { Layout } from "../../shared/Layout";
import { AppContext } from "../../types";
import {
  ActivityCard,
  ActivityList,
  CategoryCard,
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

  const { label } = await c.req.parseBody<{ label: string }>();
  const category = await db
    .insert(categoryTable)
    .values({ label, userId })
    .returning();

  return c.html(<CategoryCard id={category[0].id} label={label} />);
}

export async function deleteCategory(
  c: AppContext<`/settings/categories/:id`>,
) {
  const { db } = c.var;
  const userId = c.get("user").id;
  const id = c.req.param("id");

  // check for user ownership
  await db
    .delete(activitySettingsTable)
    .where(eq(activitySettingsTable.categoryId, +id));
  await db.delete(categoryTable).where(eq(categoryTable.id, +id));

  return c.body(null);
}

export async function createActivity(
  c: AppContext<"/settings/categories/:id/activities">,
) {
  const { db } = c.var;
  const categoryId = c.req.param("id");
  const { value } = await c.req.parseBody<{ value: string }>();

  // ToDo: check if user owns category

  // todo: insert after last activity
  const created = await db
    .insert(activitySettingsTable)
    .values({ value, categoryId: +categoryId })
    .returning();

  return c.html(
    <ActivityCard id={created[0].id} categoryId={categoryId} value={value} />,
  );
}

export async function deleteActivity(
  c: AppContext<"/settings/categories/:categoryId/activities/:activityId">,
) {
  const { db } = c.var;
  const activityId = c.req.param("activityId");

  await db
    .delete(activitySettingsTable)
    .where(eq(activitySettingsTable.id, +activityId));

  return c.body(null);
}
