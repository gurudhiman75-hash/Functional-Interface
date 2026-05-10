import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ClipboardList, Clock3, Lock, Search, Unlock } from "lucide-react";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CatalogTest = ReturnType<typeof useExamCatalog>["tests"][number];

const categoryNames = ["Banking", "SSC", "Management", "Punjab", "Teaching", "Computer"];

function getReasoningLevel(test: CatalogTest) {
  const difficulty = String(test.difficulty ?? "").toLowerCase();
  if (difficulty.includes("hard")) return 5;
  if (difficulty.includes("medium")) return 3;
  return 2;
}

export default function Tests() {
  const [, setLocation] = useLocation();
  const { tests, subcategories, isLoading, error } = useExamCatalog();
  const [query, setQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [selectedTest, setSelectedTest] = useState<CatalogTest | null>(null);

  const subcategoryList = useMemo(() => {
    const fromCatalog = subcategories.map((item) => ({
      id: item.id,
      name: item.name,
      count: tests.filter((test) => test.subcategoryId === item.id || test.subcategoryName === item.name).length,
    }));
    return [{ id: "all", name: "All Exams", count: tests.length }, ...fromCatalog.filter((item) => item.count > 0)];
  }, [subcategories, tests]);

  const filteredTests = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tests.filter((test) => {
      const matchesQuery =
        !normalized ||
        test.name.toLowerCase().includes(normalized) ||
        test.category.toLowerCase().includes(normalized) ||
        (test.subcategoryName ?? "").toLowerCase().includes(normalized);
      const matchesSubcategory =
        activeSubcategory === "all" ||
        test.subcategoryId === activeSubcategory ||
        subcategories.find((item) => item.id === activeSubcategory)?.name === test.subcategoryName;
      return matchesQuery && matchesSubcategory;
    });
  }, [activeSubcategory, query, subcategories, tests]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-foreground">Could not load tests and exams</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          API expected at <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-8">
        <div className="skeleton-shimmer h-12 w-80 rounded-md" />
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="skeleton-shimmer h-[560px] rounded-md" />
          <div className="skeleton-shimmer h-[560px] rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="data-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="professional-badge mb-3">Tests & Exams</p>
            <h1 className="text-3xl font-semibold tracking-tight">Choose an exam blueprint</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse categories, compare timing and access, then open the side blueprint before starting.
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for an exam or topic..."
              className="h-10 rounded-md pl-9"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {categoryNames.map((category) => {
          const count = tests.filter((test) => test.category.toLowerCase().includes(category.toLowerCase())).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setQuery(category)}
              className="rounded-md border border-zinc-200 bg-white p-4 text-left transition hover:border-indigo-500/35 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ClipboardList className="mb-3 h-5 w-5 text-zinc-500" />
              <p className="text-sm font-semibold">{category}</p>
              <p className="mt-1 text-xs text-muted-foreground">{count} available</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-h-[560px] overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[25%_75%]">
        <aside className="border-b border-zinc-200 bg-zinc-50 p-3 dark:border-slate-800 dark:bg-slate-950 lg:border-b-0 lg:border-r">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sub-categories
          </p>
          <div className="space-y-1">
            {subcategoryList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSubcategory(item.id)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  activeSubcategory === item.id
                    ? "bg-white font-semibold text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground dark:hover:bg-slate-900"
                }`}
              >
                <span className="truncate">{item.name}</span>
                <span className="text-xs tabular-nums">{item.count}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase tracking-[0.14em] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Exam Name</th>
                <th className="px-4 py-3 text-left font-semibold">Reasoning Level</th>
                <th className="px-4 py-3 text-left font-semibold">Questions</th>
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-left font-semibold">Access</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => {
                const isPaid = (test.access ?? "free") !== "free";
                return (
                  <tr
                    key={test.id}
                    className="cursor-pointer border-b border-zinc-100 transition hover:bg-indigo-50/45 dark:border-slate-800 dark:hover:bg-slate-800/60"
                    onClick={() => setSelectedTest(test)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{test.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{test.category} / {test.subcategoryName ?? "General"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 w-5 rounded-sm ${index < getReasoningLevel(test) ? "bg-indigo-600" : "bg-zinc-200 dark:bg-slate-700"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{test.totalQuestions}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                        {test.duration} min
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${
                        isPaid
                          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {isPaid ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        {isPaid ? "Paid" : "Free"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredTests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground">
                    No exams matched your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Sheet open={Boolean(selectedTest)} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <SheetContent side="right" className="w-full border-l border-zinc-200 sm:max-w-md">
          {selectedTest && (
            <>
              <SheetHeader>
                <SheetTitle>Exam Blueprint</SheetTitle>
                <SheetDescription>{selectedTest.category} / {selectedTest.subcategoryName ?? "General"}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Exam Name</p>
                  <h2 className="mt-2 text-xl font-semibold">{selectedTest.name}</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Questions</p>
                    <p className="mt-1 text-2xl font-semibold">{selectedTest.totalQuestions}</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="mt-1 text-2xl font-semibold">{selectedTest.duration}m</p>
                  </div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Reasoning Level</p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 flex-1 rounded-sm ${index < getReasoningLevel(selectedTest) ? "bg-indigo-600" : "bg-zinc-200 dark:bg-slate-700"}`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setLocation(`/test/${selectedTest.id}`)}
                >
                  Start Test
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
