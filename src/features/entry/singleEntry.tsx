import { FC } from "hono/jsx";
import { HonoApp } from "../../types";
import { Hono } from "hono";
import {
  getCurrentDate,
  getCurrentDateTime,
  toDayOfWeek,
} from "../../lib/date";
import { activityTable, entryTable } from "../../db/schema";
import { categories } from "../../constants/categories";
import { Layout } from "../../shared/Layout";
import { moodList } from "../../constants/mood";
import { and, eq } from "drizzle-orm";
import { BackIcon, DeleteIcon } from "../../shared/Icons";

export const entryApi = new Hono<HonoApp>();

const IconButton: FC<{
  value: number;
  selected?: boolean;
}> = ({ selected, children, value }) => {
  return (
    <div class="h-10 w-10">
      <input
        hx-get="/validate/mood"
        hx-target="#error-mood"
        type="radio"
        name="mood"
        id={value}
        class="peer hidden"
        value={value}
        checked={selected}
        required
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

export const Entry: FC<{
  mood?: number;
  date?: string;
  activities?: (string | null)[];
  entryId?: number;
  errors?: string[];
}> = ({
  mood,
  date = getCurrentDate(),
  activities = [],
  entryId,
  errors = [],
}) => {
  return (
    <form class="group flex flex-col gap-6 py-4">
      {entryId && <input hidden name="entryId" value={entryId} />}
      <div class="flex flex-col gap-2 rounded-md bg-white p-4 shadow-sm shadow-gray-200">
        <label data-hx="date" id="current-date" class="font-bold">
          {toDayOfWeek(date)}
        </label>
        <input
          type="date"
          id="current-date"
          name="date"
          hx-post="/new/get-date"
          hx-target='[data-hx="date"]'
          class="border px-2 py-1 invalid:border-red-600"
          value={date}
          required
        />
      </div>
      <ul class="flex flex-col gap-4">
        <li class="flex flex-col rounded-md bg-white px-4 py-4 shadow-sm shadow-gray-200 ">
          <h2 class="font-semibold">Mood</h2>
          <ul class="flex justify-center gap-4 pt-3">
            {moodList.map(({ value, Icon }) => (
              <li>
                <IconButton selected={mood === value} value={value}>
                  <Icon />
                </IconButton>
              </li>
            ))}
          </ul>
          {errors.includes("mood") && (
            <p id="error-mood" class="py-1 text-red-500">
              Please select your mood.
            </p>
          )}
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
                    checked={activities.includes(option)}
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
      {entryId ? (
        <div class="flex w-full gap-2">
          <a
            href="/"
            class="rounded bg-black px-6 py-2 text-center text-white "
          >
            <BackIcon className="w-6" />
          </a>
          <button
            hx-put="/entry"
            hx-swap="none"
            hx-validate="true"
            class="flex-1 rounded bg-black px-8 py-2 text-center text-white group-invalid:bg-gray-400"
          >
            Update
          </button>
          <button
            hx-delete={`/entry/${entryId}`}
            hx-swap="none"
            hx-confirm="Are you sure you want to delete this entry?"
            class="rounded bg-black px-6 text-center text-white"
          >
            <DeleteIcon className="w-6" />
          </button>
        </div>
      ) : (
        <div class="flex w-full gap-2">
          <a
            href="/"
            class="rounded bg-black px-6 py-2 text-center text-white "
          >
            <BackIcon className="w-6" />
          </a>
          <button
            hx-target="form"
            hx-post="/entry"
            hx-swap="outerHTML"
            hx-validate="true"
            class="flex-1 rounded bg-black px-8 py-2 text-center text-white group-invalid:bg-gray-400"
          >
            Save
          </button>
        </div>
      )}
    </form>
  );
};

entryApi.get("/edit/:entryId", async (c) => {
  const entryId = c.req.param("entryId");
  const entries = await c
    .get("db")
    .select({
      mood: entryTable.mood,
      date: entryTable.date,
      value: activityTable.value,
    })
    .from(entryTable)
    .leftJoin(activityTable, eq(entryTable.id, activityTable.entryId))
    .where(and(eq(entryTable.id, +entryId), eq(entryTable.userId, "1")));

  const { mood, date } = entries[0];
  const activities = entries.map(({ value }) => value).filter(Boolean);

  return c.html(
    <Layout>
      <Entry
        mood={mood}
        date={date}
        activities={activities}
        entryId={+entryId}
      />
    </Layout>,
  );
});

entryApi.get("/new", async (c) => {
  return c.html(
    <Layout>
      <Entry />
    </Layout>,
  );
});

entryApi.get("/validate/mood", (c) => {
  return c.body(null);
});

entryApi.post("/new/get-date", async (c) => {
  const body = await c.req.parseBody<{
    date: string;
  }>();
  return c.html(toDayOfWeek(body.date));
});

entryApi.delete("/entry/:entryId", async (c) => {
  const entryId = c.req.param("entryId");
  const entry = await c
    .get("db")
    .select({ userId: entryTable.userId })
    .from(entryTable)
    .where(eq(entryTable.id, +entryId));

  if (entry[0]?.userId !== "1") {
    c.status(401);
    return c.body(null);
  }

  await c
    .get("db")
    .delete(activityTable)
    .where(and(eq(activityTable.entryId, +entryId)));

  await c
    .get("db")
    .delete(entryTable)
    .where(and(eq(entryTable.id, +entryId)));

  c.header("HX-Location", "/");
  return c.body(null);
});

entryApi.post("/entry", async (c) => {
  const { date, mood, ...rest } = await c.req.parseBody<{
    date: string;
    mood: string;
    entryId?: string;
  }>();
  const activities = Object.keys(rest);

  if (!mood) {
    return c.html(
      <Entry activities={activities} date={date} errors={["mood"]} />,
    );
  }

  await c.var.db.transaction(async (tx) => {
    const createdEntry = await tx
      .insert(entryTable)
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
});

entryApi.put("/entry", async (c) => {
  const { date, mood, entryId, ...rest } = await c.req.parseBody<{
    date: string;
    mood: string;
    entryId: string;
  }>();

  // ToDo: share between with delete
  const entry = await c
    .get("db")
    .select({ userId: entryTable.userId })
    .from(entryTable)
    .where(eq(entryTable.id, +entryId));

  if (entry[0]?.userId !== "1") {
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
      userId: "1",
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
});
