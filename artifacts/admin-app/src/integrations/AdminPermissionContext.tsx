import { createContext, useContext, type ReactNode } from 'react';

export type AdminSession = {
  user: { id: string; firebaseUid: string; email: string | null };
  profile: { id: string; displayName: string | null };
  roles: string[];
  permissions: string[];
};

const AdminPermissionContext = createContext<AdminSession | null>(null);

export function AdminPermissionProvider({ session, children }: { session: AdminSession; children: ReactNode }) {
  return <AdminPermissionContext.Provider value={session}>{children}</AdminPermissionContext.Provider>;
}

export function useAdminPermissions() {
  const session = useContext(AdminPermissionContext);
  const hasPermission = (permission: string) => Boolean(
    session?.permissions.includes('*') || session?.permissions.includes(permission),
  );
  return { session, permissions: session?.permissions ?? [], hasPermission };
}
