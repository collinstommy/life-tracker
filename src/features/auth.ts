import { Clerk } from "@clerk/backend";
import ClerkClient from "@clerk/clerk-js";

import { API_URL, API_VERSION, JWT_KEY, SECRET_KEY } from "../constants";

export const createClerkClient = Clerk;

export const clerkClient = createClerkClient({
  secretKey: SECRET_KEY,
  apiUrl: API_URL,
  apiVersion: API_VERSION,
  jwtKey: JWT_KEY,
});

import * as constants from "../constants";
import { Context, Next } from "hono";

export async function loadClerk() {
  const clerkFrontendApi = `pk_test_d2FybS1oYWRkb2NrLTI5LmNsZXJrLmFjY291bnRzLmRldiQ`;
  const clerk = new ClerkClient(clerkFrontendApi);
  await clerk.load({});
}

export async function auth(c: Context, next: Next) {
  const secretKey = constants.SECRET_KEY;
  const publishableKey = constants.PUBLISHABLE_KEY;

  const requestState = await clerkClient.authenticateRequest({
    secretKey,
    publishableKey,
    apiKey: constants.SECRET_KEY,
    frontendApi: constants.PUBLISHABLE_KEY,
    request: c.req.raw,
  });

  if (requestState.isUnknown) {
    c.status(401);
    c.header(constants.Headers.AuthReason, requestState.reason);
    c.header(constants.Headers.AuthMessage, requestState.message);
    await next();
  }

  if (requestState.isInterstitial) {
    const interstitialHtmlPage = clerkClient.localInterstitial({
      publishableKey,
      frontendApi: constants.PUBLISHABLE_KEY,
    });

    c.status(401);
    c.header(constants.Headers.AuthReason, requestState.reason);
    c.header(constants.Headers.AuthMessage, requestState.message);
    c.header("Content-Type", "text/html");

    c.html(interstitialHtmlPage);
  }
  c.set("store", requestState.toAuth());
  await next();
}
