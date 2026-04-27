import { useState } from "react";
import { Files, Layers3, Search } from "lucide-react";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { CategoryTabsSection } from "@/components/CategoryTabsSection";

export default function Tests() {
  const [search, setSearch] = useState("");
  const { categories, tests, isLoading, error } = useExamCatalog();
  const totalExams = categories.length;
  const totalTests = tests.length;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-foreground">Could not load exams</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          API expected at <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-12">
        <div className="h-10 w-1/2 rounded-xl bg-muted" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 rounded-2xl bg-muted" />
          <div className="h-48 rounded-2xl bg-muted" />
          <div className="h-48 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">

      {/* Hero banner */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-sky-100 bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 px-6 py-7 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/90">Exam Catalog</span>
                </div>
                <h1 className="text-[34px] font-black tracking-tight text-foreground leading-tight sm:text-[42px]">
                  Choose your exam category
                </h1>
                <p className="mt-2 text-[17px] leading-[1.7] text-slate-500 max-w-2xl">
                  Select category and Jump to the exam or series you want to practice.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700">
                    <Layers3 className="h-3.5 w-3.5 text-primary/70" />{categories.length} categories
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700">
                    <Files className="h-3.5 w-3.5 text-primary/70" />{totalExams} exams
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700">
                    <Files className="h-3.5 w-3.5 text-primary/70" />{totalTests} mock tests
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search categories, exams, or series..."
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-[15px] shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CategoryTabsSection
          title="Exam categories"
          subtitle="Pick a category, then open the Exam you want to practice."
          ctaLabel="View all categories"
          defaultCtaPath="/exams"
          className="mb-8"
          searchQuery={search}
        />
      </main>
    </div>
  );
}


