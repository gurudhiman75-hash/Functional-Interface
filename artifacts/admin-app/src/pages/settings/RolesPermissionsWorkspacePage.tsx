import { useEffect, useMemo, useState } from 'react';
import { Check, KeyRound, Loader2, Lock, Plus, RefreshCw, Save, ShieldCheck, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAdminControlPlane } from '@/features/access-control/useAdminControlPlane';
import type { AdminPermission, AdminRole } from '@/features/access-control/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

function permissionGroup(key: string) {
  const first = key.split('.')[0] || 'other';
  const labels: Record<string, string> = {
    content: 'Content', tests: 'Tests', users: 'Users', settings: 'Settings',
    audit: 'Audit', analytics: 'Analytics', commerce: 'Commerce', support: 'Support',
    jobs: 'Operations', dashboard: 'Overview',
  };
  return labels[first] ?? first.charAt(0).toUpperCase() + first.slice(1);
}

function roleTone(role: AdminRole): 'destructive' | 'primary' | 'info' | 'success' | 'warning' | 'neutral' {
  if (role.key === 'super_admin') return 'destructive';
  if (!role.isActive) return 'neutral';
  if (role.key.includes('content')) return 'primary';
  if (role.key.includes('test')) return 'info';
  if (role.key.includes('support')) return 'warning';
  if (role.key.includes('analyst')) return 'success';
  return 'neutral';
}

