import { Hono } from "hono";
import { HonoApp } from "./types";

export const app = new Hono<HonoApp>();
