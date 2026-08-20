import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

import { getUser } from "@/lib/storage";

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
  const user = getUser();

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
      <a
        href="#main-content"
        className="sr-only z-[1000] rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="ExamTree home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e1b4b] text-sm font-extrabold text-white shadow-sm ring-1 ring-indigo-950/10">
              E
            </span>
            <span className="text-lg font-extrabold tracking-[-0.03em] text-[#1e1b4b]">examtree</span>
          </Link>

          <nav aria-label="Primary navigation" className="ml-5 hidden items-center gap-1 lg:flex">
            {primaryLinks.map((item) => {
              const active = routeIsActive(location, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-50 text-indigo-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-950"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                My dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login/student"
                  className="inline-flex min-h-10 items-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Sign in
                </Link>
                <Link
                  href="/exams"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-950"
                >
                  Browse tests
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 lg:hidden"
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
          <nav aria-label="Mobile primary navigation" className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {primaryLinks.map((item) => {
              const active = routeIsActive(location, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold ${
                    active ? "bg-indigo-50 text-indigo-800" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="grid gap-2 border-t border-slate-200 pt-3 sm:hidden">
              {user ? (
                <Link href="/dashboard" className="flex min-h-11 items-center justify-center rounded-xl bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white">
                  My dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login/student" className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    Sign in
                  </Link>
                  <Link href="/exams" className="flex min-h-11 items-center justify-center rounded-xl bg-[#1e1b4b] px-4 py-2 text-sm font-semibold text-white">
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

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="ExamTree home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e1b4b] text-sm font-extrabold text-white">E</span>
              <span className="text-lg font-extrabold tracking-[-0.03em] text-[#1e1b4b]">examtree</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Browse published mock tests and exam practice, save attempts, and review supported multilingual question content from one student workspace.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{column.title}</h2>
                <div className="mt-3 space-y-2.5">
                  {column.links.map((item) => (
                    <Link key={item.href} href={item.href} className="block text-sm font-medium text-slate-600 transition hover:text-indigo-800">
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
            <span>Built for exam discovery, mock tests, and saved review.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
