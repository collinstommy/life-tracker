import { HonoApp } from "../../types";
import { Hono } from "hono";
import { getActivitySettingsView, getSettingsListView } from "./controller";

export const settingsApp = new Hono<HonoApp>();

settingsApp.get("/", getSettingsListView);
settingsApp.get("/activities", getActivitySettingsView);
