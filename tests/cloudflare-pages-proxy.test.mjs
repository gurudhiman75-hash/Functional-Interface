import assert from "node:assert/strict";
// Run provider-free admin guards as part of the existing production-build proxy suite.
import "./examtree-admin-noai-cutover.test.mjs";
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
  const cloudRun = "https://examtree-api-1083299267005.asia-south1.run.app";
  assert.equal(configuredApiOrigin({ EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun }), cloudRun);
  for (const candidate of [
    "http://examtree-api-staging-1083299267005.asia-south1.run.app",
    "https://attacker.example",
    "https://examtree-api-staging-1083299267005.asia-south1.run.app",
    "https://examtree-api-1083299267005.asia-south1.run.app/evil",
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
      headers: { Location: cloudRun + "/api/tests", "Cache-Control": "public, max-age=600" },
    });
  };
  try {
    const reply = await onRequest({
      request: req("https://functional-interface.pages.dev/api/tests", "GET"),
      env: { EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun },
    });
    assert.equal(observed.url, cloudRun + "/api/tests");
    assert.equal(reply.headers.get("location"), "https://functional-interface.pages.dev/api/tests");
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

test("Cloud Run cutover retains Render endpoints for in-flight payment callbacks", async () => {
  const cloudRun = "https://examtree-api-1083299267005.asia-south1.run.app";
  const original = globalThis.fetch;
  const forwarded = [];
  globalThis.fetch = async (request) => {
    forwarded.push({ url: request.url, method: request.method });
    return Response.json({ ok: true });
  };
  try {
    const env = { EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun };
    for (const [path, method] of [
      ["/api/billing/cashfree/webhook", "POST"],
      ["/api/billing/webhook", "POST"],
      ["/api/commerce/orders/aaa-bbb/reconcile", "POST"],
      ["/api/commerce/orders/aaa-bbb/confirm", "POST"],
      ["/api/admin/commerce/orders/reconciliation/health", "GET"],
      ["/api/admin/commerce/orders/a-refund-id/reconcile", "POST"],
      ["/api/admin/question-studio/review-page", "GET"],
      ["/api/admin/session", "GET"],
      ["/api/billing/razorpay/verify", "POST"],
      ["/api/packages/verify", "POST"],
    ]) {
      const response = await onRequest({
        request: req("https://examtree.in" + path, method, {
          headers: { "content-type": "application/json" },
          body: method === "GET" || method === "HEAD" ? undefined : "{}",
        }),
        env,
      });
      assert.equal(response.status, 200);
    }
    const ordinary = await onRequest({
      request: req("https://examtree.in/api/attempts"),
      env,
    });
    assert.equal(ordinary.status, 200);
    assert.ok(forwarded.slice(0, 10).every(x => x.url.startsWith("https://examtree-new.onrender.com/")));
    assert.equal(forwarded[10].url, cloudRun + "/api/attempts");
  } finally {
    globalThis.fetch = original;
  }
});


test("admin promotion is opt-in and keeps finance plus callbacks on Render", async () => {
  const cloudRun = "https://examtree-api-1083299267005.asia-south1.run.app";
  const savedFetch = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async (request) => {
    seen.push(request.url);
    return Response.json({ ok: true });
  };
  try {
    const cases = [
      ["/api/admin/session/bootstrap", "POST", cloudRun],
      ["/api/admin/question-studio/review-page", "GET", cloudRun],
      ["/api/admin/notes-studio-v2/status", "GET", cloudRun],
      ["/api/admin/students", "GET", cloudRun],
      ["/api/admin/commerce/orders", "GET", "https://examtree-new.onrender.com"],
      ["/api/admin/commerce/products", "GET", "https://examtree-new.onrender.com"],
      ["/api/admin/commerce/coupons", "GET", "https://examtree-new.onrender.com"],
      ["/api/billing/cashfree/webhook", "POST", "https://examtree-new.onrender.com"],
      ["/api/commerce/orders/order-1/reconcile", "POST", "https://examtree-new.onrender.com"],
    ];
    for (const [path, method, destination] of cases) {
      const response = await onRequest({
        request: req("https://examtree.in" + path, method, method === "POST"
          ? { body: "{}", headers: { "Content-Type": "application/json" } } : {}),
        env: { EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun, EXAMTREE_ADMIN_UPSTREAM: "cloud-run" },
      });
      assert.equal(response.status, 200);
      assert.equal(seen.at(-1), destination + path);
    }
    for (const badValue of [undefined, "", "render", "staging", "cloudrun"]) {
      const response = await onRequest({
        request: req("https://examtree.in/api/admin/question-studio/review-page"),
        env: { EXAMTREE_API_UPSTREAM_ORIGIN: cloudRun, EXAMTREE_ADMIN_UPSTREAM: badValue },
      });
      assert.equal(response.status, 200);
      assert.equal(seen.at(-1), "https://examtree-new.onrender.com/api/admin/question-studio/review-page");
    }
  } finally {
    globalThis.fetch = savedFetch;
  }
});


test("no-AI admin mode migrates only session and deterministic Question Studio", async () => {
  const old = globalThis.fetch;
  const upstream = "https://examtree-api-1083299267005.asia-south1.run.app";
  const legacy = "https://examtree-new.onrender.com";
  const seen = [];
  globalThis.fetch = async (request) => {
    seen.push(request.url);
    return Response.json({ ok: true });
  };
  try {
    const env = {
      EXAMTREE_API_UPSTREAM_ORIGIN: upstream,
      EXAMTREE_ADMIN_UPSTREAM: "cloud-run-deterministic",
    };
    const cases = [
      ["/api/admin/session", upstream],
      ["/api/admin/session/bootstrap", upstream],
      ["/api/admin/question-studio/capabilities", upstream],
      ["/api/admin/question-studio/review-page?page=1", upstream],
      ["/api/admin/question-studio/runs", upstream],
      ["/api/admin/notes-studio-v2/capabilities", legacy],
      ["/api/admin/notes-studio-v2/notes/generate", legacy],
      ["/api/admin/notes-studio/capabilities", legacy],
      ["/api/admin/current-affairs", legacy],
      ["/api/admin/commerce/orders", legacy],
      ["/api/admin/questions", legacy],
      ["/api/admin/students", legacy],
      ["/api/admin/session-evil", legacy],
      ["/api/admin/question-studio-ai", legacy],
      ["/api/admin", legacy],
      ["/api/billing/cashfree/webhook", legacy],
      ["/api/commerce/orders/order-id/reconcile", legacy],
      ["/api/student/profile", upstream],
    ];
    for (const [path, destination] of cases) {
      const response = await onRequest({
        request: req("https://examtree.in" + path),
        env,
      });
      assert.equal(response.status, 200, path);
      assert.equal(seen.at(-1), destination + path, path);
    }
    // Fail closed to Render if the admin variable is unset or malformed.
    for (const value of [undefined, "cloud-run-determ", "Cloud-run-deterministic", "true"]) {
      const response = await onRequest({
        request: req("https://examtree.in/api/admin/question-studio/capabilities"),
        env: { EXAMTREE_API_UPSTREAM_ORIGIN: upstream, EXAMTREE_ADMIN_UPSTREAM: value },
      });
      assert.equal(response.status, 200);
      assert.equal(seen.at(-1), legacy + "/api/admin/question-studio/capabilities");
    }
  } finally {
    globalThis.fetch = old;
  }
});

test("Cloud Run only mode requires independent finance handover switch", async () => {
  const upstream = "https://examtree-api-1083299267005.asia-south1.run.app";
  const legacy = "https://examtree-new.onrender.com";
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (request) => {
    calls.push(request.url);
    return Response.json({ ok: true });
  };
  const paths = [
    "/api/admin/session/bootstrap",
    "/api/admin/notes-studio-v2/capabilities",
    "/api/admin/commerce/products/access-policies",
    "/api/admin/commerce/orders",
    "/api/commerce/orders/example/reconcile",
    "/api/billing/cashfree/webhook",
    "/api/packages/verify",
  ];
  try {
    for (const financeFlag of [undefined, "render", "cloud-run"]) {
      const env = {
        EXAMTREE_API_UPSTREAM_ORIGIN: upstream,
        EXAMTREE_ADMIN_UPSTREAM: "cloud-run",
        EXAMTREE_FINANCE_UPSTREAM: financeFlag,
      };
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const financePath = i >= 2;
        const response = await onRequest({
          request: req("https://examtree.in" + path, path.includes("webhook") ? "POST" : "GET",
            path.includes("webhook") ? { body: "{}", headers: { "Content-Type": "application/json" } } : {}),
          env,
        });
        assert.equal(response.status, 200);
        assert.equal(calls.at(-1), (financePath && financeFlag !== "cloud-run" ? legacy : upstream) + path);
      }
    }
    // The finance flag alone must not bypass conservative admin routing.
    const response = await onRequest({
      request: req("https://examtree.in/api/admin/commerce/orders"),
      env: { EXAMTREE_API_UPSTREAM_ORIGIN: upstream, EXAMTREE_FINANCE_UPSTREAM: "cloud-run" },
    });
    assert.equal(response.status, 200);
    assert.equal(calls.at(-1), legacy + "/api/admin/commerce/orders");
  } finally {
    globalThis.fetch = original;
  }
});

