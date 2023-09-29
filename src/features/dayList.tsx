import { FC } from "hono/jsx";
import { getPreviousDaysList, toDayOfWeek } from "../lib/date";
import clsx from "clsx";

export const DayList: FC<{ current: string }> = ({ current }) => {
  const dayList = getPreviousDaysList(7);
  return (
    <div class="pb-12">
      <div class="space-y-4 py-4">
        <div class="px-3 py-2">
          <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
            This Week
          </h2>
          <div class="space-y-1">
            {dayList.map((day) => (
              <div class="flex flex-col">
                <a
                  href={`/day/${day}`}
                  class={clsx(
                    "flex w-full justify-start",
                    current === day && "bg-black text-white",
                  )}
                >
                  {toDayOfWeek(day)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
