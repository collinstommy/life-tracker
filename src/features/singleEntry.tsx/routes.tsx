import { HonoApp } from "../../types";
import { Hono } from "hono";
import {
  addFoodItem,
  createEntry,
  deleteEntry,
  editEntryView,
  newEntryView,
  parseDate,
  removeFoodItem,
  updateEntry,
  validateMood,
} from "./controller";

export const entryApi = new Hono<HonoApp>();

// Views
entryApi.get("/edit/:entryId", editEntryView);
entryApi.get("/new", newEntryView);

// Partials
entryApi.get("/validate/mood", validateMood);
entryApi.post("/get-date", parseDate);
entryApi.post("/entry/food-item", addFoodItem);
entryApi.delete("/entry/food-item", removeFoodItem);

// Crud
entryApi.post("/entry", createEntry);
entryApi.put("/entry/:entryId", updateEntry);
entryApi.delete("/entry/:entryId", deleteEntry);
