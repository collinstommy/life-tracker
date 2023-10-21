import { decodeProtectedHeader, jwtVerify } from "jose";
import { importX509 } from "jose";

const inFlight = new Map();
const cache = new Map();

const canUseDefaultCache =
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  typeof globalThis.caches?.default?.put === "function";

/**
 * Imports a public key for the provided Google Cloud (GCP)
 * service account credentials.
 *
 * @throws {FetchError} - If the X.509 certificate could not be fetched.
 */
async function importPublicKey(options) {
  const keyId = options.keyId;
  const certificateURL = options.certificateURL ?? "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"; // prettier-ignore
  const cacheKey = `${certificateURL}?key=${keyId}`;
  const value = cache.get(cacheKey);
  const now = Date.now();
  async function fetchKey() {
    // Fetch the public key from Google's servers
    const res = await fetch(certificateURL);
    if (!res.ok) {
      const error = await res
        .json()
        .then((data) => data.error.message)
        .catch(() => undefined);
      throw new FetchError(error ?? "Failed to fetch the public key", {
        response: res,
      });
    }
    const data = await res.json();
    const x509 = data[keyId];
    if (!x509) {
      throw new Error(`Public key "${keyId}" not found.`);
    }
    const key = await importX509(x509, "RS256");
    // Resolve the expiration time of the key
    const maxAge = res.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1]; // prettier-ignore
    const expires = Date.now() + Number(maxAge ?? "3600") * 1000;
    // Update the local cache
    cache.set(cacheKey, { key, expires });
    inFlight.delete(keyId);
    return key;
  }
  // Attempt to read the key from the local cache
  if (value) {
    if (value.expires > now + 10_000) {
      // If the key is about to expire, start a new request in the background
      if (value.expires - now < 600_000) {
        const promise = fetchKey();
        inFlight.set(cacheKey, promise);
        if (options.waitUntil) {
          options.waitUntil(promise);
        }
      }
      return value.key;
    } else {
      cache.delete(cacheKey);
    }
  }
  // Check if there is an in-flight request for the same key ID
  let promise = inFlight.get(cacheKey);
  // If not, start a new request
  if (!promise) {
    promise = fetchKey();
    inFlight.set(cacheKey, promise);
  }
  return await promise;
}

// based on https://www.npmjs.com/package/web-auth-library?activeTab=code
// made to check per Google's recommendations: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
export async function verifyIdToken(options) {
  if (!options?.idToken) {
    throw new TypeError(`Missing "idToken"`);
  }
  let clientId = options?.clientId;
  if (clientId === undefined) {
    throw new TypeError(`Missing "clientId"`);
  }
  if (!options.waitUntil && canUseDefaultCache) {
    console.warn("Missing `waitUntil` option.");
  }
  // Import the public key from the Google Cloud project
  const header = decodeProtectedHeader(options.idToken);
  const now = Math.floor(Date.now() / 1000);
  const key = await importPublicKey({
    keyId: header.kid,
    certificateURL: "https://www.googleapis.com/oauth2/v1/certs",
    waitUntil: options.waitUntil,
  });
  const { payload } = await jwtVerify(options.idToken, key, {
    audience: clientId,
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    maxTokenAge: "1h",
    clockTolerance: "5m",
  });
  if (!payload.sub) {
    throw new Error(`Missing "sub" claim`);
  }
  if (typeof payload.auth_time === "number" && payload.auth_time > now) {
    throw new Error(`Unexpected "auth_time" claim value`);
  }
  return payload;
}
