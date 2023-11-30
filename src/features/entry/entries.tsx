import { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { toDayOfWeek } from "../../lib/date";
import { moodList } from "../../constants/mood";
import { activityTable, entryTable } from "../../db/schema";
import { FC } from "hono/jsx";
import { SettingsIcon } from "../../shared/Icons";
import { FOOD_TYPE } from "../../constants/activities";

const EntryCard: FC<{
  id: number;
  date: string;
  mood: number;
  activities: string[];
}> = ({ mood, date, id, activities }) => {
  const { Icon, color } = moodList.find((m) => mood === m.value)!;
  return (
    <li>
      <a
        href={`/edit/${id}`}
        class="group flex cursor-pointer justify-between rounded-md bg-white p-4 shadow-sm shadow-gray-200 hover:cursor-pointer hover:outline"
      >
        <div class=" flex gap-3">
          <div>{Icon && <Icon className={`w-14 ${color}`} />}</div>
          <div class="flex flex-col">
            <h2 class="text-sm uppercase text-gray-500">{toDayOfWeek(date)}</h2>
            <ul class="flex flex-wrap gap-2 py-2">
              {activities.map((activity) => (
                <li class="flex  items-center rounded-md bg-gray-300 px-2 text-sm">
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </a>
    </li>
  );
};

export const Entries = async (db: DrizzleD1Database, userId: number) => {
  const rows = await db
    .select({
      id: entryTable.id,
      mood: entryTable.mood,
      date: entryTable.date,
      value: activityTable.value,
    })
    .from(entryTable)
    .leftJoin(activityTable, eq(entryTable.id, activityTable.entryId))
    .where(eq(entryTable.userId, userId));

  const entryIds = Array.from(new Set(rows.map(({ id }) => id)));

  return (
    <div class="flex flex-col py-2">
      <div class="flex gap-1">
        <a href="/new" class="btn flex w-full justify-center text-center">
          Add Entry +
        </a>
        <a class="btn" href="/settings/categories">
          <SettingsIcon className="w-6" />
        </a>
      </div>
      <ul class="grid w-full gap-3 py-4">
        {entryIds.map((entryId) => {
          const entry = rows.find((entry) => entry.id === entryId);

          const activities = rows
            .filter((row) => row.id === entryId)
            .map(({ value }) => value)
            .filter(Boolean)
            .filter((activity) => activity !== FOOD_TYPE);

          if (!entry) {
            return null;
          }

          return (
            <EntryCard
              id={entry.id}
              mood={entry.mood}
              date={entry.date}
              activities={activities as string[]}
            />
          );
        })}
      </ul>
    </div>
  );
};
