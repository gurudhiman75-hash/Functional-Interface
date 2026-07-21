import { useMemo, useState } from 'react';
import {
  CheckCircle2, KeyRound, Loader2, Lock, MoreVertical, Plus, RefreshCw,
  RotateCcw, ShieldCheck, UserCog, Users, XCircle,
} from 'lucide-react';

import { DataTable, type Column } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAdminControlPlane } from '@/features/access-control/useAdminControlPlane';
import type { AdminMember } from '@/features/access-control/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

function dateLabel(value: string | null) {
  if (!value) return 'Never';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
}

function statusTone(member: AdminMember): 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  if (member.status === 'active' && !member.isSuspended) return 'success';
  if (member.status === 'invited') return 'info';
  if (member.status === 'disabled') return 'destructive';
  if (member.status === 'suspended' || member.isSuspended) return 'warning';
  return 'neutral';
}

function statusLabel(member: AdminMember) {
  if (member.status === 'active' && member.isSuspended) return 'Suspended';
  return member.status.charAt(0).toUpperCase() + member.status.slice(1);
}

export function AdminTeamWorkspacePage() {
  const workspace = useAdminControlPlane();
  const { session, hasPermission } = useAdminPermissions();
  const canManage = hasPermission('users.admins.manage');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('Content');
  const [title, setTitle] = useState('Administrator');
  const [inviteRoleIds, setInviteRoleIds] = useState<string[]>([]);
  const [inviteReason, setInviteReason] = useState('Invite a new administrator to the ExamTree operations team');
  const [roleToAssign, setRoleToAssign] = useState('');
  const [roleExpiry, setRoleExpiry] = useState('');
  const [actionReason, setActionReason] = useState('Operational access update approved by an administrator');
  const [profileName, setProfileName] = useState('');
  const [profileDepartment, setProfileDepartment] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [profileManager, setProfileManager] = useState('none');

  const members = useMemo(() => workspace.members.filter((member) => (
    statusFilter === 'all'
      || (statusFilter === 'suspended' ? member.isSuspended || member.status === 'suspended' : member.status === statusFilter)
  )), [statusFilter, workspace.members]);

  const availableRoles = useMemo(() => workspace.roles.filter((role) => (
    role.isActive && !workspace.selectedMember?.roles.some((grant) => grant.id === role.id)
  )), [workspace.roles, workspace.selectedMember]);

  const openEdit = (member: AdminMember | null) => {
    if (!member) return;
    workspace.setSelectedUserId(member.id);
    setProfileName(member.displayName);
    setProfileDepartment(member.department ?? '');
    setProfileTitle(member.title ?? '');
    setProfileManager(member.managerUserId ?? 'none');
    setEditOpen(true);
  };

  const run = async (operation: () => Promise<unknown>, success: string) => {
    try {
      await operation();
      showToast.success(success);
    } catch (error) {
      showToast.error('Operation failed', error instanceof Error ? error.message : 'The administrator operation failed.');
    }
  };

  const columns: Column<AdminMember>[] = [
    {
      key: 'member', header: 'Administrator', sortValue: (member) => member.displayName,
      cell: (member) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{member.displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{member.employeeCode}</p>
        </div>
      ),
    },
    {
      key: 'roles', header: 'Roles', hideOnMobile: true,
      cell: (member) => (
        <div className="flex max-w-[260px] flex-wrap gap-1">
          {member.roles.length === 0 && <Badge variant="outline">Pending assignment</Badge>}
          {member.roles.slice(0, 3).map((role) => <Badge key={role.grantId} variant="outline">{role.name}</Badge>)}
          {member.roles.length > 3 && <Badge variant="outline">+{member.roles.length - 3}</Badge>}
        </div>
      ),
      sortValue: (member) => member.roles.map((role) => role.name).join(' '),
    },
    {
      key: 'department', header: 'Department', hideOnMobile: true,
      cell: (member) => <span className="text-xs text-muted-foreground">{member.department || 'Unassigned'}</span>,
      sortValue: (member) => member.department ?? '',
    },
    {
      key: 'activity', header: 'Last activity', hideOnMobile: true,
      cell: (member) => (
        <div className="text-xs text-muted-foreground">
          <p>{dateLabel(member.lastLoginAt)}</p>
          <p>{member.activeSessionCount} active session{member.activeSessionCount === 1 ? '' : 's'}</p>
        </div>
      ),
      sortValue: (member) => member.lastLoginAt ?? '',
    },
    {
      key: 'status', header: 'Status',
      cell: (member) => <StatusBadge tone={statusTone(member)} dot>{statusLabel(member)}</StatusBadge>,
      sortValue: statusLabel,
    },
    {
      key: 'actions', header: '', className: 'w-12 text-right',
      cell: (member) => (
        <div onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Administrator actions"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEdit(member)} disabled={!canManage}><UserCog className="mr-2 h-4 w-4" />Edit profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => workspace.setSelectedUserId(member.id)}><ShieldCheck className="mr-2 h-4 w-4" />Manage access</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canManage}
                onClick={() => void run(
                  () => workspace.transition(member.id, member.isSuspended || member.status === 'suspended' ? 'restore' : 'suspend', actionReason),
                  member.isSuspended ? 'Administrator restored' : 'Administrator suspended',
                )}
              >
                {member.isSuspended ? <RotateCcw className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                {member.isSuspended ? 'Restore' : 'Suspend'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const submitInvite = async () => {
    await run(async () => {
      await workspace.invite({
        email, displayName, department: department || null, title: title || null,
        roleIds: inviteRoleIds, reason: inviteReason,
      });
      setInviteOpen(false);
      setEmail('');
      setDisplayName('');
      setInviteRoleIds([]);
    }, 'Administrator authorized');
  };

  return (
    <div>
      <PageHeader
        title="Admin Team"
        description="Canonical administrator identities, role grants, account state and operational access."
        icon={<ShieldCheck className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void workspace.refresh()} disabled={workspace.loading}>
              <RefreshCw className="mr-1.5 h-4 w-4" />Refresh
            </Button>
            {canManage && <Button size="sm" onClick={() => setInviteOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Authorize admin</Button>}
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Administrators" value={workspace.stats.total.toLocaleString()} icon={Users} sublabel="canonical profiles" tone="primary" />
        <StatCard label="Active" value={workspace.stats.active.toLocaleString()} icon={CheckCircle2} sublabel="available to operate" tone="success" />
        <StatCard label="Invited" value={workspace.stats.invited.toLocaleString()} icon={KeyRound} sublabel="awaiting first sign-in" tone="info" />
        <StatCard label="Suspended" value={workspace.stats.suspended.toLocaleString()} icon={XCircle} sublabel="access blocked" tone="warning" />
      </div>

      {workspace.error && (
        <Card className="mb-4 border-destructive/40"><CardContent className="p-4 text-sm text-destructive">{workspace.error}</CardContent></Card>
      )}

      <div className="mb-4 flex max-w-xs items-center gap-2">
        <Label className="shrink-0 text-xs">Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All administrators</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.8fr)]">
        <Card className="p-4">
          {workspace.loading ? (
            <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading administrators…</div>
          ) : (
            <DataTable
              data={members}
              columns={columns}
              getRowId={(member) => member.id}
              searchable
              searchKeys={(member) => `${member.displayName} ${member.email} ${member.employeeCode} ${member.department ?? ''} ${member.roles.map((role) => role.name).join(' ')}`}
              selectable={false}
              rowAction={(member) => workspace.setSelectedUserId(member.id)}
              initialSort={{ key: 'member', dir: 'asc' }}
              emptyTitle="No administrators found"
              emptyDescription="Adjust the status or search filters."
            />
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Access inspector</CardTitle>
          </CardHeader>
          <CardContent>
            {!workspace.selectedMember ? (
              <p className="text-sm text-muted-foreground">Select an administrator to inspect access.</p>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{workspace.selectedMember.displayName}</p>
                      <p className="text-sm text-muted-foreground">{workspace.selectedMember.email}</p>
                    </div>
                    <StatusBadge tone={statusTone(workspace.selectedMember)} dot>{statusLabel(workspace.selectedMember)}</StatusBadge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border p-2"><span className="text-muted-foreground">Department</span><p className="mt-1 font-medium">{workspace.selectedMember.department || 'Unassigned'}</p></div>
                    <div className="rounded-md border p-2"><span className="text-muted-foreground">Title</span><p className="mt-1 font-medium">{workspace.selectedMember.title || 'Unassigned'}</p></div>
                    <div className="rounded-md border p-2"><span className="text-muted-foreground">Manager</span><p className="mt-1 font-medium">{workspace.selectedMember.managerName || 'None'}</p></div>
                    <div className="rounded-md border p-2"><span className="text-muted-foreground">Sessions</span><p className="mt-1 font-medium">{workspace.selectedMember.activeSessionCount}</p></div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between"><Label>Active roles</Label>{canManage && <Button variant="outline" size="sm" onClick={() => openEdit(workspace.selectedMember)}>Edit profile</Button>}</div>
                  <div className="space-y-2">
                    {workspace.selectedMember.roles.length === 0 && <p className="rounded-md border border-warning/30 bg-warning/5 p-3 text-sm text-muted-foreground">No active role. This account cannot enter the console.</p>}
                    {workspace.selectedMember.roles.map((role) => (
                      <div key={role.grantId} className="flex items-center gap-2 rounded-md border p-2">
                        <div className="min-w-0 flex-1"><p className="text-sm font-medium">{role.name}</p><p className="truncate font-mono text-[10px] text-muted-foreground">{role.key}{role.validUntil ? ` · expires ${dateLabel(role.validUntil)}` : ''}</p></div>
                        {canManage && role.key !== 'super_admin' && (
                          <Button variant="ghost" size="sm" onClick={() => void run(() => workspace.revokeRole(workspace.selectedMember!.id, role.id, actionReason), 'Role revoked')}>Remove</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {canManage && availableRoles.length > 0 && (
                  <div className="space-y-2 rounded-md border p-3">
                    <Label>Assign another role</Label>
                    <Select value={roleToAssign} onValueChange={setRoleToAssign}>
                      <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>{availableRoles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="datetime-local" value={roleExpiry} onChange={(event) => setRoleExpiry(event.target.value)} aria-label="Optional role expiry" />
                    <Button className="w-full" disabled={!roleToAssign || workspace.mutating} onClick={() => void run(async () => {
                      await workspace.assignRole(workspace.selectedMember!.id, roleToAssign, roleExpiry ? new Date(roleExpiry).toISOString() : null, actionReason);
                      setRoleToAssign('');
                      setRoleExpiry('');
                    }, 'Role assigned')}>Assign role</Button>
                  </div>
                )}

                {canManage && (
                  <div className="space-y-2">
                    <Label>Reason for sensitive action</Label>
                    <Textarea value={actionReason} onChange={(event) => setActionReason(event.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => void run(
                        () => workspace.transition(workspace.selectedMember!.id, workspace.selectedMember!.isSuspended ? 'restore' : 'suspend', actionReason),
                        workspace.selectedMember!.isSuspended ? 'Administrator restored' : 'Administrator suspended',
                      )}>{workspace.selectedMember.isSuspended ? 'Restore access' : 'Suspend access'}</Button>
                      <Button variant="outline" onClick={() => void run(() => workspace.transition(workspace.selectedMember!.id, 'revoke-sessions', actionReason), 'Sessions revoked')}>Revoke sessions</Button>
                      <Button className="col-span-2" variant={workspace.selectedMember.status === 'disabled' ? 'outline' : 'destructive'} onClick={() => void run(
                        () => workspace.transition(workspace.selectedMember!.id, workspace.selectedMember!.status === 'disabled' ? 'activate' : 'disable', actionReason),
                        workspace.selectedMember!.status === 'disabled' ? 'Administrator activated' : 'Administrator disabled',
                      )}>{workspace.selectedMember.status === 'disabled' ? 'Activate account' : 'Disable account'}</Button>
                    </div>
                  </div>
                )}

                {workspace.selectedMember.id === session?.user.id && <p className="text-xs text-muted-foreground">This is your current administrator account. Final-super-admin protections are enforced by the API.</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={inviteOpen} onOpenChange={setInviteOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>Authorize administrator</SheetTitle><SheetDescription>Pre-authorize a verified Firebase email and assign canonical roles before first sign-in.</SheetDescription></SheetHeader>
          <div className="mt-6 space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
            <div><Label>Display name</Label><Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Department</Label><Input value={department} onChange={(event) => setDepartment(event.target.value)} /></div><div><Label>Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} /></div></div>
            <div>
              <Label>Roles</Label>
              <div className="mt-2 space-y-2 rounded-md border p-3">
                {workspace.roles.filter((role) => role.isActive).map((role) => (
                  <label key={role.id} className="flex cursor-pointer items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1" checked={inviteRoleIds.includes(role.id)} onChange={(event) => setInviteRoleIds((current) => event.target.checked ? [...current, role.id] : current.filter((id) => id !== role.id))} />
                    <span><span className="font-medium">{role.name}</span><span className="block text-xs text-muted-foreground">{role.description || role.key}</span></span>
                  </label>
                ))}
              </div>
            </div>
            <div><Label>Reason</Label><Textarea value={inviteReason} onChange={(event) => setInviteReason(event.target.value)} /></div>
            <Button className="w-full" disabled={!email || !displayName || inviteRoleIds.length === 0 || workspace.mutating} onClick={() => void submitInvite()}>
              {workspace.mutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Authorize administrator
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>Edit administrator profile</SheetTitle><SheetDescription>Update canonical profile and reporting-line information.</SheetDescription></SheetHeader>
          <div className="mt-6 space-y-4">
            <div><Label>Display name</Label><Input value={profileName} onChange={(event) => setProfileName(event.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Department</Label><Input value={profileDepartment} onChange={(event) => setProfileDepartment(event.target.value)} /></div><div><Label>Title</Label><Input value={profileTitle} onChange={(event) => setProfileTitle(event.target.value)} /></div></div>
            <div><Label>Manager</Label><Select value={profileManager} onValueChange={setProfileManager}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No manager</SelectItem>{workspace.members.filter((member) => member.id !== workspace.selectedMember?.id).map((member) => <SelectItem key={member.id} value={member.id}>{member.displayName}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Reason</Label><Textarea value={actionReason} onChange={(event) => setActionReason(event.target.value)} /></div>
            <Button className="w-full" disabled={!workspace.selectedMember || !profileName || workspace.mutating} onClick={() => void run(async () => {
              await workspace.updateProfile(workspace.selectedMember!.id, {
                displayName: profileName,
                department: profileDepartment || null,
                title: profileTitle || null,
                managerUserId: profileManager === 'none' ? null : profileManager,
                reason: actionReason,
              });
              setEditOpen(false);
            }, 'Administrator profile updated')}>Save profile</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
