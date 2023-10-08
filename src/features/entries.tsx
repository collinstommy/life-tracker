import { DrizzleD1Database } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { toDayOfWeek } from "../lib/date";
import { moodList } from "../constants/mood";

type Entry = {
  id: number;
  date: string;
  mood: number;
  activities: string[];
};

const renderEntryCard = (entry: Entry | undefined) => {
  if (!entry) return null;
  const Icon = moodList.find((mood) => mood.value === entry.mood)?.Icon;

  return (
    <li class="group flex justify-between rounded-md bg-white p-4 shadow-sm shadow-gray-200">
      <div class=" flex gap-3">
        <div>{Icon && <Icon className="w-14" />}</div>
        <div class="flex flex-col">
          <h2 class="text-sm uppercase text-gray-500">
            {toDayOfWeek(entry.date)}
          </h2>
          <ul class="flex flex-wrap gap-2 py-2">
            {entry.activities.map((activity) => (
              <li class="flex  items-center rounded-md bg-gray-300 px-2 text-sm">
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export const Entries = async (db: DrizzleD1Database) => {
  const statement = sql`
    SELECT * FROM entry
    LEFT JOIN activity
    ON entry.id = activity.entry_id
    WHERE entry.user_id = '1';
  `;

  type Row = {
    entry_id: number;
    category: string;
    value: string;
    date: string;
    mood: number;
  };

  const rows = await db.all<Row>(statement);
  const entryIds = Array.from(new Set(rows.map(({ entry_id }) => entry_id)));

  const entryMap = new Map<number, Entry>();
  rows.forEach((row) => {
    if (entryMap.has(row.entry_id)) {
      const existing = entryMap.get(row.entry_id)!;
      entryMap.set(row.entry_id, {
        ...existing,
        activities: [...existing.activities, row.value],
      });
    } else {
      entryMap.set(row.entry_id, {
        date: row.date,
        id: row.entry_id,
        mood: row.mood,
        activities: [row.value],
      });
    }
  });

  return (
    <div class="flex flex-col py-2">
      <a
        hx-boost="true"
        href="/new"
        class="rounded bg-black px-8 py-2 text-center text-white"
      >
        Add Entry +
      </a>
      <ul class="grid w-full gap-3 py-4">
        {entryIds.map((entryId) => renderEntryCard(entryMap.get(entryId)))}
      </ul>
    </div>
  );
};
