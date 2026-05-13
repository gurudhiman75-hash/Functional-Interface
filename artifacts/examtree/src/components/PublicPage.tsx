import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface PublicPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute("content");
    document.title = `${title} | ExamTree`;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (previousDescription) {
        descriptionTag?.setAttribute("content", previousDescription);
      }
    };
  }, [description, title]);
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

