import assert from "node:assert/strict";
import { test } from "node:test";
import { getRestoredAuthHeader } from "../artifacts/examtree/src/lib/restored-auth-header.ts";

test("a cold signed-in request waits for session restoration before deciding its auth header", async () => {
  let finishRestore;
  let tokenRequests = 0;
  const ready = new Promise(resolve => { finishRestore = resolve; });
  const auth = { currentUser: null, authStateReady: () => ready };
  let settled = false;
  const request = getRestoredAuthHeader(auth).then(header => { settled = true; return header; });
  await Promise.resolve();
  assert.equal(settled, false);
  assert.equal(tokenRequests, 0);
  auth.currentUser = { getIdToken: async () => { tokenRequests++; return "restored-session-token"; } };
  finishRestore();
  assert.deepEqual(await request, { Authorization: "Bearer restored-session-token" });
  assert.equal(tokenRequests, 1);
});

test("restoration that resolves signed out does not reuse a stale local user", async () => {
  const auth = { currentUser: { getIdToken: async () => "stale-token" }, authStateReady: async () => { auth.currentUser = null; } };
  assert.deepEqual(await getRestoredAuthHeader(auth), {});
});

test("token and initialization failures are surfaced instead of sending an unsigned request", async () => {
  const tokenError = new Error("Token refresh failed");
  await assert.rejects(getRestoredAuthHeader({
    authStateReady: async () => {}, currentUser: { getIdToken: async () => { throw tokenError; } },
  }), error => error === tokenError);
  const initError = new Error("Session restoration failed");
  await assert.rejects(getRestoredAuthHeader({
    authStateReady: async () => { throw initError; }, currentUser: null,
  }), error => error === initError);
});

test("missing Firebase configuration remains an anonymous request", async () => {
  assert.deepEqual(await getRestoredAuthHeader(null), {});
});
