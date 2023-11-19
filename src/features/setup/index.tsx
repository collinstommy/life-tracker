import { DrizzleD1Database } from "drizzle-orm/d1";
import { categories } from "../../constants/categories";
import { activitySettingsTable, categoryTable } from "../../db/schema";
import { HonoApp } from "../../types";
import { Hono } from "hono";

export const setupApp = new Hono<HonoApp>();

async function addCategory(
  db: DrizzleD1Database,
  userId: number,
  category: (typeof categories)[number],
) {
  const createdCategory = await db
    .insert(categoryTable)
    .values({
      label: category.name,
      userId,
    })
    .returning();

  await db.insert(activitySettingsTable).values(
    category.options.map((activity) => ({
      value: activity,
      categoryId: createdCategory[0].id,
    })),
  );
}

setupApp.get("/setup", async (c) => {
  const user = c.get("user");
  if (!user.isSetup) {
    const db = c.get("db");
    const updates = categories.map((category) =>
      addCategory(db, user.id, category),
    );
    await Promise.all(updates);
  }
  return c.redirect("/");
});
