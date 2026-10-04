import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bell, ChevronDown, CircleUserRound, Compass, Flame, Search } from "lucide-react";
import { useLocation } from "wouter";

import { CategoryIcon } from "@/components/CategoryIcon";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { getUser } from "@/lib/storage";

function routeId(location: string, prefix: string) {
  return location.startsWith(prefix)
    ? decodeURIComponent(location.slice(prefix.length).split("/")[0] ?? "")
    : "";
}

export function StickyHeader() {
  const [location, setLocation] = useLocation();
  const { categories, subcategories, tests } = useExamCatalog();
  const user = getUser();
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

  if (location === "/dashboard") {
    const initials = (user?.name || "Student").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    return (
      <header className="et-chrome et-shell-header fixed inset-x-0 top-0 z-50 border-b py-2 md:left-[var(--sidebar-width)]" data-testid="app-sticky-header">
        <div className="flex min-h-12 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <SidebarTrigger className="h-10 w-10 shrink-0 rounded-xl border border-border bg-card/90 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground" />
          <label className="relative hidden w-full max-w-xl md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#577097]" aria-hidden="true" />
            <input
              className="h-10 w-full rounded-xl border border-[#e1e8f3] bg-[#f3f7fc] pl-11 pr-4 text-xs text-[#314a70] outline-none placeholder:text-[#8190a8] focus:border-[#9cbcff] focus:bg-white"
              placeholder="Search exams, tests, topics..."
              aria-label="Search exams, tests, topics"
              onKeyDown={(event) => {
                if (event.key === "Enter") setLocation("/exams");
              }}
            />
          </label>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setLocation("/dashboard")} className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-left hover:bg-muted sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fff0e5] text-[#f26d21]"><Flame className="h-4 w-4" /></span>
              <span className="leading-tight"><b className="block text-xs text-[#10234a]">12 days</b><small className="text-[9px] text-[#75839c]">Study Streak</small></span>
            </button>
            <button type="button" className="relative grid h-10 w-10 place-items-center rounded-xl text-[#27466f] hover:bg-muted" aria-label="Notifications">
              <Bell className="h-5 w-5" /><i className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button type="button" onClick={() => setLocation("/profile")} className="flex min-h-10 items-center gap-2 rounded-xl px-2 hover:bg-muted">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2c72ed] text-[10px] font-black text-white">{initials || "ST"}</span>
              <span className="hidden max-w-32 truncate text-xs font-bold text-[#10234a] sm:block">{user?.name || "Student"}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[#6880a2] sm:block" />
            </button>
          </div>
        </div>
      </header>
    );
  }

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