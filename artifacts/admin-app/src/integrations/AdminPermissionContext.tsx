import { createContext, useContext, type ReactNode } from 'react';

export type AdminSession = {
  user: {
    id: string;
    firebaseUid: string;
    email: string;
    displayName: string;
  };
  profile: {
    userId: string;
    employeeCode: string;
    department: string | null;
    title: string | null;
  };
  roles: string[];
  permissions: string[];
  firstAdministrator?: boolean;
  pendingRoleAssignment?: boolean;
};

const AdminPermissionContext = createContext<AdminSession | null>(null);

export function AdminPermissionProvider({ session, children }: { session: AdminSession; children: ReactNode }) {
  return <AdminPermissionContext.Provider value={session}>{children}</AdminPermissionContext.Provider>;
}

export function useAdminPermissions() {
  const session = useContext(AdminPermissionContext);
  const hasPermission = (permission: string) => Boolean(
    session?.roles.includes('super_admin')
      || session?.permissions.includes('*')
      || session?.permissions.includes(permission),
  );
  return { session, permissions: session?.permissions ?? [], hasPermission };
}
