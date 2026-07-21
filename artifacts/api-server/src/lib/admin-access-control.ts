export class AdminAccessControlError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AdminAccessControlError";
  }
}

export type AdminInviteInput = {
  email: string;
  displayName: string;
  department: string | null;
  title: string | null;
  roleIds: string[];
  reason: string;
};

export type AdminProfileUpdateInput = {
  displayName: string;
  department: string | null;
  title: string | null;
  managerUserId: string | null;
  reason: string;
};

export type RoleDefinitionInput = {
  key: string;
  name: string;
  description: string | null;
  permissionKeys: string[];
  isActive: boolean;
  reason: string;
};

export type RoleAssignmentInput = {
  roleId: string;
  validUntil: string | null;
  reason: string;
};

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AdminAccessControlError("INVALID_REQUEST_BODY", "A JSON object is required");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, maximum: number, required = false): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (required && !normalized) {
    throw new AdminAccessControlError("FIELD_REQUIRED", `${field} is required`, 400, { field });
  }
  if (normalized.length > maximum) {
    throw new AdminAccessControlError("FIELD_TOO_LONG", `${field} is too long`, 400, { field, maximum });
  }
  return normalized;
}

function nullableText(value: unknown, field: string, maximum: number): string | null {
  const normalized = text(value, field, maximum);
  return normalized || null;
}

function stringList(value: unknown, field: string, maximum = 100): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new AdminAccessControlError("INVALID_LIST", `${field} must be an array`, 400, { field });
  }
  const normalized = Array.from(new Set(value.map((item) => text(item, field, 160, true))));
  if (normalized.length > maximum) {
    throw new AdminAccessControlError("LIST_TOO_LONG", `${field} contains too many values`, 400, { field, maximum });
  }
  return normalized;
}

export function assertUuid(value: unknown, field = "id"): string {
  const normalized = text(value, field, 80, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)) {
    throw new AdminAccessControlError("INVALID_IDENTIFIER", `${field} is invalid`, 400, { field });
  }
  return normalized;
}

export function normalizeReason(value: unknown, fallback?: string): string {
  const normalized = text(value, "reason", 500);
  const resolved = normalized || fallback?.trim() || "";
  if (resolved.length < 8) {
    throw new AdminAccessControlError(
      "REASON_REQUIRED",
      "A meaningful reason of at least 8 characters is required",
      400,
      { field: "reason" },
    );
  }
  return resolved;
}

export function normalizeAdminInvite(value: unknown): AdminInviteInput {
  const input = record(value);
  const email = text(input.email, "email", 320, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AdminAccessControlError("INVALID_ADMIN_EMAIL", "Enter a valid administrator email address");
  }
  const displayName = text(input.displayName, "displayName", 160, true);
  const roleIds = stringList(input.roleIds, "roleIds", 20).map((id) => assertUuid(id, "roleIds"));
  if (roleIds.length === 0) {
    throw new AdminAccessControlError("ADMIN_ROLE_REQUIRED", "Assign at least one active role");
  }
  return {
    email,
    displayName,
    department: nullableText(input.department, "department", 120),
    title: nullableText(input.title, "title", 120),
    roleIds,
    reason: normalizeReason(input.reason, `Invite ${displayName} to the ExamTree admin team`),
  };
}

export function normalizeAdminProfileUpdate(value: unknown): AdminProfileUpdateInput {
  const input = record(value);
  return {
    displayName: text(input.displayName, "displayName", 160, true),
    department: nullableText(input.department, "department", 120),
    title: nullableText(input.title, "title", 120),
    managerUserId: input.managerUserId ? assertUuid(input.managerUserId, "managerUserId") : null,
    reason: normalizeReason(input.reason),
  };
}

export function normalizeRoleKey(value: unknown): string {
  const key = text(value, "key", 80, true)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!/^[a-z][a-z0-9._-]{2,79}$/.test(key)) {
    throw new AdminAccessControlError(
      "INVALID_ROLE_KEY",
      "Role key must start with a letter and contain at least 3 safe characters",
    );
  }
  return key;
}

export function normalizeRoleDefinition(value: unknown, options: { keyRequired: boolean }): RoleDefinitionInput {
  const input = record(value);
  return {
    key: options.keyRequired ? normalizeRoleKey(input.key) : text(input.key, "key", 80),
    name: text(input.name, "name", 120, true),
    description: nullableText(input.description, "description", 500),
    permissionKeys: stringList(input.permissionKeys, "permissionKeys", 200).sort(),
    isActive: input.isActive === undefined ? true : input.isActive === true,
    reason: normalizeReason(input.reason),
  };
}

export function normalizeRoleAssignment(value: unknown): RoleAssignmentInput {
  const input = record(value);
  let validUntil: string | null = null;
  if (input.validUntil) {
    const parsed = new Date(String(input.validUntil));
    if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
      throw new AdminAccessControlError("INVALID_ROLE_EXPIRY", "Role expiry must be a future date and time");
    }
    validUntil = parsed.toISOString();
  }
  return {
    roleId: assertUuid(input.roleId, "roleId"),
    validUntil,
    reason: normalizeReason(input.reason),
  };
}

export function assertFinalSuperAdminSafe(input: {
  targetHasSuperAdmin: boolean;
  activeSuperAdminCount: number;
  action: string;
}): void {
  if (input.targetHasSuperAdmin && input.activeSuperAdminCount <= 1) {
    throw new AdminAccessControlError(
      "FINAL_SUPER_ADMIN_PROTECTED",
      `Cannot ${input.action} the final active super administrator`,
      409,
    );
  }
}

export function assertSuperAdminRoleSafe(input: {
  roleKey: string;
  isActive: boolean;
  permissionKeys: string[];
  allPermissionKeys: string[];
}): void {
  if (input.roleKey !== "super_admin") return;
  const missing = input.allPermissionKeys.filter((permission) => !input.permissionKeys.includes(permission));
  if (!input.isActive || missing.length > 0) {
    throw new AdminAccessControlError(
      "SUPER_ADMIN_ROLE_PROTECTED",
      "The super administrator role must remain active with every canonical permission",
      409,
      { missingPermissions: missing },
    );
  }
}
