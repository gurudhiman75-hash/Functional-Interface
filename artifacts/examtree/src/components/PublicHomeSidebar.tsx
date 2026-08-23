import {
  BookOpen,
  CircleHelp,
  ClipboardList,
  FileText,
  Home,
  Layers3,
  LayoutDashboard,
  LogIn,
  Target,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { getSessionUser } from "@/lib/session-user";

type SidebarLink = {
  href: string;
  label: string;
  icon: typeof Home;
};

const studyLinks: SidebarLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/exams", label: "Tests & Exams", icon: ClipboardList },
  { href: "/mock-tests", label: "Mock Tests", icon: Target },
  { href: "/pyqs", label: "PYQs", icon: FileText },
  { href: "/exams-covered", label: "Exams Covered", icon: Layers3 },
];

function isActiveRoute(location: string, href: string) {
  if (href === "/") return location === "/";
  if (href === "/exams") {
    return location === "/exams"
      || location === "/tests"
      || location.startsWith("/category/")
      || location.startsWith("/subcategory/")
      || location.startsWith("/published-tests/");
  }
  return location === href || location.startsWith(`${href}/`);
}

export function PublicHomeSidebar() {
  const [location] = useLocation();
  const user = getSessionUser();

  return (
    <aside className="hidden border-r border-border/80 bg-card/70 lg:block" aria-label="Student navigation">
      <div className="sticky top-16 flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 py-5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Study</p>
        <nav aria-label="Study navigation" className="mt-2 space-y-1">
          {studyLinks.map((item) => {
            const active = isActiveRoute(location, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`et-interactive flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="my-4 border-t border-border/80" />
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
        <div className="mt-2 space-y-1">
          {user ? (
            <Link
              href="/dashboard"
              className="et-interactive flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LayoutDashboard className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span>My Activity</span>
            </Link>
          ) : (
            <Link
              href="/login/student"
              className="et-interactive flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LogIn className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span>Sign in</span>
            </Link>
          )}
          <Link
            href="/faq"
            className="et-interactive flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <CircleHelp className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span>Help & FAQ</span>
          </Link>
        </div>

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
          <div className="flex items-start gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-950">Ready to practice?</p>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-600">Open the live test catalog and pick your exam.</p>
            </div>
          </div>
          <Link
            href="/exams"
            className="et-interactive mt-3 flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            Browse tests
          </Link>
        </div>
      </div>
    </aside>
  );
}
