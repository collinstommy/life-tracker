import type { ActivitySetting, Category } from "../../db";
import { FC } from "hono/jsx";
import { DeleteIcon } from "../../shared/Icons";
import { CATEGORY_PATH } from "./routes";

const CATEGORY_ID = "category-list";
const ACTIVITY_ID = "activity-list";

export const CreateActivityForm: FC<{ categoryId: string }> = ({
  categoryId,
}) => (
  <div class="card px-3 py-3">
    <form
      hx-target={`#${ACTIVITY_ID}`}
      hx-swap="outerHTML"
      hx-post={`/settings/categories/${categoryId}/activities`}
      class="flex flex-col gap-2"
      _="on htmx:afterRequest reset() me"
    >
      <label class="font-semibold" for="value">
        Add new activity
      </label>
      <input name="value" id="value" required></input>
      <button class="btn">Add</button>
    </form>
  </div>
);

export const CreateCategoryForm: FC = () => (
  <div class="card px-3 py-3">
    <form
      hx-target={`#${CATEGORY_ID}`}
      hx-swap="outerHTML"
      hx-post={CATEGORY_PATH}
      class="flex flex-col gap-2"
      _="on htmx:afterRequest reset() me"
    >
      <label class="font-semibold" for="activityGroup">
        Add new group
      </label>
      <input name="activityGroup" id="activityGroup" required></input>
      <button class="btn">Add</button>
    </form>
  </div>
);

export const CategoryList: FC<{ categories: Category[] }> = ({
  categories,
}) => (
  <div class="flex flex-col gap-2" id={CATEGORY_ID}>
    <h1 class="text-2xl font-bold">Activity Categories</h1>
    {/* share with activity list */}
    {categories.map((cat) => (
      <div
        id={`category-${cat.id}`}
        class="fade-me-out card-container flex items-center justify-between px-3 py-2"
      >
        <a class="flex w-full" href={`/settings/categories/${cat.id}`}>
          {cat.label}
        </a>
        <button
          hx-delete={`${CATEGORY_PATH}/${cat.id}`}
          hx-target={`#category-${cat.id}`}
          hx-swap="outerHTML swap:.15s"
          hx-confirm="Are you sure you want to delete this category?"
        >
          <DeleteIcon className="hover:text-slate-600" />
        </button>
      </div>
    ))}
  </div>
);

export const ActivityList: FC<{
  activities?: ActivitySetting[];
  categoryId: string;
}> = ({ activities = [], categoryId }) => (
  <div class="flex flex-col gap-2" id={ACTIVITY_ID}>
    <h1 class="text-2xl font-bold">Activity</h1>
    {activities.map((activity) => (
      <div
        id={`activity-${activity.id}`}
        class="card-container fade-me-out flex items-center justify-between px-3 py-2"
      >
        <div class="flex w-full">{activity.value}</div>
        <button
          hx-delete={`/settings/categories/${categoryId}/activities/${activity.id}`}
          hx-target={`#activity-${activity.id}`}
          hx-swap="outerHTML swap:.15s"
        >
          <DeleteIcon className="hover:text-slate-600" />
        </button>
      </div>
    ))}
  </div>
);
