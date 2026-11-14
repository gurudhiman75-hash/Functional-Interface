import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface PublicPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

type PageMetaOptions = {
  canonicalPath?: string;
  robots?: string;
  imagePath?: string;
  type?: "website" | "article";
};

const CANONICAL_ALIASES: Record<string, string> = {
  "/tests": "/exams",
  "/privacy": "/privacy-policy",
  "/login": "/login/student",
};

function canonicalPathFor(pathname: string) {
  return CANONICAL_ALIASES[pathname] ?? pathname;
}

function ensureMetaTag(attribute: "name" | "property", key: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  const created = !element;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  return { element, created, previous: element.getAttribute("content") };
}

function ensureCanonicalLink() {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const created = !element;
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  return { element, created, previous: element.getAttribute("href") };
}

export function usePageMeta(title: string, description: string, options: PageMetaOptions = {}) {
  const canonicalPath = options.canonicalPath;
  const robots = options.robots ?? "index,follow";
  const imagePath = options.imagePath ?? "/opengraph.jpg";
  const type = options.type ?? "website";

  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = title.includes("ExamTree") ? title : `${title} | ExamTree`;
    const resolvedCanonicalPath = canonicalPath ?? canonicalPathFor(window.location.pathname);
    const canonicalUrl = new URL(resolvedCanonicalPath, window.location.origin).toString();
    const imageUrl = new URL(imagePath, window.location.origin).toString();
    document.title = fullTitle;

    const records = [
      ["name", "description", description],
      ["name", "robots", robots],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", fullTitle],
      ["name", "twitter:description", description],
      ["name", "twitter:image", imageUrl],
      ["property", "og:title", fullTitle],
      ["property", "og:description", description],
      ["property", "og:type", type],
      ["property", "og:url", canonicalUrl],
      ["property", "og:image", imageUrl],
    ] as const;

    const metaRecords = records.map(([attribute, key, value]) => {
      const record = ensureMetaTag(attribute, key);
      record.element.setAttribute("content", value);
      return record;
    });

    const canonical = ensureCanonicalLink();
    canonical.element.setAttribute("href", canonicalUrl);

    return () => {
      document.title = previousTitle;
      for (const record of metaRecords.reverse()) {
        if (record.created) record.element.remove();
        else if (record.previous === null) record.element.removeAttribute("content");
        else record.element.setAttribute("content", record.previous);
      }
      if (canonical.created) canonical.element.remove();
      else if (canonical.previous === null) canonical.element.removeAttribute("href");
      else canonical.element.setAttribute("href", canonical.previous);
    };
  }, [canonicalPath, description, imagePath, robots, title, type]);
}

export function PublicPage({ eyebrow, title, description, children }: PublicPageProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="bg-[#1e1b4b] px-6 py-8 text-white md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">{eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-indigo-100 md:text-base">{description}</p>
        </div>
        <div className="border-t border-slate-200 bg-white p-5 md:p-8">{children}</div>
      </section>
    </div>
  );
}

export function PublicCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function SeoRouteGrid({ routes }: { routes: { label: string; href: string; description: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-indigo-300"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold text-slate-950">{route.label}</h3>
            <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-700" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{route.description}</p>
        </Link>
      ))}
    </div>
  );
}
