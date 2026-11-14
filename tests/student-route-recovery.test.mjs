import assert from "node:assert/strict";
import { test } from "node:test";
import { isRouteChunkError, loadRouteModule, recoverStaleRoute } from "../artifacts/examtree/src/lib/route-recovery.ts";

const missingChunk = () => new TypeError("Failed to fetch dynamically imported module: https://examtree.in/assets/resources-old.js");
const immediate = async () => {};

function browser(pathname = "/resources") {
  const entries = new Map();
  let reloads = 0;
  return {
    pathname, online: true,
    storage: { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) },
    reload: () => { reloads++; },
    get reloads() { return reloads; },
  };
}

test("transient route downloads recover without a reload or a detour home", async () => {
  let attempts = 0;
  let recoveries = 0;
  const expected = { default: () => "Resources" };
  const result = await loadRouteModule(async () => {
    if (++attempts === 1) throw missingChunk();
    return expected;
  }, { wait: immediate, recover: () => { recoveries++; return true; } });
  assert.equal(result, expected);
  assert.equal(attempts, 2);
  assert.equal(recoveries, 0);
});

test("stale deployed chunks trigger one reload of the existing destination", async () => {
  const current = browser("/category/SSC");
  let attempts = 0;
  const load = () => loadRouteModule(async () => { attempts++; throw missingChunk(); }, {
    wait: immediate, recover: error => recoverStaleRoute(error, current, 100_000),
  });
  await assert.rejects(load(), /dynamically imported/);
  await assert.rejects(load(), /dynamically imported/);
  assert.equal(attempts, 4);
  assert.equal(current.reloads, 1);
  assert.equal(current.pathname, "/category/SSC");
  assert.equal(recoverStaleRoute(missingChunk(), current, 160_001), true);
});

test("render bugs and API failures are not hidden by retries or reloads", async () => {
  for (const error of [new Error("Cannot read properties of undefined"), new TypeError("Failed to fetch"), new Error("API unavailable (503)")]) {
    let calls = 0;
    const current = browser();
    await assert.rejects(loadRouteModule(async () => { calls++; throw error; }, {
      wait: immediate, recover: e => recoverStaleRoute(e, current),
    }), e => e === error);
    assert.equal(calls, 1);
    assert.equal(current.reloads, 0);
  }
});

test("persistent failures never automatically reload active tests or payment flows", async () => {
  for (const path of ["/test/attempt-42", "/result", "/checkout/package-1", "/orders/order-1"]) {
    const current = browser(path);
    await assert.rejects(loadRouteModule(async () => { throw missingChunk(); }, {
      wait: immediate, recover: error => recoverStaleRoute(error, current),
    }));
    assert.equal(current.reloads, 0, path);
  }
});

test("offline or blocked storage keeps manual recovery without a reload loop", () => {
  const offline = browser();
  offline.online = false;
  assert.equal(recoverStaleRoute(missingChunk(), offline), false);
  const blocked = browser();
  blocked.storage.setItem = () => { throw new Error("SecurityError"); };
  assert.equal(recoverStaleRoute(missingChunk(), blocked), false);
  assert.equal(blocked.reloads, 0);
});

test("Chrome, Safari, Firefox and CSS chunk failures are recognized narrowly", () => {
  for (const message of ["error loading dynamically imported module", "Importing a module script failed.", "Unable to preload CSS for /assets/route.css", "Loading chunk 42 failed."]) {
    assert.equal(isRouteChunkError(new Error(message)), true, message);
  }
  assert.equal(isRouteChunkError(null), false);
  assert.equal(isRouteChunkError(new SyntaxError("Unexpected token in question content")), false);
});