export function RolesPermissionsWorkspacePage() {
  const workspace = useAdminControlPlane();
  const { hasPermission } = useAdminPermissions();
  const canManage = hasPermission('settings.roles.manage');
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [permissionKeys, setPermissionKeys] = useState<string[]>([]);
  const [reason, setReason] = useState('Update the canonical administrator permission model');
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPermissionKeys, setNewPermissionKeys] = useState<string[]>([]);
  const [newReason, setNewReason] = useState('Create a scoped administrator role for ExamTree operations');

  useEffect(() => {
    if (!workspace.selectedRole) return;
    setName(workspace.selectedRole.name);
    setDescription(workspace.selectedRole.description ?? '');
    setIsActive(workspace.selectedRole.isActive);
    setPermissionKeys(workspace.selectedRole.permissions);
  }, [workspace.selectedRole]);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, AdminPermission[]>();
    workspace.permissions.forEach((permission) => {
      const group = permissionGroup(permission.key);
      groups.set(group, [...(groups.get(group) ?? []), permission]);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [workspace.permissions]);

  const run = async (operation: () => Promise<unknown>, success: string) => {
    try {
      await operation();
      showToast.success(success);
    } catch (error) {
      showToast.error('Role operation failed', error instanceof Error ? error.message : 'The role operation failed.');
    }
  };

  const toggle = (key: string, checked: boolean, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((current) => checked ? Array.from(new Set([...current, key])).sort() : current.filter((permission) => permission !== key));
  };

  const selectAll = (group: AdminPermission[], checked: boolean, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const keys = group.map((permission) => permission.key);
    setter((current) => checked
      ? Array.from(new Set([...current, ...keys])).sort()
      : current.filter((permission) => !keys.includes(permission)));
  };

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Server-authoritative role definitions and granular permissions for every administrator workflow."
        icon={<Lock className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void workspace.refresh()} disabled={workspace.loading}><RefreshCw className="mr-1.5 h-4 w-4" />Refresh</Button>
            {canManage && <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Create role</Button>}
          </div>
        }
      />

      {workspace.error && <Card className="mb-4 border-destructive/40"><CardContent className="p-4 text-sm text-destructive">{workspace.error}</CardContent></Card>}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><ShieldCheck className="h-5 w-5 text-primary" /><div><p className="text-2xl font-semibold">{workspace.roles.length}</p><p className="text-xs text-muted-foreground">Canonical roles</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><KeyRound className="h-5 w-5 text-info" /><div><p className="text-2xl font-semibold">{workspace.permissions.length}</p><p className="text-xs text-muted-foreground">Granular permissions</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-success" /><div><p className="text-2xl font-semibold">{workspace.roles.reduce((sum, role) => sum + role.memberCount, 0)}</p><p className="text-xs text-muted-foreground">Active grants</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Plus className="h-5 w-5 text-warning" /><div><p className="text-2xl font-semibold">{workspace.stats.customRoles}</p><p className="text-xs text-muted-foreground">Custom roles</p></div></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.5fr)]">
        <Card>
          <CardHeader><CardTitle className="text-base">Role catalogue</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {workspace.loading && <div className="flex items-center justify-center py-12 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading roles…</div>}
            {workspace.roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => workspace.setSelectedRoleId(role.id)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/40',
                  workspace.selectedRoleId === role.id && 'border-primary/50 bg-primary/5 ring-1 ring-primary/20',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">{role.name}</p>
                      {role.isSystem && <Badge variant="outline" className="text-[10px]">System</Badge>}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">{role.key}</p>
                  </div>
                  <StatusBadge tone={roleTone(role)} dot>{role.isActive ? 'Active' : 'Inactive'}</StatusBadge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{role.description || 'No description'}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>{role.permissions.length} permissions</span><span>{role.memberCount} members</span></div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div><CardTitle className="text-base">Permission editor</CardTitle><p className="mt-1 text-xs text-muted-foreground">Changes are enforced immediately by backend middleware and recorded in immutable audit events.</p></div>
              {workspace.selectedRole?.key === 'super_admin' && <StatusBadge tone="destructive"><Lock className="mr-1 h-3 w-3" />Protected</StatusBadge>}
            </div>
          </CardHeader>
          <CardContent>
            {!workspace.selectedRole ? (
              <p className="text-sm text-muted-foreground">Select a role to inspect its permissions.</p>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label>Role name</Label><Input value={name} onChange={(event) => setName(event.target.value)} disabled={!canManage} /></div>
                  <div><Label>Stable key</Label><Input value={workspace.selectedRole.key} disabled className="font-mono" /></div>
                </div>
                <div><Label>Description</Label><Textarea value={description} onChange={(event) => setDescription(event.target.value)} disabled={!canManage} /></div>
                <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                  <input type="checkbox" checked={isActive} disabled={!canManage || workspace.selectedRole.key === 'super_admin'} onChange={(event) => setIsActive(event.target.checked)} />
                  <span><span className="font-medium">Role is active</span><span className="block text-xs text-muted-foreground">Inactive roles cannot authorize new or existing grants.</span></span>
                </label>

                <div className="space-y-4">
                  {groupedPermissions.map(([groupName, permissions]) => {
                    const selectedCount = permissions.filter((permission) => permissionKeys.includes(permission.key)).length;
                    const allSelected = selectedCount === permissions.length;
                    return (
                      <div key={groupName} className="rounded-lg border">
                        <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
                          <div><p className="text-sm font-semibold">{groupName}</p><p className="text-[11px] text-muted-foreground">{selectedCount} of {permissions.length} enabled</p></div>
                          {canManage && workspace.selectedRole?.key !== 'super_admin' && (
                            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={allSelected} onChange={(event) => selectAll(permissions, event.target.checked, setPermissionKeys)} />All</label>
                          )}
                        </div>
                        <div className="grid gap-0 sm:grid-cols-2">
                          {permissions.map((permission) => (
                            <label key={permission.id} className="flex cursor-pointer items-start gap-2 border-b p-3 last:border-0 sm:odd:border-r">
                              <input
                                type="checkbox"
                                className="mt-1"
                                checked={permissionKeys.includes(permission.key)}
                                disabled={!canManage || workspace.selectedRole?.key === 'super_admin'}
                                onChange={(event) => toggle(permission.key, event.target.checked, setPermissionKeys)}
                              />
                              <span className="min-w-0"><span className="block break-all font-mono text-xs font-medium">{permission.key}</span><span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{permission.description || 'Canonical capability'}</span></span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {canManage && (
                  <div className="space-y-3 border-t pt-4">
                    <div><Label>Change reason</Label><Textarea value={reason} onChange={(event) => setReason(event.target.value)} /></div>
                    <Button disabled={!name || workspace.mutating} onClick={() => void run(() => workspace.saveRole(workspace.selectedRole!.id, {
                      name, description: description || null, permissionKeys, isActive, reason,
                    }), 'Role permissions updated')}>
                      {workspace.mutating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save role
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader><SheetTitle>Create custom role</SheetTitle><SheetDescription>Create a reusable server-enforced role from the canonical permission catalogue.</SheetDescription></SheetHeader>
          <div className="mt-6 space-y-4">
            <div><Label>Name</Label><Input value={newName} onChange={(event) => { setNewName(event.target.value); if (!newKey) setNewKey(event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_')); }} /></div>
            <div><Label>Stable key</Label><Input value={newKey} onChange={(event) => setNewKey(event.target.value)} className="font-mono" /></div>
            <div><Label>Description</Label><Textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} /></div>
            <div className="space-y-3">
              {groupedPermissions.map(([groupName, permissions]) => (
                <div key={groupName} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold">{groupName}</p><label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={permissions.every((permission) => newPermissionKeys.includes(permission.key))} onChange={(event) => selectAll(permissions, event.target.checked, setNewPermissionKeys)} />All</label></div>
                  <div className="space-y-2">{permissions.map((permission) => <label key={permission.id} className="flex items-start gap-2 text-xs"><input type="checkbox" className="mt-0.5" checked={newPermissionKeys.includes(permission.key)} onChange={(event) => toggle(permission.key, event.target.checked, setNewPermissionKeys)} /><span><span className="font-mono font-medium">{permission.key}</span><span className="block text-muted-foreground">{permission.description}</span></span></label>)}</div>
                </div>
              ))}
            </div>
            <div><Label>Creation reason</Label><Textarea value={newReason} onChange={(event) => setNewReason(event.target.value)} /></div>
            <Button className="w-full" disabled={!newKey || !newName || workspace.mutating} onClick={() => void run(async () => {
              await workspace.createRole({ key: newKey, name: newName, description: newDescription || null, permissionKeys: newPermissionKeys, isActive: true, reason: newReason });
              setCreateOpen(false);
              setNewKey(''); setNewName(''); setNewDescription(''); setNewPermissionKeys([]);
            }, 'Custom role created')}>
              {workspace.mutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create role
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
