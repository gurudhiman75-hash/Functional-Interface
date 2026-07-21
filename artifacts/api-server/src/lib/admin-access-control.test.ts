import assert from "node:assert/strict";
import test from "node:test";

import {
  AdminAccessControlError,
  assertFinalSuperAdminSafe,
  assertSuperAdminRoleSafe,
  normalizeAdminInvite,
  normalizeRoleAssignment,
  normalizeRoleDefinition,
} from "./admin-access-control";

const roleId = "11111111-1111-4111-8111-111111111111";

test("admin invites normalize identity, roles and profile fields", () => {
  const invite = normalizeAdminInvite({
    email: " Editor@Example.com ",
    displayName: " Editorial Lead ",
    department: "Content",
    title: "Lead Reviewer",
    roleIds: [roleId, roleId],
    reason: "Add the new editorial lead",
  });
  assert.equal(invite.email, "editor@example.com");
  assert.equal(invite.displayName, "Editorial Lead");
  assert.deepEqual(invite.roleIds, [roleId]);
});

test("admin invites require at least one canonical role", () => {
  assert.throws(
    () => normalizeAdminInvite({ email: "editor@example.com", displayName: "Editor", roleIds: [] }),
    (error) => error instanceof AdminAccessControlError && error.code === "ADMIN_ROLE_REQUIRED",
  );
});

test("custom role definitions normalize stable keys and permissions", () => {
  const role = normalizeRoleDefinition({
    key: "Senior Content Reviewer",
    name: "Senior Content Reviewer",
    description: "Reviews high-risk content",
    permissionKeys: ["content.questions.read", "audit.read", "audit.read"],
    reason: "Create a senior review role",
  }, { keyRequired: true });
  assert.equal(role.key, "senior_content_reviewer");
  assert.deepEqual(role.permissionKeys, ["audit.read", "content.questions.read"]);
});

test("role assignments reject expired grants", () => {
  assert.throws(
    () => normalizeRoleAssignment({ roleId, validUntil: "2020-01-01T00:00:00.000Z", reason: "Temporary role grant" }),
    (error) => error instanceof AdminAccessControlError && error.code === "INVALID_ROLE_EXPIRY",
  );
});

test("final active super administrator cannot be removed", () => {
  assert.throws(
    () => assertFinalSuperAdminSafe({ targetHasSuperAdmin: true, activeSuperAdminCount: 1, action: "suspend" }),
    (error) => error instanceof AdminAccessControlError && error.code === "FINAL_SUPER_ADMIN_PROTECTED",
  );
  assert.doesNotThrow(() => assertFinalSuperAdminSafe({
    targetHasSuperAdmin: true,
    activeSuperAdminCount: 2,
    action: "suspend",
  }));
});

test("super administrator role always retains every permission", () => {
  assert.throws(
    () => assertSuperAdminRoleSafe({
      roleKey: "super_admin",
      isActive: true,
      permissionKeys: ["audit.read"],
      allPermissionKeys: ["audit.read", "settings.roles.manage"],
    }),
    (error) => error instanceof AdminAccessControlError && error.code === "SUPER_ADMIN_ROLE_PROTECTED",
  );
  assert.doesNotThrow(() => assertSuperAdminRoleSafe({
    roleKey: "content_admin",
    isActive: false,
    permissionKeys: [],
    allPermissionKeys: ["audit.read"],
  }));
});
