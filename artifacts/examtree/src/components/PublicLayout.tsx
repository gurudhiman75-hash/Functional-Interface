import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Home,
  Languages,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { PublicHomeSidebar } from "@/components/PublicHomeSidebar";
import { PublicSeoFallback } from "@/components/PublicSeoFallback";
import { getSessionUser } from "@/lib/session-user";

interface PublicLayoutProps {
  children: ReactNode;
}

type MobileStudyLink = {
  label: string;
  icon: typeof Home;
  href?: string;
  authNext?: string;
  disabled?: boolean;
};

const primaryLinks = [
  { label: "Tests", href: "/exams" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Resources", href: "/resources" },
  { label: "Store", href: "/store" },
  { label: "Exams Covered", href: "/exams-covered" },
  { label: "FAQ", href: "/faq" },
];

const homeLinks = [
  { label: "Exams", href: "/exams" },
  { label: "Test Series", href: "/exams" },
  { label: "Previous Papers", href: "/pyqs" },
  { label: "Practice", href: "/mock-tests" },
  { label: "Resources", href: "/resources" },
  { label: "Store", href: "/store" },
];

const mobileStudyLinks: MobileStudyLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore Exams", href: "/exams", icon: LayoutDashboard },
  { label: "Free Resources", href: "/resources", icon: Newspaper },
  { label: "Store", href: "/store", icon: ShoppingBag },
  { label: "My Tests", href: "/dashboard", icon: LayoutDashboard, authNext: "/dashboard" },
  { label: "Performance", href: "/performance", icon: BarChart3, authNext: "/performance" },
  { label: "Support", href: "/contact", icon: ArrowRight },
  { label: "Settings", href: "/profile", icon: Settings, authNext: "/profile" },
];

