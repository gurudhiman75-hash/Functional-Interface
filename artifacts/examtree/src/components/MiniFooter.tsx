import { Link } from "wouter";
import { Github, Mail, ShieldCheck, Twitter } from "lucide-react";

const footerColumns = [
  {
    title: "Exams",
    links: [
      { label: "SSC CGL", href: "/exams-covered" },
      { label: "Banking (IBPS)", href: "/mock-tests" },
      { label: "Punjab State", href: "/exams-covered" },
      { label: "Railway", href: "/pyqs" },
    ],
  },
  {
    title: "System",
    links: [
      { label: "Practice Motifs", href: "/dashboard" },
      { label: "PYQ Repo", href: "/pyqs" },
      { label: "API Docs", href: "/about" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms-and-conditions" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
];

export function MiniFooter() {
  return (
    <footer className="border-t border-indigo-900 bg-[#1e1b4b] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_3fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1e1b4b] text-sm font-semibold text-white ring-1 ring-indigo-400/40">
              E
            </span>
            <span>
              <span className="block text-base font-semibold tracking-tight text-white">
                examtree
              </span>
              <span className="block text-xs font-medium text-slate-300">
                Logic-first test preparation
              </span>
            </span>
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs font-semibold text-teal-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
            Logic Engine v2.4
          </div>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
            High-density mock tests, PYQs, multilingual review, and deep logic
            diagnostics for serious exam preparation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                {column.title}
              </h3>
              <div className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <Link
                    key={`${column.title}-${link.label}-${link.href}`}
                    href={link.href}
                    className="block text-sm font-medium text-slate-300 transition hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-indigo-900 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Copyright 2026 ExamTree. Built for exam discovery, practice, and
            review.
          </span>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <Twitter className="h-4 w-4" aria-hidden="true" />
            <Github className="h-4 w-4" aria-hidden="true" />
            <Mail className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  );
}
