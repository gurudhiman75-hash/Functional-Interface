import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { BookOpen, ChevronRight, Files, Layers3, Search, Target } from "lucide-react";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORY_STYLES: Record<string, string> = {
  blue: "linear-gradient(to right, #0ea5e9, #3b82f6, #6366f1)",
  emerald: "linear-gradient(to right, #10b981, #14b8a6, #06b6d4)",
  violet: "linear-gradient(to right, #8b5cf6, #d946ef, #ec4899)",
  amber: "linear-gradient(to right, #f59e0b, #f97316, #f43f5e)",
  orange: "linear-gradient(to right, #f97316, #f59e0b, #eab308)",
  rose: "linear-gradient(to right, #f43f5e, #ec4899, #d946ef)",
  indigo: "linear-gradient(to right, #6366f1, #3b82f6, #06b6d4)",
  red: "linear-gradient(to right, #ef4444, #f43f5e, #f97316)",
};

export default function Tests() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["exam-catalog"] });
  };

  const categoryCards = useMemo(() => (
    categories.map((category) => {
      const exams = getRuntimeExamGroups(category.id, categories, tests, subcategories);
      return {
        ...category,
        totalExams: exams.length,
        totalFullLength: exams.reduce((sum, exam) => sum + exam.fullLengthCount, 0),
        totalSectional: exams.reduce((sum, exam) => sum + exam.sectionalCount, 0),
        totalTopicWise: exams.reduce((sum, exam) => sum + exam.topicWiseCount, 0),
      };
    })
  ), [categories, tests]);

  const filteredCategories = categoryCards.filter((category) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return category.name.toLowerCase().includes(query) || category.description.toLowerCase().includes(query);
  });

  const totalExams = categoryCards.reduce((sum, category) => sum + category.totalExams, 0);
  const totalTests = categoryCards.reduce((sum, category) => sum + category.testsCount, 0);

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
                  Browse categories and start practicing mock tests tailored to your exam goals.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700">
                    <Layers3 className="h-3.5 w-3.5 text-primary/70" />{categories.length} categories
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700">
                    <img
  src="https://your-image-link.com/icon.png"
  alt="icon"
  className="h-5 w-5 object-contain"
/>{totalExams} exams
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
                    placeholder="Search categories..."
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-[15px] shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 px-6 py-14 text-center">
            <img
  src="https://your-image-link.com/icon.png"
  alt="icon"
  className="h-5 w-5 object-contain"
/>
            <h2 className="mt-4 text-[18px] font-semibold text-foreground">No category matched your search</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">Try a broader keyword or clear the search to see all exam categories.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => {
              const gradient = CATEGORY_STYLES[category.color] ?? CATEGORY_STYLES.blue;
              return (
                <article
                  key={category.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] cursor-pointer"
                  onClick={() => setLocation(`/category/${category.id}`)}
                >
                  {/* Gradient top strip */}
                  <div className="h-1.5 w-full" style={{ backgroundImage: gradient }} />

                  <div className="flex flex-1 flex-col p-5 gap-3.5">
                    {/* Icon + badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundImage: gradient }}>
                        <img
  sr<img src="https://www.kindpng.com/picc/m/125-1251551_sbi-logo-state-bank-of-india-group-vector.png" alt="Sbi Logo [state Bank Of India Group] Vector Eps Free - State Bank Of India Logo 
  className="h-5 w-5 object-contain"
/>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-600">
                        Latest Pattern
                      </span>
                    </div>

                    {/* Title + description */}
                    <div>
                      <h2 className="text-[20px] font-bold text-slate-800 leading-snug">{category.name}</h2>
                      <p className="mt-1.5 text-[14px] leading-[1.6] text-slate-500 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2 text-[13px]">
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Exams</p>
                        <p className="mt-0.5 text-[18px] font-black text-slate-800">{category.totalExams}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Total Tests</p>
                        <p className="mt-0.5 text-[18px] font-black text-slate-800">{category.testsCount}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Full Length</p>
                        <p className="mt-0.5 text-[18px] font-black text-slate-800">{category.totalFullLength}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Sectional</p>
                        <p className="mt-0.5 text-[18px] font-black text-slate-800">{category.totalSectional}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA footer */}
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3.5">
                    <Button
                      className="w-full rounded-xl text-[15px] font-semibold shadow-none h-10"
                      onClick={(e) => { e.stopPropagation(); setLocation(`/category/${category.id}`); }}
                      data-testid={`btn-open-category-${category.id}`}
                    >
                      View Exams
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


