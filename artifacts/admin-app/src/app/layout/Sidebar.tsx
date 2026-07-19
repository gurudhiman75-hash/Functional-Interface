import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronDown, GraduationCap, PanelLeftClose, PanelLeft } from 'lucide-react';

import {
  ADMIN_WORKSPACE_COUNTS,
  NAV_GROUPS,
  WORKSPACE_STATUS_LABELS,
  type AdminWorkspaceStatus,
} from '@/app/nav/navigation';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

interface SidebarProps { collapsed: boolean; onNavigate?: () => void }

const OPEN_GROUPS_STORAGE_KEY = 'examtree.admin.navigation.open-groups';

function initialOpenGroups(): Record<string, boolean> {
  const defaults: Record<string, boolean> = Object.fromEntries(
    NAV_GROUPS.map((group) => [group.id, true]),
  );
  try {
    const stored = localStorage.getItem(OPEN_GROUPS_STORAGE_KEY);
    if (!stored) return defaults;
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    return Object.fromEntries(
      NAV_GROUPS.map((group) => {
        const value = parsed[group.id];
        return [group.id, typeof value === 'boolean' ? value : true];
      }),
    );
  } catch {
    return defaults;
  }
}

function statusClass(status: AdminWorkspaceStatus) {
  if (status === 'live') return 'border-success/25 bg-success/15 text-success';
  if (status === 'in_progress') return 'border-warning/25 bg-warning/15 text-warning';
  return 'border-sidebar-border bg-sidebar-accent text-sidebar-foreground/55';
}

function statusDotClass(status: AdminWorkspaceStatus) {
  if (status === 'live') return 'bg-success';
  if (status === 'in_progress') return 'bg-warning';
  return 'bg-sidebar-foreground/35';
}

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const { hasPermission } = useAdminPermissions();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpenGroups);

  useEffect(() => {
    localStorage.setItem(OPEN_GROUPS_STORAGE_KEY, JSON.stringify(openGroups));
  }, [openGroups]);

  const toggleGroup = (id: string) => setOpenGroups((previous) => ({ ...previous, [id]: !previous[id] }));

  return (
    <aside className={cn('flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300', collapsed ? 'w-[68px]' : 'w-72')}>
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-active text-primary-foreground shadow-lg shadow-primary/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight animate-fade-in">
            <span className="font-display text-base font-bold tracking-tight text-white">ExamTree</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-sidebar-foreground/60">Admin Console</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {NAV_GROUPS.map((group) => {
          const open = collapsed || openGroups[group.id];
          const items = group.items.filter((item) => !item.permission || hasPermission(item.permission));
          if (items.length === 0) return null;

          return (
            <div key={group.id} className="mb-1">
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="flex w-full items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/45 transition-colors hover:text-sidebar-foreground/70"
                >
                  {group.label}
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openGroups[group.id] ? '' : '-rotate-90')} />
                </button>
              )}
              {collapsed && <div className="mx-3 my-2 border-t border-sidebar-border" />}
              <div className={cn('space-y-0.5 px-3', !open && 'hidden')}>
                {items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    title={collapsed ? `${item.label} — ${WORKSPACE_STATUS_LABELS[item.status]}` : undefined}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-sidebar-active text-primary-foreground shadow-sm'
                        : item.status === 'planned'
                          ? 'text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      collapsed && 'justify-center',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
                        <span className="relative shrink-0">
                          <item.icon className="h-[18px] w-[18px]" />
                          {collapsed && (
                            <span className={cn('absolute -right-1 -top-1 h-2 w-2 rounded-full ring-2 ring-sidebar', statusDotClass(item.status))} />
                          )}
                        </span>
                        {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                        {!collapsed && (
                          <span className={cn('ml-auto rounded-full border px-1.5 py-0.5 text-[9px] font-semibold', statusClass(item.status))}>
                            {item.status === 'in_progress' ? 'Next' : WORKSPACE_STATUS_LABELS[item.status]}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn('rounded-lg bg-sidebar-accent/60 p-2.5 text-xs text-sidebar-foreground/70', collapsed && 'flex justify-center')}>
          {collapsed ? (
            <span className="h-2.5 w-2.5 rounded-full bg-success" title={`${ADMIN_WORKSPACE_COUNTS.live} live workspaces`} />
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /><span>{ADMIN_WORKSPACE_COUNTS.live} live</span></div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" /><span>{ADMIN_WORKSPACE_COUNTS.in_progress} in progress</span></div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sidebar-foreground/35" /><span>{ADMIN_WORKSPACE_COUNTS.planned} planned</span></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function SidebarCollapseToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
      {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
    </button>
  );
}
