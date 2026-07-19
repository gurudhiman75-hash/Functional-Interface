import { useEffect, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';
import { ChevronDown, LogOut, Menu, Moon, Search, ShieldCheck, Sun, User } from 'lucide-react';

import { SidebarCollapseToggle } from '@/app/layout/Sidebar';
import { useTheme } from '@/app/theme/ThemeProvider';
import { Badge } from '@/components/ui/badge';
import { getFirebaseAuth } from '@/integrations/firebase';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

export function Topbar({ onToggleSidebar, onOpenMobile }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { session } = useAdminPermissions();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = session?.user.displayName || session?.user.email || 'Administrator';
  const roleLabel = session?.roles.join(', ') || 'Administrator';
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth).catch(() => undefined);
    localStorage.removeItem('examtree.admin.session');
    window.location.replace('/admin/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <button onClick={onOpenMobile} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent md:hidden" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      <SidebarCollapseToggle collapsed={false} onToggle={onToggleSidebar} />

      <div className="relative ml-1 hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))}
          className="h-9 w-full max-w-md cursor-text rounded-md border bg-muted/50 pl-9 pr-16 text-left text-sm text-muted-foreground outline-none transition-colors hover:bg-muted/70"
        >
          Search live workspaces…
        </button>
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:block">⌘K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Badge variant="outline" className="hidden border-success/40 bg-success/10 text-success sm:inline-flex">
          <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Canonical mode
        </Badge>

        <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" title="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-accent">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{initials || 'A'}</div>
            <div className="hidden max-w-48 text-left leading-tight sm:block">
              <p className="truncate text-xs font-semibold">{displayName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{roleLabel}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right animate-scale-in rounded-lg border bg-popover p-1.5 shadow-xl">
              <div className="border-b px-2 py-2">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{session?.user.email}</p>
              </div>
              <div className="flex items-center gap-2.5 px-2 py-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" /> {roleLabel}
              </div>
              <div className="my-1 border-t" />
              <button onClick={() => void handleSignOut()} className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
