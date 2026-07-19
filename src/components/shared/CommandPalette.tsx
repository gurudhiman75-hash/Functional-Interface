import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListChecks, Search, Sparkles, type LucideIcon } from 'lucide-react';

import { NAV_GROUPS } from '@/app/nav/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const navigateTo = useCallback((path: string) => {
    navigate(path);
    setOpen(false);
  }, [navigate]);

  const items = useMemo<CommandItem[]>(() => {
    const navigation = NAV_GROUPS.flatMap((group) =>
      group.items
        .filter((item) => !item.permission || hasPermission(item.permission))
        .map((item) => ({
          id: `nav-${item.path}`,
          label: item.label,
          hint: group.label,
          icon: item.icon,
          group: 'Navigate',
          action: () => navigateTo(item.path),
        })),
    );

    const quickActions: CommandItem[] = [
      {
        id: 'generate-questions',
        label: 'Generate questions',
        hint: 'Question Studio',
        icon: Sparkles,
        group: 'Quick actions',
        action: () => navigateTo('/content/questions/generate'),
      },
      {
        id: 'build-test',
        label: 'Build a test',
        hint: 'Test Builder',
        icon: ListChecks,
        group: 'Quick actions',
        action: () => navigateTo('/tests/builder'),
      },
    ];

    return [...navigation, ...quickActions];
  }, [hasPermission, navigateTo]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(term)
      || item.hint?.toLowerCase().includes(term)
      || item.group.toLowerCase().includes(term),
    );
  }, [items, query]);

  useEffect(() => setActiveIndex(0), [query]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((previous) => Math.min(previous + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((previous) => Math.max(previous - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      filtered[activeIndex]?.action();
    }
  }, [activeIndex, filtered]);

  let currentGroup = '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl gap-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search live admin workspaces</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search live workspaces and actions..."
            className="flex h-14 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="shrink-0 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No live workspace matches this search.</div>
          ) : (
            filtered.map((item, index) => {
              const showGroup = item.group !== currentGroup;
              currentGroup = item.group;
              const active = index === activeIndex;
              return (
                <div key={item.id}>
                  {showGroup && (
                    <div className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.group}
                    </div>
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={item.action}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      active ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60',
                    )}
                  >
                    <item.icon className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.label}</p>
                      {item.hint && <p className="truncate text-xs text-muted-foreground">{item.hint}</p>}
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
