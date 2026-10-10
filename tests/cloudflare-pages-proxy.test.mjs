import assert from "node:assert/strict";
import test from "node:test";
import { onRequest, configuredApiOrigin } from "../functions/api/[[path]].js";

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

test("Cloudflare API proxy supports validated Cloud Run cutover without exposing an open proxy", async () => {
  assert.equal(configuredApiOrigin({}), "https://examtree-new.onrender.com");
  const cloudRun = "https://examtree-api-staging-1083299267005.asia-south1.run.app";
  assert.equal(configuredApiOrigin({ EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun }), cloudRun);
  for (const candidate of [
    "http://examtree-api-staging-1083299267005.asia-south1.run.app",
    "https://attacker.example",
    "https://examtree-api-staging-1083299267005.asia-south1.run.app/evil",
    "https://examtree-new.onrender.com.evil.example",
  ]) {
    assert.throws(() => configuredApiOrigin({ EXAMTREE_API_UPSTREAM_ORIGIN: candidate }));
  }
  const old = globalThis.fetch;
  let observed;
  globalThis.fetch = async (request) => {
    observed = request;
    return new Response(null, {
      status: 302,
      headers: { Location: cloudRun + "/api/admin/login", "Cache-Control": "public, max-age=600" },
    });
  };
  try {
    const reply = await onRequest({
      request: req("https://functional-interface.pages.dev/api/admin/login", "GET"),
      env: { EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun },
    });
    assert.equal(observed.url, cloudRun + "/api/admin/login");
    assert.equal(reply.headers.get("location"), "https://functional-interface.pages.dev/api/admin/login");
    assert.equal(reply.headers.get("cache-control"), "private, no-store");
    assert.equal(reply.status, 302);
  } finally { globalThis.fetch = old; }

  const rejected = await onRequest({
    request: req("https://functional-interface.pages.dev/api/exams"),
    env: { EXAMTREE_API_UPSTREAM_ORIGIN: "https://attacker.example" },
  });
  assert.equal(rejected.status, 503);
  assert.equal((await rejected.json()).code, "API_GATEWAY_MISCONFIGURED");
});
