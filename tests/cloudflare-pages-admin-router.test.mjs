import assert from "node:assert/strict";
import test from "node:test";
import { onRequest } from "../functions/admin/[[path]].js";

const URL_BASE = "https://functional-interface.pages.dev";
const indexHTML = '<!doctype html><html><head><script type="module" src="/admin/assets/index-abc123.js"></script></head><body><div id="root"></div></body></html>';

function envWith(body = indexHTML, status = 200) {
  const fetched = [];
  return {
    fetched,
    env: {
      ASSETS: {
        async fetch(url) {
          fetched.push(url.toString());
          return new Response(body, { status, headers: { "Content-Type": "text/html" } });
        },
      },
    },
  };
}

test("bare /admin redirects to the canonical admin entry rather than returning 404", async () => {
  const { env, fetched } = envWith();
  const req = new Request(URL_BASE + "/admin", { method: "GET" });
  const res = await onRequest({ request: req, env });
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("Location"), URL_BASE + "/admin/");
  assert.deepEqual(fetched, []);
});

test("admin root with trailing slash serves the admin SPA", async () => {
  const { env, fetched } = envWith();
  const res = await onRequest({ request: new Request(URL_BASE + "/admin/"), env });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), indexHTML);
  assert.deepEqual(fetched, [URL_BASE + "/admin/"]);
});

test("deep admin navigation uses /admin/ directory shell without redirect loop", async () => {
  const { env, fetched } = envWith();
  const req = new Request(URL_BASE + "/admin/question-studio", { method: "GET" });
  const res = await onRequest({ request: req, env });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("Content-Type") ?? "", /text\/html/);
  assert.equal(res.headers.get("Cache-Control"), "private, no-store");
  assert.equal(await res.text(), indexHTML);
  assert.deepEqual(fetched, [URL_BASE + "/admin/"]);
});

test("unknown admin deep route still returns admin HTML, not student SPA", async () => {
  const { env } = envWith();
  const res = await onRequest({ request: new Request(URL_BASE + "/admin/roles/manage"), env });
  assert.equal(res.status, 200);
});
test("missing/incorrect admin shell fails closed", async () => {
  const { env } = envWith('<html><script src="/assets/student.js"></script></html>');
  const res = await onRequest({ request: new Request(URL_BASE + "/admin/question-studio"), env });
  assert.equal(res.status, 503);
});
test("admin file requests never serve SPA HTML", async () => {
  const { env, fetched } = envWith();
  for (const path of ["/admin/assets/missing.js", "/admin/logo.svg"]) {
    const res = await onRequest({ request: new Request(URL_BASE + path), env });
    assert.equal(res.status, 404);
  }
  assert.deepEqual(fetched, []);
});
test("unsupported admin write method rejected", async () => {
  const { env } = envWith();
  const res = await onRequest({ request: new Request(URL_BASE + "/admin/question-studio", { method: "POST" }), env });
  assert.equal(res.status, 405);
});
