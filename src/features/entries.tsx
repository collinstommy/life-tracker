import { FC } from "hono/jsx";
import { activity } from "../db/schema";
import { SmileIcon } from "../shared/Icons";

export const Entries: FC = () => {
  const entry = {
    date: "Today, October 2nd",
    time: "20:04",
    activities: ["zone 2", "yoga", "walk"],
  };

  return (
    <div class="flex flex-col items-center py-2">
      <a
        hx-boost="true"
        href="/new"
        class="flex rounded bg-black px-8 py-3 text-white"
      >
        Add Entry +
      </a>
      <ul class="grid w-full gap-3 py-4">
        {new Array(5).fill(undefined).map((_) => (
          <li class="flex rounded-md bg-white p-4 shadow-sm shadow-gray-200">
            <SmileIcon className="w-12" />
            <div class="px-3">
              <h2 class="text-sm uppercase text-gray-600">{entry.date}</h2>
              <ul class="flex gap-2 py-2">
                {entry.activities.map((activity) => (
                  <li class="flex items-center rounded-md bg-gray-300 px-2 text-sm">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
