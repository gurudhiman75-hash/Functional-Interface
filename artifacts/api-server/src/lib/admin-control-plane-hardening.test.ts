import assert from "node:assert/strict";
import test from "node:test";

import { AdminAccessControlError } from "./admin-access-control";
import {
  assertActiveRoleGrantInserted,
  assertManagerChainSafe,
  escapeCsvCell,
  normalizeAuditPagination,
  resolveAdminAccessTransition,
} from "./admin-control-plane-hardening";

test("duplicate active role grants are rejected before audit creation", () => {
  assert.throws(
    () => assertActiveRoleGrantInserted([]),
    (error) => error instanceof AdminAccessControlError && error.code === "ACTIVE_ROLE_GRANT_EXISTS",
  );
  assert.doesNotThrow(() => assertActiveRoleGrantInserted([{ id: "grant" }]));
});

test("administrator actions resolve exact persisted account states", () => {
  assert.deepEqual(resolveAdminAccessTransition({
    action: "suspend",
    currentStatus: "active",
    currentIsSuspended: false,
    hasFirebaseIdentity: true,
  }), { status: "suspended", isSuspended: true, revokesSessions: true });

  assert.deepEqual(resolveAdminAccessTransition({
    action: "restore",
    currentStatus: "suspended",
    currentIsSuspended: true,
    hasFirebaseIdentity: true,
  }), { status: "active", isSuspended: false, revokesSessions: false });

  assert.deepEqual(resolveAdminAccessTransition({
    action: "activate",
    currentStatus: "disabled",
    currentIsSuspended: true,
    hasFirebaseIdentity: false,
  }), { status: "invited", isSuspended: false, revokesSessions: false });

  assert.deepEqual(resolveAdminAccessTransition({
    action: "revoke-sessions",
    currentStatus: "active",
    currentIsSuspended: false,
    hasFirebaseIdentity: true,
  }), { status: "active", isSuspended: false, revokesSessions: true });
});

test("direct and indirect reporting-line cycles are rejected", () => {
  const target = "11111111-1111-4111-8111-111111111111";
  assert.throws(
    () => assertManagerChainSafe(target, ["22222222-2222-4222-8222-222222222222", target]),
    (error) => error instanceof AdminAccessControlError && error.code === "ADMIN_MANAGER_CYCLE",
  );
  assert.doesNotThrow(() => assertManagerChainSafe(target, ["22222222-2222-4222-8222-222222222222"]));
});

test("audit pagination falls back safely and caps offsets", () => {
  assert.deepEqual(normalizeAuditPagination("not-a-number", "0"), { page: 1, pageSize: 50, offset: 0 });
  assert.deepEqual(normalizeAuditPagination("2", "500"), { page: 2, pageSize: 200, offset: 200 });
  const capped = normalizeAuditPagination(Number.MAX_SAFE_INTEGER, 200);
  assert.equal(capped.offset <= 1_000_000, true);
  assert.equal(Number.isSafeInteger(capped.offset), true);
});

test("CSV cells neutralize spreadsheet formula prefixes", () => {
  assert.equal(escapeCsvCell("=HYPERLINK(\"https://example.com\")"), "\"'=HYPERLINK(\"\"https://example.com\"\")\"");
  assert.equal(escapeCsvCell("  +SUM(1,2)"), "\"'  +SUM(1,2)\"");
  assert.equal(escapeCsvCell("safe text"), "\"safe text\"");
});
