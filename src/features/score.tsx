import { FC } from "hono/jsx";
import { FrownIcon, MehIcon, SmileIcon } from "../shared/Icons";
import { Hono } from "hono";
import { score } from "../db/schema";
import { getCurrentDateTime } from "../lib/date";
import { sql, and, eq } from "drizzle-orm";
import { HonoApp } from "../types";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";

const IconButton: FC<{
  selected?: boolean;
  value: number;
  formId: string;
  type: string;
}> = ({ selected, value, children, formId, type }) => {
  const vals = JSON.stringify({ value, type });

  return (
    <button
      class={`${selected ? "text-black" : "text-gray-400"}`}
      hx-include="[name='currentDate']"
      hx-put="/score"
      hx-vals={vals}
      hx-target={`#${formId}`}
    >
      {children}
    </button>
  );
};

const Score: FC<{
  selectedValue?: number;
  formId: string;
  type: string;
  heading: string;
}> = ({ selectedValue, formId, type, heading }) => {
  return (
    <div id={formId}>
      <h2 class="py-1 text-2xl font-semibold">{heading}</h2>
      <form class="flex gap-2">
        <IconButton
          value={1}
          selected={selectedValue === 1}
          formId={formId}
          type={type}
        >
          <FrownIcon />
        </IconButton>
        <IconButton
          value={2}
          selected={selectedValue === 2}
          formId={formId}
          type={type}
        >
          <MehIcon />
        </IconButton>
        <IconButton
          value={3}
          selected={selectedValue === 3}
          formId={formId}
          type={type}
        >
          <SmileIcon />
        </IconButton>
      </form>
    </div>
  );
};

type ScoreType = "mood" | "sleep";

const ScoreSection: FC<{
  selectedValue?: number;
  type: ScoreType;
}> = ({ selectedValue, type }) => {
  if (type === "sleep") {
    return (
      <Score
        selectedValue={selectedValue}
        formId="sleep-form"
        type={"sleep"}
        heading={"Sleep"}
      />
    );
  }
  return (
    <Score
      selectedValue={selectedValue}
      formId="mood-form"
      type={"mood"}
      heading={"Mood"}
    />
  );
};

export const ScoreApp = async (db: DrizzleD1Database, currentDate: string) => {
  const scores = await getScoresByUser(db, currentDate, "1");
  function getValue(scoreType: ScoreType) {
    const match = scores?.find(({ type }) => type === scoreType);
    return match?.quality;
  }

  return (
    <section>
      <ScoreSection type="sleep" selectedValue={getValue("sleep")} />
      <ScoreSection type="mood" selectedValue={getValue("mood")} />
    </section>
  );
};

export const scoreApi = new Hono<HonoApp>();

export type ScoresByUser = Awaited<ReturnType<typeof getScoresByUser>>;

export async function getScoresByUser(
  db: DrizzleD1Database,
  date: string,
  userId: string,
) {
  const scores = await db
    .select({
      type: score.type,
      quality: score.quality,
      date: score.date,
      createdOn: sql<string>`max(${score.createdOn})`,
    })
    .from(score)
    .where(and(eq(score.userId, userId), eq(score.date, date)))
    .groupBy(score.type);
  return scores;
}

scoreApi.put("/score", async (c) => {
  const body = await c.req.parseBody<{
    currentDate: string;
    value: string;
    type: ScoreType;
  }>();

  const value = +body.value;
  const db = drizzle(c.env.DB);

  await db.insert(score).values({
    userId: "1",
    quality: +value,
    date: body.currentDate,
    type: body.type,
    createdOn: getCurrentDateTime(),
  });

  return c.html(<ScoreSection selectedValue={+body.value} type={body.type} />);
});
