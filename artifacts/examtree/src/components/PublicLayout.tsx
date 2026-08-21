import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

import { PublicSeoFallback } from "@/components/PublicSeoFallback";
import { getSessionUser } from "@/lib/session-user";

interface PublicLayoutProps {
  children: ReactNode;
}

const primaryLinks = [
  { label: "Exams", href: "/exams" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Resources", href: "/blog" },
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
  if (href === "/exams") {
    return location === "/exams"
      || location === "/tests"
      || location.startsWith("/category/")
      || location.startsWith("/subcategory/")
      || location.startsWith("/published-tests/");
  }
  return location === href || location.startsWith(`${href}/`);
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getSessionUser();

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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <PublicSeoFallback />
      <a
        href="#main-content"
        className="sr-only z-[1000] rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5" aria-label="ExamTree home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e1b4b] text-xs font-extrabold text-white">
              E
            </span>
            <span className="text-[19px] font-extrabold tracking-[-0.035em] text-[#1e1b4b]">examtree</span>
          </Link>

          <nav aria-label="Primary navigation" className="ml-8 hidden h-full items-center gap-7 lg:flex">
            {primaryLinks.map((item) => {
              const active = routeIsActive(location, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full items-center border-b-2 pt-0.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-indigo-700 text-slate-950"
                      : "border-transparent text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-950"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login/student"
                  className="inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  Sign in
                </Link>
                <Link
                  href="/mock-tests"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-950"
                >
                  Start a mock
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden md:ml-1"
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
          className={`${mobileOpen ? "block" : "hidden"} border-t border-slate-200 bg-white lg:hidden`}
        >
          <nav aria-label="Mobile primary navigation" className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="grid gap-1">
              {primaryLinks.map((item) => {
                const active = routeIsActive(location, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                      active ? "bg-indigo-50 text-indigo-800" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden="true" />}
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3 md:hidden">
              {user ? (
                <Link href="/dashboard" className="flex min-h-11 items-center justify-center rounded-lg bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login/student" className="flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                    Sign in
                  </Link>
                  <Link href="/mock-tests" className="flex min-h-11 items-center justify-center rounded-lg bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white">
                    Start a mock
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

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center gap-2.5" aria-label="ExamTree home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e1b4b] text-xs font-extrabold text-white">E</span>
              <span className="text-lg font-extrabold tracking-[-0.035em] text-[#1e1b4b]">examtree</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Published mock tests, saved attempts and multilingual exam practice in one focused student workspace.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold text-slate-900">{column.title}</h2>
                <div className="mt-3 space-y-2.5">
                  {column.links.map((item) => (
                    <Link key={item.href} href={item.href} className="block text-sm font-medium text-slate-600 transition-colors hover:text-indigo-800">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 ExamTree. All rights reserved.</span>
            <span>Built for focused exam preparation.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
