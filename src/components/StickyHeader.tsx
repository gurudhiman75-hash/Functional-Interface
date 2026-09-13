import { useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronDown, CircleUserRound, Compass, Search } from "lucide-react";
import { useLocation } from "wouter";

import { CategoryIcon } from "@/components/CategoryIcon";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

function routeId(location: string, prefix: string) {
  return location.startsWith(prefix)
    ? decodeURIComponent(location.slice(prefix.length).split("/")[0] ?? "")
    : "";
}

export function StickyHeader() {
  const [location, setLocation] = useLocation();
  const { categories, subcategories, tests } = useExamCatalog();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const nodes = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );

  const selected = useMemo(() => {
    const categoryId = routeId(location, "/category/");
    const subcategoryId = routeId(location, "/subcategory/");
    const testId = routeId(location, "/test/");

    if (testId) {
      for (const category of nodes) {
        for (const subcategory of category.subcategories) {
          const test = subcategory.tests.find((item) => item.id === testId);
          if (test) return { category, subcategory, test };
        }
      }
    }

    if (subcategoryId) {
      for (const category of nodes) {
        const subcategory = category.subcategories.find((item) => item.id === subcategoryId);
        if (subcategory) return { category, subcategory, test: null };
      }
    }

    if (categoryId) {
      const category = nodes.find((item) => item.id === categoryId);
      if (category) return { category, subcategory: null, test: null };
    }

    return null;
  }, [location, nodes]);

  const selectorLabel = selected
    ? [selected.category.name, selected.subcategory?.name, selected.test?.name].filter(Boolean).join(" > ")
    : "Select Targeted Exam";

  return (
    <header
      className={`et-chrome et-shell-header fixed inset-x-0 top-0 z-50 border-b font-sans transition-[padding] duration-300 md:left-[var(--sidebar-width)] ${compact ? "py-2" : "py-4"}`}
      data-testid="app-sticky-header"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6">
        <SidebarTrigger className="h-11 w-11 shrink-0 rounded-xl border border-border bg-card/90 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground et-interactive" />

        <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:flex">
          <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
          ExamTree
        </div>

        <div className="relative mx-auto min-w-0 max-w-2xl flex-1">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="et-interactive flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-full border border-border bg-card/90 px-4 text-left text-sm font-semibold text-foreground shadow-sm hover:border-primary/30 hover:bg-muted"
            aria-expanded={open}
            aria-controls="exam-selector-panel"
            aria-haspopup="dialog"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{selectorLabel}</span>
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>

          {open && (
            <div
              id="exam-selector-panel"
              role="dialog"
              aria-label="Choose exam or published test"
              className="et-popover absolute left-1/2 top-full mt-3 max-h-[70vh] w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto rounded-2xl p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-4 sm:items-center">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Live exam selector</p>
                  <h2 className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">Choose category, exam, or published test</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setLocation("/exams")}
                  className="et-interactive min-h-11 shrink-0 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  <span className="hidden sm:inline">Open full explorer</span>
                  <span className="sm:hidden">Explorer</span>
                </button>
              </div>

              {nodes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                  No published tests are available yet.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {nodes.map((category) => (
                    <div key={category.id} className="et-panel rounded-xl p-3">
                      <button
                        type="button"
                        onClick={() => setLocation(`/category/${category.id}`)}
                        className="et-interactive flex min-h-11 w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                          <CategoryIcon icon={category.icon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-foreground">{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.tests.length} tests</span>
                        </span>
                      </button>

                      <div className="mt-2 space-y-1">
                        {category.subcategories.slice(0, 3).map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => setLocation(`/subcategory/${subcategory.id}`)}
                            className="et-interactive flex min-h-11 w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                          >
                            <span className="truncate">{subcategory.name}</span>
                            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{subcategory.tests.length}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setLocation("/dashboard")}
            className="et-interactive flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-primary"
            aria-label="My activity"
            title="My activity"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setLocation("/profile")}
            className="et-interactive flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-primary"
            aria-label="User profile"
            title="User profile"
          >
            <CircleUserRound className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}