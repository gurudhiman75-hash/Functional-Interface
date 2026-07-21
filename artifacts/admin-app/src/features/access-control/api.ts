import { getFirebaseAuth } from '@/integrations/firebase';

export interface AdminRoleGrant {
  grantId: string;
  id: string;
  key: string;
  name: string;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
}

export interface AdminMember {
  id: string;
  email: string;
  displayName: string;
  status: 'active' | 'invited' | 'suspended' | 'disabled';
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  employeeCode: string;
  department: string | null;
  title: string | null;
  managerUserId: string | null;
  managerName: string | null;
  isSuspended: boolean;
  suspendedAt: string | null;
  suspendedReason: string | null;
  roles: AdminRoleGrant[];
  permissions: string[];
  activeSessionCount: number;
  lastActionAt: string | null;
}

export interface AdminRole {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  memberCount: number;
}

export interface AdminPermission {
  id: string;
  key: string;
  description: string | null;
  createdAt: string;
}

export interface ControlPlaneStats {
  total: number;
  active: number;
  invited: number;
  suspended: number;
  customRoles: number;
}

export interface AdminControlPlane {
  members: AdminMember[];
  roles: AdminRole[];
  permissions: AdminPermission[];
  stats: ControlPlaneStats;
  generatedAt: string;
  selectedUserId?: string;
}

export interface RoleCatalog {
  roles: AdminRole[];
  permissions: AdminPermission[];
  selectedRoleId?: string;
  generatedAt: string;
}

export interface AdminInviteInput {
  email: string;
  displayName: string;
  department: string | null;
  title: string | null;
  roleIds: string[];
  reason: string;
}

export interface AdminProfileInput {
  displayName: string;
  department: string | null;
  title: string | null;
  managerUserId: string | null;
  reason: string;
}

export interface RoleDefinitionInput {
  key?: string;
  name: string;
  description: string | null;
  permissionKeys: string[];
  isActive: boolean;
  reason: string;
}

export interface AuditEventSummary {
  id: string;
  occurredAt: string;
  actorType: string;
  actorUserId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  effectiveRoleKey: string | null;
  actionKey: string;
  entityType: string;
  entityId: string;
  entityVersionId: string | null;
  requestId: string | null;
  sessionId: string | null;
  correlationId: string | null;
  approvalRequestId: string | null;
  reason: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  changeCount: number;
}

export interface AuditFacets {
  actions: string[];
  entityTypes: string[];
  roles: string[];
  actors: Array<{ id: string; name: string; email: string }>;
}

export interface AuditEventPage {
  events: AuditEventSummary[];
  page: number;
  pageSize: number;
  total: number;
  facets: AuditFacets;
  generatedAt: string;
}

export interface AuditEventChange {
  id: string;
  fieldPath: string;
  beforeValue: unknown;
  afterValue: unknown;
}

export interface AuditEventDetail {
  event: AuditEventSummary;
  changes: AuditEventChange[];
}

export interface AuditFilters {
  page?: number;
  pageSize?: number;
  actorUserId?: string;
  actionKey?: string;
  entityType?: string;
  roleKey?: string;
  search?: string;
  from?: string;
  to?: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function token() {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  return user.getIdToken();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await token()}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string; details?: unknown } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Admin control-plane request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Admin control-plane API returned an empty response.');
  return body;
}

function query(filters: AuditFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

export function getAdminControlPlane() {
  return request<AdminControlPlane>('/admin/access-control/control-plane');
}

export function inviteAdministrator(input: AdminInviteInput) {
  return request<AdminControlPlane>('/admin/access-control/team/invitations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdministrator(userId: string, input: AdminProfileInput) {
  return request<AdminControlPlane>(`/admin/access-control/team/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function assignAdministratorRole(userId: string, roleId: string, validUntil: string | null, reason: string) {
  return request<AdminControlPlane>(`/admin/access-control/team/${encodeURIComponent(userId)}/roles`, {
    method: 'POST',
    body: JSON.stringify({ roleId, validUntil, reason }),
  });
}

export function revokeAdministratorRole(userId: string, roleId: string, reason: string) {
  return request<AdminControlPlane>(`/admin/access-control/team/${encodeURIComponent(userId)}/roles/${encodeURIComponent(roleId)}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}

export function transitionAdministrator(
  userId: string,
  action: 'suspend' | 'restore' | 'disable' | 'activate' | 'revoke-sessions',
  reason: string,
) {
  return request<AdminControlPlane>(`/admin/access-control/team/${encodeURIComponent(userId)}/actions/${action}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function getRoleCatalog() {
  return request<RoleCatalog>('/admin/access-control/roles');
}

export function createAdministratorRole(input: RoleDefinitionInput & { key: string }) {
  return request<RoleCatalog>('/admin/access-control/roles', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdministratorRole(roleId: string, input: RoleDefinitionInput) {
  return request<RoleCatalog>(`/admin/access-control/roles/${encodeURIComponent(roleId)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function getAuditEvents(filters: AuditFilters) {
  return request<AuditEventPage>(`/admin/access-control/audit-events${query(filters)}`);
}

export function getAuditEvent(auditEventId: string) {
  return request<AuditEventDetail>(`/admin/access-control/audit-events/${encodeURIComponent(auditEventId)}`);
}

export async function downloadAuditCsv(filters: AuditFilters) {
  const response = await fetch(`${apiBase}/admin/access-control/audit-events/export.csv${query(filters)}`, {
    headers: { Authorization: `Bearer ${await token()}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `Audit export failed (${response.status}).`);
  }
  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const filename = disposition.match(/filename="([^"]+)"/)?.[1] || 'examtree-audit.csv';
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
