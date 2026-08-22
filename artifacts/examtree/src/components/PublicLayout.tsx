import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

import { PublicSeoFallback } from "@/components/PublicSeoFallback";
import { getSessionUser } from "@/lib/session-user";

interface PublicLayoutProps {
  children: ReactNode;
}

const primaryLinks = [
  { label: "Tests", href: "/exams" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Exams Covered", href: "/exams-covered" },
  { label: "FAQ", href: "/faq" },
];

const footerColumns = [
  {
    title: "Prepare",
    links: [
      { label: "Browse Tests", href: "/exams" },
      { label: "Mock Tests", href: "/mock-tests" },
      { label: "Previous Year Questions", href: "/pyqs" },
      { label: "Exams Covered", href: "/exams-covered" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "About ExamTree", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

function routeIsActive(location: string, href: string) {
  if (href === "/exams") return location === "/exams" || location === "/tests" || location.startsWith("/category/") || location.startsWith("/subcategory/") || location.startsWith("/published-tests/");
  return location === href || location.startsWith(`${href}/`);
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getSessionUser();
  const homeChrome = location === "/";

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="et-viewport et-page-surface bg-background text-foreground">
      <PublicSeoFallback />
      <a
        href="#main-content"
        className="sr-only z-[1000] rounded-lg bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header
        className={`et-chrome sticky top-0 z-50 border-b ${homeChrome ? "!border-white/10 !bg-[#090f2e] text-white" : ""}`}
        data-testid="public-header"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="et-interactive flex shrink-0 items-center gap-2.5 rounded-xl" aria-label="ExamTree home">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold shadow-sm ring-1 ${homeChrome ? "bg-emerald-500 text-slate-950 ring-emerald-400/30" : "bg-primary text-primary-foreground ring-primary/15"}`}>
              E
            </span>
            <span className={`text-lg font-extrabold tracking-[-0.03em] ${homeChrome ? "text-white" : "text-foreground"}`}>examtree</span>
          </Link>

          <nav aria-label="Primary navigation" className="ml-5 hidden items-center gap-1 lg:flex">
            {primaryLinks.map((item) => {
              const active = routeIsActive(location, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`et-interactive rounded-lg px-3 py-2 text-sm font-semibold ${
                    homeChrome
                      ? active
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            {user ? (
              <Link
                href="/dashboard"
                className={`et-interactive inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md ${homeChrome ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-primary text-primary-foreground"}`}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                My dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login/student"
                  className={`et-interactive inline-flex min-h-10 items-center rounded-xl px-4 py-2 text-sm font-semibold ${homeChrome ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/exams"
                  className={`et-interactive inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md ${homeChrome ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-primary text-primary-foreground"}`}
                >
                  Browse tests
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className={`et-interactive ml-auto flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm lg:hidden ${homeChrome ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <div
          id="public-mobile-navigation"
          className={`${mobileOpen ? "block" : "hidden"} border-t lg:hidden ${homeChrome ? "border-white/10 bg-[#090f2e]" : "border-border bg-background"}`}
        >
          <nav aria-label="Mobile primary navigation" className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {primaryLinks.map((item) => {
              const active = routeIsActive(location, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`et-interactive flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold ${
                    homeChrome
                      ? active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                      : active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className={`grid gap-2 border-t pt-3 sm:hidden ${homeChrome ? "border-white/10" : "border-border"}`}>
              {user ? (
                <Link href="/dashboard" className={`et-interactive flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ${homeChrome ? "bg-emerald-500 text-slate-950" : "bg-primary text-primary-foreground"}`}>
                  My dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login/student" className={`et-interactive flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold ${homeChrome ? "border-white/15 bg-white/5 text-white hover:bg-white/10" : "border-border bg-card text-foreground hover:bg-muted"}`}>
                    Sign in
                  </Link>
                  <Link href="/exams" className={`et-interactive flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ${homeChrome ? "bg-emerald-500 text-slate-950" : "bg-primary text-primary-foreground"}`}>
                    Browse tests
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="min-h-[60vh]">
        {children}
      </main>

      <footer className="border-t border-border bg-card/90">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8">
          <div>
            <Link href="/" className="et-interactive inline-flex items-center gap-2.5 rounded-xl" aria-label="ExamTree home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">E</span>
              <span className="text-lg font-extrabold tracking-[-0.03em] text-foreground">examtree</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Browse published mock tests and exam practice, save attempts, and review supported multilingual question content from one student workspace.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{column.title}</h2>
                <div className="mt-3 space-y-2.5">
                  {column.links.map((item) => (
                    <Link key={item.href} href={item.href} className="et-interactive block rounded-sm text-sm font-medium text-muted-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 ExamTree. All rights reserved.</span>
            <span>Built for exam discovery, mock tests, and saved review.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
