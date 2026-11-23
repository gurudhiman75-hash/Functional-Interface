import assert from "node:assert/strict";
import test from "node:test";
import { onRequest, configuredPreviewStagingOrigin } from "../functions/api/[[path]].js";

const STAGING = "https://examtree-api-staging-ttnfjefqka-el.a.run.app";
const PROD = "https://examtree-api-ttnfjefqka-el.a.run.app";
const env = {
  EXAMTREE_PREVIEW_STAGING_API_ORIGIN: STAGING,
  EXAMTREE_API_UPSTREAM_ORIGIN: PROD,
  EXAMTREE_ADMIN_UPSTREAM: "cloud-run-deterministic",
  EXAMTREE_ADMIN_CANARY_ORIGIN: "https://admin-candidate---examtree-api-ttnfjefqka-el.a.run.app",
};

async function upstreamFor(url, method = "GET", e = env) {
  const original = globalThis.fetch;
  let seen = null;
  globalThis.fetch = async (request) => { seen = request.url; return Response.json({ ok: true }); };
  try {
    const response = await onRequest({ request: new Request(url, { method, body: method === "GET" ? undefined : "{}" }), env: e });
    return { status: response.status, upstream: seen };
  } finally { globalThis.fetch = original; }
}

test("preview subdomains send student and admin API traffic to staging", async () => {
  const host = "https://feature-direct-publish-l.functional-interface.pages.dev";
  for (const path of ["/api/tests/abc", "/api/attempt-sessions", "/api/admin/tests", "/api/admin/question-studio/runs"]) {
    const { upstream } = await upstreamFor(host + path, path === "/api/attempt-sessions" ? "POST" : "GET");
    assert.ok(upstream?.startsWith(STAGING + "/api/"), `${path} -> ${upstream}`);
  }
});

test("production hostnames never use the staging origin, even if the variable leaks", async () => {
  for (const host of ["https://examtree.in", "https://www.examtree.in", "https://test.examtree.in",
                      "https://blog.examtree.in", "https://functional-interface.pages.dev"]) {
    const { upstream } = await upstreamFor(host + "/api/tests/abc");
    assert.ok(!upstream?.startsWith(STAGING), `${host} -> ${upstream}`);
    const admin = await upstreamFor(host + "/api/admin/tests");
    assert.ok(!admin.upstream?.startsWith(STAGING), `${host} admin -> ${admin.upstream}`);
  }
});

test("payments fail closed on staging previews", async () => {
  const host = "https://feature-x.functional-interface.pages.dev";
  for (const path of ["/api/billing/cashfree/webhook", "/api/commerce/orders/1/confirm", "/api/admin/commerce/orders", "/api/packages/verify"]) {
    const { status, upstream } = await upstreamFor(host + path, "POST");
    assert.equal(status, 503, path);
    assert.equal(upstream, null, path);
  }
});

test("only the dedicated staging service is accepted", () => {
  const host = "x.functional-interface.pages.dev";
  assert.equal(configuredPreviewStagingOrigin({}, host), null);
  assert.equal(configuredPreviewStagingOrigin({ EXAMTREE_PREVIEW_STAGING_API_ORIGIN: STAGING }, "examtree.in"), null);
  assert.throws(() => configuredPreviewStagingOrigin({ EXAMTREE_PREVIEW_STAGING_API_ORIGIN: PROD }, host));
  assert.throws(() => configuredPreviewStagingOrigin({ EXAMTREE_PREVIEW_STAGING_API_ORIGIN: "https://evil.example" }, host));
  assert.equal(configuredPreviewStagingOrigin({ EXAMTREE_PREVIEW_STAGING_API_ORIGIN: STAGING }, host), STAGING);
});
