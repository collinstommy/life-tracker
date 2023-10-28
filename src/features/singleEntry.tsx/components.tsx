import { FC } from "hono/jsx";
import { getCurrentDate, toDayOfWeek } from "../../lib/date";
import { moodList } from "../../constants/mood";
import { categories } from "../../constants/categories";
import { BackIcon, DeleteIcon } from "../../shared/Icons";

const Heading: FC = ({ children }) => <h2 class="font-semibold">{children}</h2>;

const Card: FC = ({ children }) => (
  <li class="flex flex-col rounded-md bg-white px-4 py-4 shadow-sm shadow-gray-200 ">
    {children}
  </li>
);

const Button: FC = ({ children, ...props }) => {
  return (
    <button
      type="button"
      class="flex-1 rounded bg-black px-8 py-2 text-center text-white group-invalid:bg-gray-400"
      {...props}
    >
      {children}
    </button>
  );
};

export const FoodList: FC<{ foodList?: string[] }> = ({ foodList = [] }) => {
  return (
    <div id="food">
      <input hidden name="foodList" value={foodList.join(",")} />
      <ul class="flex flex-wrap gap-2 pt-3">
        {foodList.map((food) => (
          <li>
            <input
              type="checkbox"
              id={food}
              name={food}
              class="peer hidden"
              hx-delete="/entry/food-item"
              hx-params={`${food},foodList`}
              hx-target="#food"
              hx-swap="outerHTML"
            />
            <label
              for={food}
              class="flex items-center rounded-md bg-black  px-3 py-1 text-sm text-white hover:cursor-pointer"
            >
              {food}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

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
        class="text-gray-400 hover:cursor-pointer peer-checked:text-black"
        hx-include="[name='currentDate']"
        for={value}
      >
        {children}
      </label>
    </div>
  );
};

const NutritionSection: FC = () => {
  return (
    <Card>
      <Heading>Nutrition</Heading>
      <div class="flex gap-2">
        <input
          name="foodItem"
          class="focus-visible: ring-violet-30 mt-3 flex-1 border px-3 py-2"
          hx-include="[name='foodList']"
          hx-post="/entry/food-item"
          hx-target="#food"
          hx-swap="outerHTML"
          hx-trigger="keyup[keyCode==13]"
          _="on htmx:afterRequest set my value to ''"
        />
      </div>
      <FoodList />
    </Card>
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
          hx-post="/get-date"
          hx-target='[data-hx="date"]'
          class="border px-2 py-1 invalid:border-red-600"
          value={date}
          required
        />
      </div>
      <ul class="flex flex-col gap-4">
        <Card>
          <Heading>Mood</Heading>
          <ul class="flex justify-center gap-4 pt-3">
            {moodList.map(({ value, Icon }) => (
              <li>
                <IconButton selected={mood === value} value={value}>
                  <Icon />
                </IconButton>
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
        {categories.map(({ name, options }) => (
          <Card>
            <Heading>{name}</Heading>
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
                    class="hover: flex cursor-pointer items-center rounded-md bg-gray-300 px-3 py-1 text-sm peer-checked:bg-black peer-checked:text-white"
                  >
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        ))}
        <NutritionSection />
      </ul>
      <div class="flex w-full gap-2">
        <a href="/" class="rounded bg-black px-6 py-2 text-center text-white ">
          <BackIcon className="w-6" />
        </a>
        {entryId ? (
          <Button hx-put="/entry" hx-swap="none" hx-validate="true">
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
