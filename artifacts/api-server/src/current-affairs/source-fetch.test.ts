import assert from "node:assert/strict";

import {
  assertPublicHttpsSourceUrl,
  fetchBoundedOfficialText,
  officialHostVariants,
  resolveSafeOfficialRedirect,
} from "./source-fetch";

assert.equal(
  assertPublicHttpsSourceUrl("https://www.pib.gov.in/RssMain.aspx?ModId=6#latest"),
  "https://www.pib.gov.in/RssMain.aspx?ModId=6",
);
assert.throws(() => assertPublicHttpsSourceUrl("http://pib.gov.in/feed"), /HTTPS/);
assert.throws(() => assertPublicHttpsSourceUrl("https://127.0.0.1/feed"), /private-network/);

assert.deepEqual(
  officialHostVariants("https://punjab.gov.in/impnotifications/"),
  ["https://punjab.gov.in/impnotifications/", "https://www.punjab.gov.in/impnotifications/"],
);
assert.deepEqual(
  officialHostVariants("https://www.pib.gov.in/RssMain.aspx?ModId=6"),
  ["https://www.pib.gov.in/RssMain.aspx?ModId=6", "https://pib.gov.in/RssMain.aspx?ModId=6"],
);
assert.deepEqual(
  officialHostVariants("https://ipr.punjab.gov.in/"),
  ["https://ipr.punjab.gov.in/"],
  "nested department hosts must not receive invented www aliases",
);

assert.equal(
  resolveSafeOfficialRedirect(
    "https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
    "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
  ),
  "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
);
assert.equal(
  resolveSafeOfficialRedirect("https://punjab.gov.in/impnotifications/", "/impnotifications/?page=1"),
  "https://punjab.gov.in/impnotifications/?page=1",
);
assert.throws(
  () => resolveSafeOfficialRedirect("https://pib.gov.in/feed", "https://example.com/feed"),
  /outside its trusted host/,
);
assert.throws(
  () => resolveSafeOfficialRedirect("https://pib.gov.in/feed", "http://pib.gov.in/feed"),
  /HTTPS/,
);

const calls: Array<{ url: string; redirect: RequestRedirect | undefined }> = [];
const redirectingFetch = async (input: string | URL | Request, init?: RequestInit) => {
  const url = String(input);
  calls.push({ url, redirect: init?.redirect });
  if (url.startsWith("https://www.pib.gov.in/")) {
    return new Response(null, {
      status: 302,
      headers: { location: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3" },
    });
  }
  return new Response("<rss><channel><title>PIB</title></channel></rss>", {
    status: 200,
    headers: { "content-type": "text/xml" },
  });
};

const redirected = await fetchBoundedOfficialText(
  "https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
  { accept: "text/xml", maxBytes: 100_000, label: "Feed" },
  redirectingFetch,
);
assert.match(redirected, /<rss>/);
assert.equal(calls.length, 2);
assert.equal(calls[0]?.redirect, "manual");
assert.equal(calls[1]?.url.startsWith("https://pib.gov.in/"), true);

let transientCalls = 0;
const transientFetch = async () => {
  transientCalls += 1;
  if (transientCalls === 1) return new Response("busy", { status: 503 });
  return new Response("ok", { status: 200 });
};
const retried = await fetchBoundedOfficialText(
  "https://punjab.gov.in/impnotifications/",
  { accept: "text/html", maxBytes: 100_000, label: "Official listing" },
  transientFetch,
);
assert.equal(retried, "ok");
assert.equal(transientCalls, 2);

const aliasCalls: string[] = [];
const aliasFallbackFetch = async (input: string | URL | Request) => {
  const url = String(input);
  aliasCalls.push(url);
  if (new URL(url).hostname === "punjab.gov.in") {
    const error = new TypeError("fetch failed") as TypeError & { cause?: Record<string, unknown> };
    error.cause = { code: "UND_ERR_CONNECT_TIMEOUT", hostname: "punjab.gov.in" };
    throw error;
  }
  return new Response("<html>Punjab official alias reached</html>", { status: 200 });
};
const aliasRecovered = await fetchBoundedOfficialText(
  "https://punjab.gov.in/impnotifications/",
  { accept: "text/html", maxBytes: 100_000, label: "Official listing" },
  aliasFallbackFetch,
);
assert.match(aliasRecovered, /alias reached/);
assert.deepEqual(aliasCalls, [
  "https://punjab.gov.in/impnotifications/",
  "https://www.punjab.gov.in/impnotifications/",
]);

await assert.rejects(
  () => fetchBoundedOfficialText(
    "https://punjab.gov.in/impnotifications/",
    { accept: "text/html", maxBytes: 100_000, label: "Official listing" },
    async () => new Response(null, { status: 301, headers: { location: "https://example.com/notices" } }),
  ),
  /outside its trusted host/,
);

console.log("Current Affairs bounded official-source fetch contracts passed");
