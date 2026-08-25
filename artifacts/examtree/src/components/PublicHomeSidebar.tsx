import {
  BarChart3,
  BookOpen,
  CircleHelp,
  ClipboardList,
  FileText,
  Headphones,
  Home,
  Info,
  Layers3,
  LayoutDashboard,
  Target,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { getSessionUser } from "@/lib/session-user";

type SidebarLink = {
  href: string;
  label: string;
  icon: typeof Home;
  authNext?: string;
};

type SidebarSection = {
  label: string;
  links: SidebarLink[];
};

const sidebarSections: SidebarSection[] = [
  {
    label: "Explore",
    links: [
      { href: "/", label: "Home", icon: Home },
      { href: "/exams", label: "Explore Exams", icon: ClipboardList },
      { href: "/mock-tests", label: "Mock Tests", icon: Target },
      { href: "/pyqs", label: "Previous Year Questions", icon: FileText },
      { href: "/exams-covered", label: "Exams Covered", icon: Layers3 },
    ],
  },
  {
    label: "Workspace",
    links: [
      { href: "/dashboard", label: "My Tests", icon: LayoutDashboard, authNext: "/dashboard" },
      { href: "/performance", label: "Performance", icon: BarChart3, authNext: "/performance" },
      { href: "/profile", label: "Profile & Settings", icon: UserRound, authNext: "/profile" },
    ],
  },
  {
    label: "Support",
    links: [
      { href: "/faq", label: "Help & FAQ", icon: CircleHelp },
      { href: "/contact", label: "Contact Support", icon: Headphones },
      { href: "/about", label: "About ExamTree", icon: Info },
    ],
  },
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
    <aside
      className="hidden min-h-[calc(100vh-4rem)] border-r border-slate-200 bg-white lg:block"
      aria-label="Student navigation"
      data-testid="public-study-sidebar"
    >
      <div className="sticky top-16 flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 py-4">
        <nav aria-label="Homepage study navigation" className="space-y-5">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{section.label}</p>
              <div className="mt-2 space-y-1">
                {section.links.map((item) => {
                  const active = isActiveRoute(location, item.href);
                  const target = item.authNext && !user
                    ? `/login/student?next=${encodeURIComponent(item.authNext)}`
                    : item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={target}
                      aria-current={active ? "page" : undefined}
                      className={`et-interactive group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${
                        active
                          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600"}`}>
                        <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5">
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-950">Ready to practise?</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">Pick an exam and start with a published mock or free practice test.</p>
              </div>
            </div>
            <Link
              href="/exams"
              className="et-interactive mt-3 flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-sm hover:bg-blue-700"
            >
              Explore exams
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