const footerColumns = [
  {
    title: "Prepare",
    links: [
      { label: "Browse Tests", href: "/exams" },
      { label: "Mock Tests", href: "/mock-tests" },
      { label: "Previous Year Questions", href: "/pyqs" },
      { label: "Free Resources", href: "/resources" },
      { label: "Store", href: "/store" },
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
  if (href === "/") return location === "/";
  if (href === "/exams") return location === "/exams" || location === "/tests" || location === "/mock-tests" || location === "/pyqs" || location === "/exams-covered" || location.startsWith("/category/") || location.startsWith("/subcategory/") || location.startsWith("/published-tests/");
  if (href === "/resources") return location === "/current-affairs" || location === "/resources" || location.startsWith("/resources/");
  if (href === "/store") return location === "/store" || location === "/packages" || location.startsWith("/store/") || location.startsWith("/packages/");
  return location === href || location.startsWith(`${href}/`);
}

function showStudySidebarForRoute(location: string) {
  return location === "/exams"
    || location === "/tests"
    || location === "/mock-tests"
    || location === "/pyqs"
    || location === "/exams-covered"
    || location === "/store"
    || location === "/packages"
    || location === "/faq"
    || location === "/contact"
    || location === "/about"
    || location.startsWith("/store/")
    || location.startsWith("/packages/")
    || location.startsWith("/category/")
    || location.startsWith("/subcategory/")
    || location.startsWith("/published-tests/");
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getSessionUser();
  const isHome = location === "/";
  const showStudySidebar = showStudySidebarForRoute(location);
  const visiblePublicLinks = isHome ? homeLinks : primaryLinks;

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

      <header className={`et-chrome sticky top-0 z-50 border-b ${isHome ? "home-reference-header" : ""}`} data-testid="public-header">
        <div className={`mx-auto flex w-full items-center gap-4 px-4 sm:px-6 ${isHome ? "h-14 max-w-7xl lg:px-8" : `h-16 ${showStudySidebar ? "max-w-[1536px] lg:px-0" : "max-w-7xl lg:px-8"}`}`}>
          <div className={!isHome && showStudySidebar ? "lg:flex lg:w-[252px] lg:shrink-0 lg:items-center lg:border-r lg:border-sidebar-border lg:px-5 lg:self-stretch" : "shrink-0"}>
            <Link href="/" className="et-interactive flex min-h-[45px] shrink-0 items-center gap-2 rounded-xl" aria-label="ExamTree home">
              <span className={`flex items-center justify-center bg-primary font-extrabold text-primary-foreground shadow-sm ring-1 ring-primary/15 ${isHome ? "h-8 w-8 rounded-lg text-xs" : "h-9 w-9 rounded-xl text-sm"}`}>E</span>
              <span className={`${isHome ? "text-[15px]" : "text-lg"} font-extrabold tracking-[-0.03em] text-foreground`}>EXAMTREE</span>
            </Link>
          </div>

          <nav aria-label="Primary navigation" className={showStudySidebar ? "hidden" : "ml-5 hidden items-center gap-1 lg:flex"}>
            {visiblePublicLinks.map((item) => {
              const active = routeIsActive(location, item.href);
              const dropdown = "dropdown" in item && item.dropdown;
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  aria-current={active && !isHome ? "page" : undefined}
                  className={`et-interactive inline-flex min-h-[45px] items-center rounded-lg px-3 py-2 text-sm font-semibold ${isHome ? "text-[11px] text-slate-600 hover:bg-slate-50 hover:text-slate-950" : active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {item.label}
                  {dropdown ? <ChevronDown className="ml-1 h-3 w-3" aria-hidden="true" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className={`ml-auto hidden items-center gap-2 sm:flex ${showStudySidebar ? "lg:px-5" : ""}`} data-testid="public-header-actions">
            {isHome ? (
              <>
                <span className="mr-1 hidden items-center gap-1.5 text-[11px] font-medium text-slate-500 md:inline-flex"><Languages className="h-3.5 w-3.5" /> English <ChevronDown className="h-3 w-3" /></span>
                {user ? (
                  <Link href="/dashboard" className="et-interactive inline-flex min-h-[45px] items-center rounded-lg bg-[#6857f5] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5b48ed]">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/login/student" className="et-interactive inline-flex min-h-[45px] items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Log in</Link>
                    <Link href="/login/student?mode=signup" className="et-interactive inline-flex min-h-[45px] items-center rounded-lg bg-[#6857f5] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5b48ed]">Sign up</Link>
                  </>
                )}
              </>
            ) : user ? (
              <Link href="/dashboard" className="et-interactive inline-flex min-h-[45px] items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                My dashboard
              </Link>
            ) : (
              <>
                <Link href="/login/student" className="et-interactive inline-flex min-h-[45px] items-center rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Sign in</Link>
                {!showStudySidebar ? (
                  <Link href="/exams" className="et-interactive inline-flex min-h-[45px] items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md">
                    Browse tests <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </>
            )}
          </div>

          <button
            type="button"
            className="et-interactive ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <div id="public-mobile-navigation" className={`${mobileOpen ? "block" : "hidden"} border-t border-border bg-background lg:hidden`}>
          <nav aria-label="Mobile primary navigation" className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {showStudySidebar ? mobileStudyLinks.map((item) => {
              if (item.disabled || !item.href) {
                return (
                  <div key={item.label} className="flex min-h-11 cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground/55" aria-disabled="true" title={`${item.label} is coming soon`} data-testid={`mobile-disabled-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <span className="min-w-0 flex-1">{item.label}</span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-muted-foreground">Soon</span>
                  </div>
                );
              }

              const active = routeIsActive(location, item.href);
              const target = item.authNext && !user ? `/login/student?next=${encodeURIComponent(item.authNext)}` : item.href;
              return (
                <Link key={item.label} href={target} aria-current={active ? "page" : undefined} className={`et-interactive flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  {item.label}
                </Link>
              );
            }) : visiblePublicLinks.map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href} className="et-interactive flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <div className="grid gap-2 border-t border-border pt-3 sm:hidden">
              {user ? (
                <Link href="/dashboard" className="et-interactive flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">My dashboard</Link>
              ) : (
                <Link href="/login/student" className="et-interactive flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">Log in</Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showStudySidebar ? (
        <div className="mx-auto w-full max-w-[1536px] lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
          <PublicHomeSidebar />
          <main id="main-content" tabIndex={-1} className="min-h-[60vh] min-w-0">{children}</main>
        </div>
      ) : (
        <main id="main-content" tabIndex={-1} className="min-h-[60vh]">{children}</main>
      )}

      {isHome ? (
        <footer className="home-reference-footer border-t">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link href="/" className="et-interactive inline-flex items-center gap-2 rounded-lg" aria-label="ExamTree home">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6857f5] text-xs font-extrabold text-white">E</span>
                <span className="text-sm font-extrabold tracking-[-0.03em] text-white">EXAMTREE</span>
              </Link>
              <span className="text-[10px] text-white/40">Practice better. Perform better.</span>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-medium text-white/58">
              <Link href="/exams" className="hover:text-white">Exams</Link>
              <Link href="/exams" className="hover:text-white">Test Series</Link>
              <Link href="/mock-tests" className="hover:text-white">Practice</Link>
              <Link href="/resources" className="hover:text-white">Resources</Link>
              <Link href="/store" className="hover:text-white">Store</Link>
              <Link href="/faq" className="hover:text-white">Help</Link>
            </nav>
          </div>
          <div className="mx-auto max-w-7xl border-t border-white/[0.06] px-4 py-5 text-[9px] text-white/28 sm:px-6 lg:px-8">© 2026 ExamTree. Built for India&apos;s aspirants.</div>
        </footer>
      ) : (
        <footer className="border-t border-border bg-card/90">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8">
            <div>
              <Link href="/" className="et-interactive inline-flex items-center gap-2.5 rounded-xl" aria-label="ExamTree home">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">E</span>
                <span className="text-lg font-extrabold tracking-[-0.03em] text-foreground">EXAMTREE</span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Browse published mock tests and exam practice, save attempts, and review supported multilingual question content from one student workspace.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{column.title}</h2>
                  <div className="mt-3 space-y-2.5">
                    {column.links.map((item) => (
                      <Link key={item.href} href={item.href} className="et-interactive block rounded-sm text-sm font-medium text-muted-foreground hover:text-primary">{item.label}</Link>
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
      )}
    </div>
  );
}