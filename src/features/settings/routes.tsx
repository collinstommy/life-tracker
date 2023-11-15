import { HonoApp } from "../../types";
import { Hono } from "hono";
import {
  createCategory,
  categoriesListView,
  settingsListView,
  deleteCategory,
  activitySettingsListView,
  createActivity,
  deleteActivity,
} from "./controller";

export const settingsApp = new Hono<HonoApp>();
export const CATEGORY_PATH = "/settings/categories";
export const ACTIVITIES_PATH = "/settings/categories/:id/activities";

// Views
settingsApp.get("/", settingsListView);
settingsApp.get("/categories", categoriesListView);
settingsApp.get("/categories/:id", activitySettingsListView);

// Crud
settingsApp.post("/categories", createCategory);
settingsApp.delete("/categories/:id", deleteCategory);

settingsApp.post("/categories/:id/activities", createActivity);
settingsApp.delete(
  "/categories/:categoryId/activities/:activityId",
  deleteActivity,
);
