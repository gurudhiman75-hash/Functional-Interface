import assert from "node:assert/strict";
import test from "node:test";
import { onRequest } from "../functions/api/[[path]].js";

function req(url, method = "GET", opts = {}) {
  return new Request(url, { method, ...opts });
}

test("API proxy rejects cross-site Origins and non-API routes", async () => {
  const blocked = await onRequest({ request: req("https://examtree-web.pages.dev/api/attempts", "POST", {
    headers: { Origin: "https://attacker.example" }, body: "{}",
  }) });
  assert.equal(blocked.status, 403);
  assert.equal((await onRequest({request: req("https://examtree-web.pages.dev/not-api")})).status, 404);
});

test("API proxy passes auth and body, strips forwarding headers, disables caching", async () => {
  const originalFetch = globalThis.fetch;
  let seen;
  globalThis.fetch = async (request) => {
    seen = request;
    return Response.json({ ok: true }, { status: 201, headers: { "Cache-Control": "public, max-age=600" } });
  };
  try {
    const response = await onRequest({
      request: req("https://examtree-web.pages.dev/api/admin/question-studio/runs?test=1", "POST", {
        headers: {
          Origin: "https://examtree-web.pages.dev",
          Authorization: "Bearer example-token",
          "Content-Type": "application/json",
          "X-Forwarded-Host": "evil.example",
        },
        body: JSON.stringify({ count: 3 }),
      }),
    });
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    assert.equal(seen.url, "https://examtree-new.onrender.com/api/admin/question-studio/runs?test=1");
    assert.equal(seen.headers.get("Authorization"), "Bearer example-token");
    assert.equal(seen.headers.get("Origin"), null);
    assert.equal(seen.headers.get("X-Forwarded-Host"), null);
    assert.deepEqual(await seen.json(), { count: 3 });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("API proxy returns controlled errors when Render is unavailable", async () => {
  const old = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("cold start"); };
  try {
    const response = await onRequest({ request: req("https://examtree-web.pages.dev/api/exams") });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "API_UPSTREAM_UNAVAILABLE");
  } finally {
    globalThis.fetch = old;
  }
});
