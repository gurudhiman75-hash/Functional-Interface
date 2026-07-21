import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  assignAdministratorRole,
  createAdministratorRole,
  getAdminControlPlane,
  inviteAdministrator,
  revokeAdministratorRole,
  transitionAdministrator,
  updateAdministrator,
  updateAdministratorRole,
  type AdminControlPlane,
  type AdminInviteInput,
  type AdminProfileInput,
  type RoleDefinitionInput,
} from './api';

const EMPTY: AdminControlPlane = {
  members: [],
  roles: [],
  permissions: [],
  stats: { total: 0, active: 0, invited: 0, suspended: 0, customRoles: 0 },
  generatedAt: '',
};

export function useAdminControlPlane() {
  const [data, setData] = useState<AdminControlPlane>(EMPTY);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback((next: AdminControlPlane) => {
    setData(next);
    setSelectedUserId((current) => next.selectedUserId
      || (current && next.members.some((member) => member.id === current) ? current : next.members[0]?.id ?? null));
    setSelectedRoleId((current) => current && next.roles.some((role) => role.id === current)
      ? current
      : next.roles[0]?.id ?? null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      apply(await getAdminControlPlane());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load the admin control plane.');
    } finally {
      setLoading(false);
    }
  }, [apply]);

  useEffect(() => { void refresh(); }, [refresh]);

  const mutate = useCallback(async (operation: () => Promise<AdminControlPlane>) => {
    setMutating(true);
    setError(null);
    try {
      const next = await operation();
      apply(next);
      return next;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Administrator operation failed.';
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [apply]);

  const invite = useCallback((input: AdminInviteInput) => mutate(() => inviteAdministrator(input)), [mutate]);
  const updateProfile = useCallback((userId: string, input: AdminProfileInput) => (
    mutate(() => updateAdministrator(userId, input))
  ), [mutate]);
  const assignRole = useCallback((userId: string, roleId: string, validUntil: string | null, reason: string) => (
    mutate(() => assignAdministratorRole(userId, roleId, validUntil, reason))
  ), [mutate]);
  const revokeRole = useCallback((userId: string, roleId: string, reason: string) => (
    mutate(() => revokeAdministratorRole(userId, roleId, reason))
  ), [mutate]);
  const transition = useCallback((
    userId: string,
    action: 'suspend' | 'restore' | 'disable' | 'activate' | 'revoke-sessions',
    reason: string,
  ) => mutate(() => transitionAdministrator(userId, action, reason)), [mutate]);

  const createRole = useCallback(async (input: RoleDefinitionInput & { key: string }) => {
    setMutating(true);
    setError(null);
    try {
      const next = await createAdministratorRole(input);
      setData((current) => ({ ...current, roles: next.roles, permissions: next.permissions, generatedAt: next.generatedAt }));
      setSelectedRoleId(next.selectedRoleId ?? next.roles[0]?.id ?? null);
      return next;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create role.');
      throw caught;
    } finally {
      setMutating(false);
    }
  }, []);

  const saveRole = useCallback(async (roleId: string, input: RoleDefinitionInput) => {
    setMutating(true);
    setError(null);
    try {
      const next = await updateAdministratorRole(roleId, input);
      setData((current) => ({ ...current, roles: next.roles, permissions: next.permissions, generatedAt: next.generatedAt }));
      setSelectedRoleId(next.selectedRoleId ?? roleId);
      return next;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update role.');
      throw caught;
    } finally {
      setMutating(false);
    }
  }, []);

  const selectedMember = useMemo(
    () => data.members.find((member) => member.id === selectedUserId) ?? null,
    [data.members, selectedUserId],
  );
  const selectedRole = useMemo(
    () => data.roles.find((role) => role.id === selectedRoleId) ?? null,
    [data.roles, selectedRoleId],
  );

  return {
    ...data,
    selectedUserId,
    setSelectedUserId,
    selectedMember,
    selectedRoleId,
    setSelectedRoleId,
    selectedRole,
    loading,
    mutating,
    error,
    refresh,
    invite,
    updateProfile,
    assignRole,
    revokeRole,
    transition,
    createRole,
    saveRole,
  };
}
