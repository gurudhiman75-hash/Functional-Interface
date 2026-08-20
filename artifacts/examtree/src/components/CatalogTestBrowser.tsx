import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, Search, SlidersHorizontal } from "lucide-react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Test } from "@/lib/data";

const PAGE_SIZE = 18;

type AccessFilter = "all" | "free" | "paid";
type DifficultyFilter = "all" | Test["difficulty"];
type KindFilter = "all" | NonNullable<Test["kind"]>;
type SortMode = "attempts" | "name" | "duration" | "questions";

function languageLabel(code: string) {
  if (code === "en") return "English";
  if (code === "hi") return "Hindi";
  if (code === "pa") return "Punjabi";
  return code.toUpperCase();
}

export function CatalogTestBrowser({ tests }: { tests: Test[] }) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<AccessFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<SortMode>("attempts");
  const [page, setPage] = useState(1);

  const availableLanguages = useMemo(() => {
    return Array.from(new Set(tests.flatMap((test) => test.languages ?? ["en"]))).sort();
  }, [tests]);

  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matching = tests.filter((test) => {
      if (access !== "all" && (test.access ?? "free") !== access) return false;
      if (difficulty !== "all" && test.difficulty !== difficulty) return false;
      if (kind !== "all" && (test.kind ?? "full-length") !== kind) return false;
      if (language !== "all" && !(test.languages ?? ["en"]).includes(language)) return false;
      if (!normalizedQuery) return true;

      return [
        test.name,
        test.category,
        test.categoryName ?? "",
        test.subcategoryName ?? "",
        test.kind ?? "full-length",
        ...(test.languages ?? ["en"]),
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    return matching.toSorted((left, right) => {
      if (sort === "name") return left.name.localeCompare(right.name);
      if (sort === "duration") return left.duration - right.duration || left.name.localeCompare(right.name);
      if (sort === "questions") return right.totalQuestions - left.totalQuestions || left.name.localeCompare(right.name);
      return (right.attempts ?? 0) - (left.attempts ?? 0) || left.name.localeCompare(right.name);
    });
  }, [access, difficulty, kind, language, query, sort, tests]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageTests = filteredTests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const start = filteredTests.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, filteredTests.length);
  const hasFilters = Boolean(query.trim()) || access !== "all" || difficulty !== "all" || kind !== "all" || language !== "all" || sort !== "attempts";

  useEffect(() => {
    setPage(1);
  }, [access, difficulty, kind, language, query, sort]);

  const clearFilters = () => {
    setQuery("");
    setAccess("all");
    setDifficulty("all");
    setKind("all");
    setLanguage("all");
    setSort("attempts");
  };

  return (
    <section className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" data-testid="catalog-test-browser">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            All catalog tests
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Find the right test without scrolling forever.</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Search the full catalog, narrow by access, level, format or language, then sort and page through the matching tests.
          </p>
        </div>
        <p className="text-sm font-medium tabular-nums text-slate-600" aria-live="polite" data-testid="catalog-result-count">
          {filteredTests.length === 0 ? "0 matches" : `Showing ${start}-${end} of ${filteredTests.length}`}
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.6fr)_repeat(5,minmax(130px,1fr))]">
        <label className="relative block md:col-span-2 xl:col-span-1">
          <span className="sr-only">Search catalog tests</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search test, exam or topic..."
            className="h-11 bg-white pl-10"
            data-testid="catalog-search"
          />
        </label>

        <label>
          <span className="sr-only">Filter by access</span>
          <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700" value={access} onChange={(event) => setAccess(event.target.value as AccessFilter)} data-testid="catalog-access-filter">
            <option value="all">All access</option>
            <option value="free">Free</option>
            <option value="paid">Premium</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by difficulty</span>
          <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700" value={difficulty} onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)} data-testid="catalog-difficulty-filter">
            <option value="all">All levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by test format</span>
          <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700" value={kind} onChange={(event) => setKind(event.target.value as KindFilter)} data-testid="catalog-kind-filter">
            <option value="all">All formats</option>
            <option value="full-length">Full length</option>
            <option value="sectional">Sectional</option>
            <option value="topic-wise">Topic wise</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by language</span>
          <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700" value={language} onChange={(event) => setLanguage(event.target.value)} data-testid="catalog-language-filter">
            <option value="all">All languages</option>
            {availableLanguages.map((code) => <option key={code} value={code}>{languageLabel(code)}</option>)}
          </select>
        </label>

        <label>
          <span className="sr-only">Sort catalog tests</span>
          <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700" value={sort} onChange={(event) => setSort(event.target.value as SortMode)} data-testid="catalog-sort">
            <option value="attempts">Most attempted</option>
            <option value="name">Name A-Z</option>
            <option value="duration">Shortest first</option>
            <option value="questions">Most questions</option>
          </select>
        </label>
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
        </div>
      )}

      {pageTests.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="catalog-page-grid">
          {pageTests.map((test) => {
            const paid = (test.access ?? "free") === "paid";
            return (
              <article key={test.id} className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-indigo-300 hover:bg-white hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-500">{test.categoryName ?? test.category} · {test.subcategoryName ?? "General"}</p>
                    <h3 className="mt-1 line-clamp-2 font-semibold text-slate-950">{test.name}</h3>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold ${paid ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {paid ? "Premium" : "Free"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-md bg-white px-2 py-1">{test.totalQuestions} Q</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{test.duration} min</span>
                  <span className="rounded-md bg-white px-2 py-1">{test.difficulty}</span>
                  <span className="rounded-md bg-white px-2 py-1">{(test.kind ?? "full-length").replace("-", " ")}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-500">
                  {(test.languages ?? ["en"]).map((code) => <span key={code} className="rounded-md border border-slate-200 bg-white px-2 py-1">{languageLabel(code)}</span>)}
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-1 tabular-nums">{(test.attempts ?? 0).toLocaleString()} attempts</span>
                </div>

                <Button className="mt-4 w-full" size="sm" variant="outline" onClick={() => setLocation(`/test/${test.id}`)}>
                  Open test <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center" data-testid="catalog-empty-state">
          <h3 className="font-semibold text-slate-950">No tests match these filters</h3>
          <p className="mt-2 text-sm text-slate-600">Clear one or more filters or try a broader search term.</p>
          <Button className="mt-4" variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      )}

      {filteredTests.length > PAGE_SIZE && (
        <nav className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Catalog pagination">
          <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} data-testid="catalog-previous-page">Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} data-testid="catalog-next-page">Next</Button>
          </div>
        </nav>
      )}
    </section>
  );
}
