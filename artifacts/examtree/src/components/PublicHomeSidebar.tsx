import {
  BarChart3,
  Bookmark,
  CalendarDays,
  ClipboardList,
  Download,
  Gift,
  Headphones,
  Home,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { getSessionUser } from "@/lib/session-user";

type SidebarItem = {
  href?: string;
  label: string;
  icon: typeof Home;
  authNext?: string;
  disabled?: boolean;
};

const mainItems: SidebarItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/exams", label: "Explore Exams", icon: ClipboardList },
  { href: "/dashboard", label: "My Tests", icon: LayoutDashboard, authNext: "/dashboard" },
  { label: "Analytics", icon: BarChart3, disabled: true },
  { label: "Bookmarks", icon: Bookmark, disabled: true },
  { label: "Downloads", icon: Download, disabled: true },
  { label: "Study Plan", icon: CalendarDays, disabled: true },
  { label: "Rewards", icon: Gift, disabled: true },
];

const utilityItems: SidebarItem[] = [
  { href: "/contact", label: "Support", icon: Headphones },
  { href: "/profile", label: "Settings", icon: Settings, authNext: "/profile" },
];

function isActiveRoute(location: string, href: string) {
  if (href === "/") return location === "/";
  if (href === "/exams") {
    return location === "/exams"
      || location === "/tests"
      || location === "/mock-tests"
      || location === "/pyqs"
      || location === "/exams-covered"
      || location.startsWith("/category/")
      || location.startsWith("/subcategory/")
      || location.startsWith("/published-tests/");
  }
  return location === href || location.startsWith(`${href}/`);
}

function SidebarEntry({ item, location, user }: { item: SidebarItem; location: string; user: ReturnType<typeof getSessionUser> }) {
  const Icon = item.icon;

  if (item.disabled || !item.href) {
    return (
      <div
        className="flex min-h-11 cursor-default items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted-foreground/55"
        aria-disabled="true"
        title={`${item.label} is coming soon`}
        data-testid={`sidebar-disabled-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-muted-foreground">Soon</span>
      </div>
    );
  }

  const active = isActiveRoute(location, item.href);
  const target = item.authNext && !user
    ? `/login/student?next=${encodeURIComponent(item.authNext)}`
    : item.href;

  return (
    <Link
      href={target}
      aria-current={active ? "page" : undefined}
      className={`et-interactive group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {active ? <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-primary" aria-hidden="true" /> : null}
      <Icon className={`h-[18px] w-[18px] shrink-0 transition ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} aria-hidden="true" />
      <span className="min-w-0 truncate">{item.label}</span>
    </Link>
  );
}

export function PublicHomeSidebar() {
  const [location] = useLocation();
  const user = getSessionUser();

  return (
    <aside
      className="hidden min-h-[calc(100vh-4rem)] border-r border-border bg-card lg:block"
      aria-label="Student navigation"
      data-testid="public-study-sidebar"
    >
      <div className="sticky top-16 flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-4 py-5">
        <nav aria-label="Homepage study navigation" className="space-y-1">
          {mainItems.map((item) => (
            <SidebarEntry key={item.label} item={item} location={location} user={user} />
          ))}
        </nav>

        <div className="my-4 border-t border-border" />

        <nav aria-label="Support navigation" className="space-y-1">
          {utilityItems.map((item) => (
            <SidebarEntry key={item.label} item={item} location={location} user={user} />
          ))}
        </nav>

        <div className="mt-auto pt-5">
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-3.5">
            <p className="text-xs font-black text-foreground">Ready to practise?</p>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Choose an exam and continue with mocks, PYQs or free practice.</p>
            <Link
              href="/exams"
              className="et-interactive mt-3 flex min-h-11 items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-black text-primary-foreground shadow-sm hover:bg-primary/90"
              data-testid="sidebar-explore-cta"
            >
              Explore exams
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
