import {
  Database,
  FileQuestion,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  permission?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { label: 'Launchpad', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      {
        label: 'Question Studio',
        path: '/content/questions/generate',
        icon: Sparkles,
        permission: 'content.generation.read',
      },
      { label: 'Question Bank', path: '/content/questions', icon: FileQuestion },
    ],
  },
  {
    id: 'tests',
    label: 'Tests',
    items: [
      { label: 'Tests', path: '/tests', icon: Database },
      { label: 'Test Builder', path: '/tests/builder', icon: ListChecks },
    ],
  },
];

export const NAV_LOOKUP: Record<string, NavItem> = Object.fromEntries(
  NAV_GROUPS.flatMap((group) => group.items.map((item) => [item.path, item])),
);
