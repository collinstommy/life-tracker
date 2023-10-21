import { HonoApp } from "../../types";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { verifyIdToken } from "./verify";
import { userTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import dayjs from "dayjs";

export const authApi = new Hono<HonoApp>();

export const Login = () => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://accounts.google.com/gsi/client" async></script>
      <div
        id="g_id_onload"
        data-client_id="21946598134-2cdfh6kammv6kjn72pv97p3uk5li9pgg.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri="http://localhost:8787/login/google"
        data-itp_support="true"
      ></div>

      <div
        class="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
      <title>ToDo App</title>
    </head>
    <body class="border bg-gray-200 px-4" hx-boost="true"></body>
  </html>
);

async function getUser(db: DrizzleD1Database, googleSub: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.googleId, googleSub));

  if (user && user.length) {
    return user[0];
  }
  const newUser = await db
    .insert(userTable)
    .values({ googleId: googleSub })
    .returning();
  return newUser[0];
}

authApi.post("/login/google", async (c) => {
  const { credential } = await c.req.parseBody<{ credential: string }>();
  const { sub, name } = await verifyIdToken({
    idToken: credential,
    clientId: c.env.GOOGLE_CLIENT_ID,
    waitUntil: c.executionCtx.waitUntil,
  });

  if (sub) {
    const user = await getUser(c.get("db"), sub);
    const toSign = {
      ...user,
      name,
      exp: dayjs().add(7, "day").unix(),
      nbf: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
    };

    const jwt = await sign(toSign, c.env.JWT_SECRET);
    setCookie(c, "user", jwt, {
      path: "/",
      secure: true,
      httpOnly: true,
    });

    return c.redirect("/");
  }

  // todo return login with error
  return c.body(null);
});