test("tagged admin canary routes only non-financial admin requests and cannot replace student or finance", async () => {
  const { configuredAdminCanaryOrigin } = await import("../functions/api/[[path]].js");
  const candidate = "https://admin-candidate---examtree-api-ttnfjefqka-el.a.run.app";
  const student = "https://examtree-api-ttnfjefqka-el.a.run.app";
  const render = "https://examtree-new.onrender.com";
  assert.equal(configuredAdminCanaryOrigin({ EXAMTREE_ADMIN_CANARY_ORIGIN: candidate }), candidate);
  for (const invalid of [
    "https://evil.example",
    "http://admin-candidate---examtree-api-ttnfjefqka-el.a.run.app",
    "https://admin-candidate---examtree-api-ttnfjefqka-el.a.run.app/evil",
    "https://admin-candidate---examtree-api-staging-ttnfjefqka-el.a.run.app",
    "https://admin-candidate---examtree-api-ttnfjefqka-el.a.run.app.evil.example",
  ]) assert.throws(() => configuredAdminCanaryOrigin({ EXAMTREE_ADMIN_CANARY_ORIGIN: invalid }));

  const original = globalThis.fetch;
  const forwarded = [];
  globalThis.fetch = async request => {
    forwarded.push(request.url);
    return Response.json({ ok: true });
  };
  try {
    const env = {
      EXAMTREE_ADMIN_UPSTREAM: "cloud-run-deterministic",
      EXAMTREE_ADMIN_CANARY_ORIGIN: candidate,
      EXAMTREE_API_UPSTREAM_ORIGIN: student,
    };
    for (const [path, expected, method] of [
      ["/api/admin/session/bootstrap", candidate, "POST"],
      ["/api/admin/question-studio/capabilities", candidate, "GET"],
      ["/api/admin/notes-studio-v2/capabilities", candidate, "GET"],
      ["/api/admin/current-affairs", candidate, "GET"],
      ["/api/admin/commerce/products", render, "GET"],
      ["/api/admin/commerce/orders", render, "GET"],
      ["/api/billing/cashfree/webhook", render, "POST"],
      ["/api/tests", student, "GET"],
    ]) {
      const response = await onRequest({
        request: req("https://examtree.in" + path, method,
          method === "POST" ? { body: "{}", headers: { "content-type": "application/json" } } : {}),
        env,
      });
      assert.equal(response.status, 200, path);
      assert.equal(forwarded.at(-1), expected + path, path);
    }
    // Without candidate flag, maintain current behavior; invalid candidate fails closed.
    let response = await onRequest({
      request: req("https://examtree.in/api/admin/session/bootstrap", "POST", { body: "{}" }),
      env: { EXAMTREE_ADMIN_UPSTREAM: "cloud-run-deterministic", EXAMTREE_API_UPSTREAM_ORIGIN: student },
    });
    assert.equal(response.status, 200);
    assert.equal(forwarded.at(-1), student + "/api/admin/session/bootstrap");
    response = await onRequest({
      request: req("https://examtree.in/api/admin/session/bootstrap", "POST", { body: "{}" }),
      env: { ...env, EXAMTREE_ADMIN_CANARY_ORIGIN: "https://attacker.invalid" },
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "ADMIN_CANARY_UPSTREAM_MISCONFIGURED");
  } finally { globalThis.fetch = original; }
});
