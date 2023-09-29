import { Hono } from "hono";
import { FC } from "hono/jsx";
import cn from "clsx";
import { activity } from "../db/schema";
import { getCurrentDateTime } from "../lib/date";
import { and, eq } from "drizzle-orm";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { HonoApp } from "../types";

const activities = [
  { id: "gaming", label: "Gaming" },
  { id: "indoor_spin", label: "Indoor Spin" },
  { id: "reading", label: "Reading" },
  { id: "work", label: "Work" },
  { id: "call_a_friend", label: "Call a friend" },
  { id: "meet_a_friend", label: "Meet a friend" },
  { id: "walk", label: "Walk" },
  { id: "gym", label: "Gym" },
  { id: "bike", label: "Bike" },
  { id: "side_project", label: "Side Project" },
  { id: "clean_house", label: "Clean House" },
  { id: "life_admin", label: "Life Admin" },
];

const items = new Set<string>();

const ActivityButton: FC<{
  isSelected: boolean;
  id: string;
}> = ({ isSelected, id }) => {
  const value = {
    id,
    isSelected,
  };
  const activity = activities.find((activity) => id === activity.id);

  return (
    <button
      hx-put="/activity"
      hx-vals={JSON.stringify(value)}
      hx-swap="outerHTML"
      hx-include="[name='currentDate']"
      class={cn(
        "rounded-full border border-2 px-4 py-2 hover:cursor-pointer hover:underline",
        {
          "text-gray-500": !isSelected,
          "bg-black text-white": isSelected,
        },
      )}
    >
      {activity?.label}
    </button>
  );
};

export async function getActivitiesByUser(
  db: DrizzleD1Database,
  date: string,
  userId: string,
) {
  const activities = await db
    .select({
      value: activity.value,
      date: activity.date,
    })
    .from(activity)
    .where(and(eq(activity.userId, userId), eq(activity.date, date)));

  return activities;
}

const ActivitySection: FC<{ selected: string[] }> = ({ selected = [] }) => {
  return (
    <section id="activity-list" class="py-3">
      <h2 class="py-1 text-2xl font-semibold">Activities</h2>
      <div class="flex flex-wrap gap-2 py-2">
        {activities.map(({ id }) => {
          const isSelected = selected.includes(id);
          return <ActivityButton isSelected={isSelected} id={id} />;
        })}
      </div>
    </section>
  );
};

export const ActivityApp = async (db: DrizzleD1Database, date: string) => {
  const activities = await getActivitiesByUser(db, date, "1");
  const selectedActivities = activities.map(({ value }) => value);
  return <ActivitySection selected={selectedActivities} />;
};

export const activityApi = new Hono<HonoApp>();

activityApi.put("/activity", async (c) => {
  const { id, isSelected, currentDate } = await c.req.parseBody<{
    id: string;
    isSelected: string;
    currentDate: string;
  }>();
  const db = drizzle(c.env.DB);
  const active = isSelected === "false";

  if (active) {
    items.add(id);
    await db.insert(activity).values({
      userId: "1",
      date: currentDate,
      value: id,
      createdOn: getCurrentDateTime(),
    });
  } else {
    items.delete(id);
    await db
      .delete(activity)
      .where(
        and(
          eq(activity.userId, "1"),
          eq(activity.date, currentDate),
          eq(activity.value, id),
        ),
      );
  }
  return c.html(<ActivityButton isSelected={active} id={id} />);
});
