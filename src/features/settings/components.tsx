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
      hx-swap="beforeend"
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
      hx-swap="beforeend"
      hx-post={CATEGORY_PATH}
      class="flex flex-col gap-2"
      _="on htmx:afterRequest reset() me"
    >
      <label class="font-semibold" for="label">
        Add new group
      </label>
      <input name="label" id="label" required></input>
      <button class="btn">Add</button>
    </form>
  </div>
);

export const CategoryCard: FC<{ id: number; label: string }> = ({
  id,
  label,
}) => (
  <div
    id={`category-${id}`}
    class="fade-me-out card-container flex items-center justify-between px-3 py-2"
  >
    <a class="flex w-full" href={`/settings/categories/${id}`}>
      {label}
    </a>
    <button
      hx-delete={`${CATEGORY_PATH}/${id}`}
      hx-target={`#category-${id}`}
      hx-swap="outerHTML swap:.2s"
      hx-confirm="Are you sure you want to delete this category?"
    >
      <DeleteIcon className="hover:text-slate-600" />
    </button>
  </div>
);

export const CategoryList: FC<{ categories: Category[] }> = ({
  categories,
}) => (
  <div class="flex flex-col gap-2" id={CATEGORY_ID}>
    <h1 class="text-2xl font-bold">Activity Categories</h1>
    {categories.map((cat) => (
      <CategoryCard id={cat.id} label={cat.label} />
    ))}
  </div>
);

export const ActivityCard: FC<{
  id: number;
  value: string;
  categoryId: string;
}> = ({ value, id, categoryId }) => (
  <div
    id={`activity-${id}`}
    class="card-container fade-me-out flex items-center justify-between px-3 py-2"
  >
    <div class="flex w-full">{value}</div>
    <button
      hx-delete={`/settings/categories/${categoryId}/activities/${id}`}
      hx-target={`#activity-${id}`}
      hx-swap="outerHTML swap:.2s"
    >
      <DeleteIcon className="hover:text-slate-600" />
    </button>
  </div>
);

export const ActivityList: FC<{
  activities?: ActivitySetting[];
  categoryId: string;
}> = ({ activities = [], categoryId }) => (
  <div class="flex flex-col gap-2" id={ACTIVITY_ID}>
    <h1 class="text-2xl font-bold">Activity</h1>
    {activities.map((activity) => (
      <ActivityCard
        id={activity.id}
        value={activity.value}
        categoryId={categoryId}
      />
    ))}
  </div>
);
