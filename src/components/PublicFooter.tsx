import { Link } from "wouter";
import { Mail, MessageSquareWarning, ShieldCheck } from "lucide-react";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Mock Tests", href: "/mock-tests" },
      { label: "PYQs", href: "/pyqs" },
      { label: "Exams Covered", href: "/exams-covered" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Delete Account", href: "/account-deletion" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Report Question", href: "/report-question" },
      { label: "Help / Support", href: "/contact" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-blue-800 bg-[#1e1b4b] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
              E
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-white">examtree</p>
              <p className="text-xs font-medium text-slate-400">Tree of success</p>
            </div>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            ExamTree helps aspirants discover mock tests, PYQs, multilingual practice, and deep performance analysis for serious exam preparation.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified workflow
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              <Mail className="h-3.5 w-3.5" />
              support@examtree.in
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <MessageSquareWarning className="h-3.5 w-3.5" />
              Question QA
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{group.title}</h3>
              <div className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-blue-800 px-4 py-4 text-center text-xs text-slate-400">
        Copyright 2026 ExamTree. All rights reserved. Exam names are used for preparation and discovery purposes.
      </div>
    </footer>
  );
}
