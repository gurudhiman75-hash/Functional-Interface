import assert from "node:assert/strict";

import {
  assertPublicHttpsSourceUrl,
  fetchBoundedOfficialText,
  resolveSafeOfficialRedirect,
} from "./source-fetch";

assert.equal(
  assertPublicHttpsSourceUrl("https://www.pib.gov.in/RssMain.aspx?ModId=6#latest"),
  "https://www.pib.gov.in/RssMain.aspx?ModId=6",
);
assert.throws(() => assertPublicHttpsSourceUrl("http://pib.gov.in/feed"), /HTTPS/);
assert.throws(() => assertPublicHttpsSourceUrl("https://127.0.0.1/feed"), /private-network/);

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

await assert.rejects(
  () => fetchBoundedOfficialText(
    "https://punjab.gov.in/impnotifications/",
    { accept: "text/html", maxBytes: 100_000, label: "Official listing" },
    async () => new Response(null, { status: 301, headers: { location: "https://example.com/notices" } }),
  ),
  /outside its trusted host/,
);

console.log("Current Affairs bounded official-source fetch contracts passed");
