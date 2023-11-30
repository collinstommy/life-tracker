import { FC } from "hono/jsx";
import { getCurrentDate, toDayOfWeek } from "../../lib/date";
import { moodList } from "../../constants/mood";
import { BackIcon, DeleteIcon } from "../../shared/Icons";
import clsx from "clsx";

const Heading: FC = ({ children }) => <h2 class="font-semibold">{children}</h2>;

const Card: FC = ({ children }) => (
  <li>
    <div class="flex flex-col rounded-md bg-white px-4 py-4 shadow-sm shadow-gray-200">
      {children}
    </div>
  </li>
);

const Button: FC = ({ children, ...props }) => {
  return (
    <button
      type="button"
      class="group flex flex-1 items-center justify-center rounded bg-black px-8 py-2 text-center text-white group-invalid:bg-gray-400"
      {...props}
    >
      <svg
        class="-ml-1 mr-3 hidden h-5 w-5 animate-spin text-white group-[.htmx-request]:block"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div>{children}</div>
      <div />
    </button>
  );
};

const Mood: FC<{ mood: number | undefined; errors: string[] }> = ({
  mood,
  errors,
}) => (
  <Card>
    <Heading>Mood</Heading>
    <ul class="flex justify-center gap-4 pt-3">
      {moodList.map(({ value, Icon, color, border }) => (
        <li>
          <MoodButton selected={mood === value} value={value} border={border}>
            <Icon className={clsx(color, "h-10 w-10")} />
          </MoodButton>
        </li>
      ))}
    </ul>
    {errors.includes("mood") ? (
      <p id="error-mood" class="py-1 text-red-500">
        Please select your mood.
      </p>
    ) : (
      <span />
    )}
  </Card>
);

const MoodButton: FC<{
  value: number;
  border: string;
  selected?: boolean;
}> = ({ selected, children, value, border }) => {
  return (
    <div>
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
        class={clsx(
          "flex rounded p-1 text-gray-400 outline-2 hover:cursor-pointer peer-checked:text-black peer-checked:outline",
          border,
        )}
        hx-include="[name='currentDate']"
        for={value}
      >
        {children}
      </label>
    </div>
  );
};

export const FoodItem: FC<{ food: string }> = ({ food }) => (
  <li id={`${food}-item-id`}>
    <button
      class="outline-5 flex items-center  rounded-md bg-black px-3 py-1 text-sm text-white hover:cursor-pointer"
      hx-delete="/entry/food-item"
      hx-vals={JSON.stringify({ food })}
      hx-target={`#${food}-item-id`}
      hx-swap="outerHTML"
      type="button"
    >
      {food}
    </button>
    <input hidden name={`food:${food}`} value={food} />
  </li>
);

const NutritionSection: FC<{ foodList?: string[] }> = ({ foodList = [] }) => {
  return (
    <Card>
      <Heading>Nutrition</Heading>
      <div class="flex gap-2">
        <input
          name="foodItem"
          class="focus-visible: ring-violet-30 mt-3 flex-1 border px-3 py-2"
          hx-post="/entry/food-item"
          hx-target="#food-list"
          hx-swap="beforeend"
          hx-trigger="keyup[keyCode==13]"
          _="on htmx:afterRequest set my value to ''"
        />
        {/* Prevent implicit submission of the form */}
        <button disabled style="display: none" aria-hidden="true"></button>
      </div>
      <div>
        <ul id="food-list" class="flex flex-wrap gap-2 pt-3">
          {foodList.map((food) => (
            <FoodItem food={food} />
          ))}
        </ul>
      </div>
    </Card>
  );
};

export const Entry: FC<{
  categories: [string, string[]][];
  mood?: number;
  date?: string;
  activities?: (string | null)[];
  entryId?: number;
  errors?: string[];
  foodItems?: string[];
}> = ({
  categories,
  mood,
  date = getCurrentDate(),
  activities = [],
  entryId,
  errors = [],
  foodItems,
}) => {
  return (
    <form class="group flex flex-col gap-6 py-4">
      <div class="flex flex-col gap-2 rounded-md bg-white p-4 shadow-sm shadow-gray-200">
        <label data-hx="date" id="current-date" class="font-bold">
          {toDayOfWeek(date)}
        </label>
        <input
          type="date"
          id="current-date"
          name="date"
          hx-post="/get-date"
          hx-target='[data-hx="date"]'
          class="border px-2 py-1 invalid:border-red-600"
          value={date}
          required
        />
      </div>
      <ul class="flex flex-col gap-4">
        <Mood mood={mood} errors={errors} />
        {categories.map(([name, options]) => (
          <Card>
            <Heading>{name}</Heading>
            <ul class="flex flex-wrap gap-2 pt-3">
              {options.map((option) => (
                <li>
                  <input
                    type="checkbox"
                    id={option}
                    name={`activity:${option}`}
                    class="peer hidden"
                    checked={activities.includes(option)}
                  />
                  <label
                    for={option}
                    class="hover: flex cursor-pointer items-center rounded-md bg-gray-300 px-3 py-1 text-sm peer-checked:bg-black peer-checked:text-white"
                  >
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        ))}
        <NutritionSection foodList={foodItems} />
      </ul>
      <div class="flex w-full gap-2">
        <a href="/" class="rounded bg-black px-6 py-2 text-center text-white ">
          <BackIcon className="w-6" />
        </a>
        {entryId ? (
          <Button
            hx-put={`/entry/${entryId}`}
            hx-swap="none"
            hx-validate="true"
          >
            Update
          </Button>
        ) : (
          <Button
            hx-target="form"
            hx-post="/entry"
            hx-swap="outerHTML"
            hx-validate="true"
          >
            Save
          </Button>
        )}
        {entryId && (
          <button
            type="button"
            hx-delete={`/entry/${entryId}`}
            hx-swap="none"
            hx-confirm="Are you sure you want to delete this entry?"
            class="rounded bg-black px-6 text-center text-white"
          >
            <DeleteIcon className="w-6" />
          </button>
        )}
      </div>
    </form>
  );
};
