import { AppContext } from "../../types";
import {
  activitySettingsTable,
  activityTable,
  categoryTable,
  entryTable,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentDateTime, toDayOfWeek } from "../../lib/date";
import { Entry, FoodList } from "./components";
import { Layout } from "../../shared/Layout";
import { DrizzleD1Database } from "drizzle-orm/d1";

async function getSettings(userId: number, db: DrizzleD1Database) {
  const settings = await db
    .select({
      categoryId: categoryTable.id,
      label: categoryTable.label,
      value: activitySettingsTable.value,
    })
    .from(categoryTable)
    .where(eq(categoryTable.userId, userId))
    .leftJoin(
      activitySettingsTable,
      eq(categoryTable.id, activitySettingsTable.categoryId),
    );

  const settingsMap = new Map<string, string[]>();
  settings.forEach((setting) => {
    const existing = settingsMap.get(setting.label);
    if (existing && setting.value) {
      settingsMap.set(setting.label, [...existing, setting.value]);
    } else if (setting.value) {
      settingsMap.set(setting.label, [setting.value]);
    }
  });

  // todo: fix this horrific type
  return [...settingsMap] as [string, string[]][];
}

export async function newEntryView(c: AppContext) {
  const settings = await getSettings(c.var.user.id, c.var.db);
  return c.html(
    <Layout>
      <Entry categories={settings} />
    </Layout>,
  );
}

export async function editEntryView(c: AppContext<":entryId">) {
  const entryId = c.req.param("entryId");
  const entries = await c
    .get("db")
    .select({
      mood: entryTable.mood,
      date: entryTable.date,
      value: activityTable.value,
      type: activityTable.type,
    })
    .from(entryTable)
    .leftJoin(activityTable, eq(entryTable.id, activityTable.entryId))
    .where(
      and(eq(entryTable.id, +entryId), eq(entryTable.userId, c.get("user").id)),
    );

  const { mood, date } = entries[0];
  const activities = entries.map(({ value }) => value).filter(Boolean);
  const settings = await getSettings(c.var.user.id, c.var.db);
  const foodData = entries.filter((activity) => activity.type === "food");
  const foodItems = foodData
    .map(({ value }) => value)
    .filter(Boolean) as string[];

  return c.html(
    <Layout>
      <Entry
        categories={settings}
        mood={mood}
        date={date}
        activities={activities}
        foodItems={foodItems}
        entryId={+entryId}
      />
    </Layout>,
  );
}

// partials
export async function createEntry(c: AppContext) {
  const user = c.get("user");
  const settings = await getSettings(c.var.user.id, c.var.db);
  const { date, mood, foodItem, foodList, ...rest } = await c.req.parseBody<{
    date: string;
    mood: string;
    entryId?: string;
    foodItem?: string;
    foodList?: string;
  }>();

  // Todo - fix this - add activity type to the markup
  const activities = Object.keys(rest);

  const foodItems = foodList ? foodList.split(",") : [];
  console.log(foodItems, foodList);
  // ToDo: use oob swap for errors
  if (!mood) {
    return c.html(
      <Entry
        categories={settings}
        activities={activities}
        date={date}
        errors={["mood"]}
      />,
    );
  }

  await c.var.db.transaction(async (tx) => {
    const createdEntry = await tx
      .insert(entryTable)
      .values({
        date,
        mood: +mood,
        userId: user.id,
      })
      .returning();

    const metadata = {
      createdOn: getCurrentDateTime(),
      userId: user.id,
      date,
      entryId: createdEntry[0].id,
    };

    if (activities.length) {
      await tx.insert(activityTable).values(
        activities.map((activity) => ({
          value: activity,
          ...metadata,
        })),
      );

      await tx.insert(activityTable).values(
        foodItems.map((food) => ({
          value: food,
          type: "food",
          ...metadata,
        })),
      );
    }
  });
  c.header("HX-Location", "/");
  return c.body(null);
}

export async function updateEntry(c: AppContext) {
  const user = c.get("user");
  const { date, mood, entryId, ...rest } = await c.req.parseBody<{
    date: string;
    mood: string;
    entryId: string;
    foodItem?: string;
    foodList?: string;
  }>();

  delete rest.foodItem;
  delete rest.foodList;

  // ToDo: share with delete
  const entry = await c.var.db
    .select({ userId: entryTable.userId })
    .from(entryTable)
    .where(and(eq(entryTable.id, +entryId)));

  if (entry[0]?.userId !== user.id) {
    c.status(401);
    return c.body(null);
  }

  const activities = Object.keys(rest);

  await c.var.db.transaction(async (tx) => {
    await tx
      .update(entryTable)
      .set({
        date,
        mood: +mood,
      })
      .where(eq(entryTable.id, +entryId));

    const metadata = {
      createdOn: getCurrentDateTime(),
      userId: user.id,
      date,
      entryId: +entryId,
    };

    await tx.delete(activityTable).where(eq(activityTable.entryId, +entryId));

    if (activities.length) {
      await tx.insert(activityTable).values(
        activities.map((activity) => ({
          value: activity,
          ...metadata,
        })),
      );
    }
  });
  c.header("HX-Location", "/");
  return c.body(null);
}

export async function deleteEntry(c: AppContext<"/entry/:entryId">) {
  const user = c.get("user");
  const entryId = c.req.param("entryId");
  const entry = await c.var.db
    .select({ userId: entryTable.userId })
    .from(entryTable)
    .where(eq(entryTable.id, +entryId));

  if (entry[0]?.userId !== user.id) {
    c.status(401);
    return c.body(null);
  }

  await c.var.db
    .delete(activityTable)
    .where(and(eq(activityTable.entryId, +entryId)));

  await c.var.db.delete(entryTable).where(and(eq(entryTable.id, +entryId)));

  c.header("HX-Location", "/");
  return c.body(null);
}

//partials
export function validateMood(c: AppContext) {
  return c.body(null);
}

export async function parseDate(c: AppContext) {
  const body = await c.req.parseBody<{
    date: string;
  }>();
  return c.html(toDayOfWeek(body.date));
}

export async function addFoodItem(c: AppContext) {
  const { foodList, foodItem } = await c.req.parseBody<{
    foodList: string;
    foodItem: string;
  }>();
  const existing = foodList ? foodList.split(",") : [];
  return c.html(<FoodList foodList={[...existing, foodItem]} />);
}

export async function removeFoodItem(c: AppContext) {
  const { foodList, ...rest } = await c.req.parseBody<{
    foodList: string;
  }>();
  const existing = foodList ? foodList.split(",") : [];
  const keys = Object.keys(rest);
  const toRemove = keys.length ? keys[0] : "";
  const newItems = existing.filter((food) => food !== toRemove);
  return c.html(<FoodList foodList={newItems} />);
}
