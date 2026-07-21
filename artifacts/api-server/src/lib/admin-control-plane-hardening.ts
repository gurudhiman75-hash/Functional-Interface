import { AdminAccessControlError } from "./admin-access-control";

export type AdminAccessAction = "suspend" | "restore" | "disable" | "activate" | "revoke-sessions";

export type AdminAccessTransition = {
  status: string;
  isSuspended: boolean;
  revokesSessions: boolean;
};

const DEFAULT_AUDIT_PAGE = 1;
const DEFAULT_AUDIT_PAGE_SIZE = 50;
const MAX_AUDIT_PAGE_SIZE = 200;
const MAX_AUDIT_OFFSET = 1_000_000;

export function assertActiveRoleGrantInserted(insertedRows: readonly unknown[]): void {
  if (insertedRows.length > 0) return;
  throw new AdminAccessControlError(
    "ACTIVE_ROLE_GRANT_EXISTS",
    "This administrator already has an active grant for the selected role",
    409,
  );
}

export function resolveAdminAccessTransition(input: {
  action: AdminAccessAction;
  currentStatus: string;
  currentIsSuspended: boolean;
  hasFirebaseIdentity: boolean;
}): AdminAccessTransition {
  if (input.action === "suspend") {
    return { status: "suspended", isSuspended: true, revokesSessions: true };
  }
  if (input.action === "disable") {
    return { status: "disabled", isSuspended: true, revokesSessions: true };
  }
  if (input.action === "restore" || input.action === "activate") {
    return {
      status: input.hasFirebaseIdentity ? "active" : "invited",
      isSuspended: false,
      revokesSessions: false,
    };
  }
  return {
    status: input.currentStatus,
    isSuspended: input.currentIsSuspended,
    revokesSessions: true,
  };
}

export function assertManagerChainSafe(targetUserId: string, managerChainUserIds: readonly string[]): void {
  if (!managerChainUserIds.includes(targetUserId)) return;
  throw new AdminAccessControlError(
    "ADMIN_MANAGER_CYCLE",
    "The selected reporting line would create a management cycle",
    409,
  );
}

function positiveInteger(value: unknown, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || !Number.isInteger(numeric) || numeric <= 0) return fallback;
  return numeric;
}

export function normalizeAuditPagination(pageValue: unknown, pageSizeValue: unknown): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const pageSize = Math.min(MAX_AUDIT_PAGE_SIZE, positiveInteger(pageSizeValue, DEFAULT_AUDIT_PAGE_SIZE));
  const requestedPage = positiveInteger(pageValue, DEFAULT_AUDIT_PAGE);
  const maximumPage = Math.floor(MAX_AUDIT_OFFSET / pageSize) + 1;
  const page = Math.min(requestedPage, maximumPage);
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export function neutralizeSpreadsheetFormula(value: unknown): string {
  const text = String(value ?? "");
  return /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
}

export function escapeCsvCell(value: unknown): string {
  return `"${neutralizeSpreadsheetFormula(value).replaceAll('"', '""')}"`;
}
