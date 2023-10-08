import { FC } from "hono/jsx";
import { HonoApp } from "../types";
import { Hono } from "hono";
import { getCurrentDateTime, toDayOfWeek } from "../lib/date";
import { activity, entry } from "../db/schema";
import { categories } from "../constants/categories";
import { Layout } from "../shared/Layout";
import { moodList } from "../constants/mood";

export const createEntryApi = new Hono<HonoApp>();

const IconButton: FC<{
  value: string;
  selected?: boolean;
}> = ({ selected, children, value }) => {
  return (
    <div class="h-10 w-10">
      <input
        type="radio"
        name="mood"
        id={value}
        class="peer hidden"
        value={value}
      />
      <label
        class=" text-gray-400 peer-checked:text-black"
        hx-include="[name='currentDate']"
        for={value}
      >
        {children}
      </label>
    </div>
  );
};

export const CreateEntry: FC = () => {
  const selectedValue = 1;
  return (
    <form class="group flex flex-col gap-6 py-4">
      <div class="flex flex-col gap-2 rounded-md bg-white p-4 shadow-sm shadow-gray-200">
        <label data-hx="date" id="current-date" class="font-bold">
          Today, October 2nd
        </label>
        <input
          type="date"
          id="current-date"
          name="date"
          hx-post="/new/get-date"
          hx-target='[data-hx="date"]'
          class="border px-2 py-1 invalid:border-red-600"
          required
        />
      </div>
      <ul class="flex flex-col gap-4">
        <li class="flex flex-col rounded-md bg-white px-4 py-4 shadow-sm shadow-gray-200">
          <h2 class="font-semibold">Mood</h2>
          <ul class="flex justify-center gap-4 pt-3">
            {moodList.map(({ value, Icon }) => (
              <li>
                <IconButton selected={selectedValue === value} value={value}>
                  <Icon />
                </IconButton>
              </li>
            ))}
          </ul>
        </li>
        {categories.map(({ name, options }) => (
          <li class="flex flex-col rounded-md bg-white px-4 py-4 shadow-sm shadow-gray-200">
            <h2 class="font-semibold">{name}</h2>
            <ul class="flex flex-wrap gap-2 pt-3">
              {options.map((option) => (
                <li>
                  <input
                    type="checkbox"
                    id={option}
                    name={option}
                    class="peer hidden"
                  />
                  <label
                    for={option}
                    class="flex items-center rounded-md bg-gray-300 px-3 py-1 text-sm peer-checked:bg-black peer-checked:text-white"
                  >
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button
        hx-post="/new"
        hx-swap="none"
        hx-validate="true"
        class="group-invalid:bg-yellow-400"
      >
        Save
      </button>
    </form>
  );
};

createEntryApi.get("/new", async (c) => {
  return c.html(
    <Layout>
      <CreateEntry />
    </Layout>,
  );
});

createEntryApi.post("/new/get-date", async (c) => {
  const body = await c.req.parseBody<{
    date: string;
  }>();
  return c.html(toDayOfWeek(body.date));
});

createEntryApi.post("/new", async (c) => {
  const { date, mood, ...rest } = await c.req.parseBody<{
    date: string;
    mood: string;
  }>();

  const activities = Object.keys(rest);

  await c.var.db.transaction(async (tx) => {
    const createdEntry = await tx
      .insert(entry)
      .values({
        date,
        mood: +mood,
        userId: "1",
      })
      .returning();

    const metadata = {
      createdOn: getCurrentDateTime(),
      userId: "1",
      date,
      entryId: createdEntry[0].id,
    };

    if (activities.length) {
      await tx.insert(activity).values(
        activities.map((activity) => ({
          value: activity,
          ...metadata,
        })),
      );
    }
  });
  c.header("HX-Location", "/");
  return c.body(null);
});
