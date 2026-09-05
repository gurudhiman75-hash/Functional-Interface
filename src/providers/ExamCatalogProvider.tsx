import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getSubcategories, getTests, type Category, type Subcategory, type Test } from "@/lib/data";
import { mergeRuntimeTestsFromApi } from "@/lib/test-bank";

export type ExamCatalogContextValue = {
  categories: Category[];
  subcategories: Subcategory[];
  tests: Test[];
  isLoading: boolean;
  isRetrying: boolean;
  error: Error | null;
  retryCatalog: () => Promise<void>;
};

const defaultCatalog: ExamCatalogContextValue = {
  categories: [],
  subcategories: [],
  tests: [],
  isLoading: true,
  isRetrying: false,
  error: null,
  retryCatalog: async () => {},
};

const ExamCatalogContext = createContext<ExamCatalogContextValue>(defaultCatalog);

function readListPayload<T>(value: unknown, key: string): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const nested = (value as Record<string, unknown>)[key];
    if (Array.isArray(nested)) return nested as T[];
    const data = (value as Record<string, unknown>).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

export function ExamCatalogProvider({ children }: { children: ReactNode }) {
  const examCatalogQuery = useQuery({
    queryKey: ["exam-catalog"],
    queryFn: async () => {
      const [categoryPayload, subcategoryPayload, testPayload] = await Promise.all([
        getCategories() as Promise<unknown>,
        getSubcategories() as Promise<unknown>,
        getTests() as Promise<unknown>,
      ]);
      return {
        categories: readListPayload<Category>(categoryPayload, "categories"),
        subcategories: readListPayload<Subcategory>(subcategoryPayload, "subcategories"),
        tests: readListPayload<Test>(testPayload, "tests"),
      };
    },
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const retryCatalog = useCallback(async () => {
    await examCatalogQuery.refetch();
  }, [examCatalogQuery.refetch]);

  const value = useMemo((): ExamCatalogContextValue => {
    const apiCategories = examCatalogQuery.data?.categories ?? [];
    const apiSubcategories = examCatalogQuery.data?.subcategories ?? [];
    const apiTests = examCatalogQuery.data?.tests ?? [];
    const fatalError = examCatalogQuery.data === undefined
      ? examCatalogQuery.error as Error | null
      : null;

    return {
      categories: apiCategories,
      subcategories: apiSubcategories,
      tests: mergeRuntimeTestsFromApi(apiTests),
      isLoading: examCatalogQuery.isLoading,
      isRetrying: examCatalogQuery.isFetching && !examCatalogQuery.isLoading,
      error: fatalError,
      retryCatalog,
    };
  }, [
    examCatalogQuery.data,
    examCatalogQuery.error,
    examCatalogQuery.isFetching,
    examCatalogQuery.isLoading,
    retryCatalog,
  ]);

  return <ExamCatalogContext.Provider value={value}>{children}</ExamCatalogContext.Provider>;
}

export function useExamCatalog(): ExamCatalogContextValue {
  return useContext(ExamCatalogContext);
}

function CatalogFailureState() {
  const { retryCatalog, isRetrying } = useExamCatalog();

  return (
    <div className="examtree-shell min-h-screen bg-background" data-testid="catalog-unavailable">
      <main className="mx-auto flex min-h-[75vh] max-w-2xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-2xl border border-amber-200 bg-white p-7 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]" role="alert" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Catalog temporarily unavailable</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">We couldn’t load the live exam catalog</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Your saved attempts are safe. Retry the catalog without reloading the app, or use the support page if the problem continues.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void retryCatalog()}
              disabled={isRetrying}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#1e1b4b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-950 disabled:cursor-wait disabled:opacity-60"
            >
              {isRetrying ? "Retrying catalog…" : "Retry catalog"}
            </button>
            <a
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Contact support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function CatalogAvailabilityGate({ children, requireCatalog }: { children: ReactNode; requireCatalog: boolean }) {
  const { error } = useExamCatalog();
  if (requireCatalog && error) return <CatalogFailureState />;
  return <>{children}</>;
}

export function ExamCatalogRouteProvider({ children, requireCatalog = false }: { children: ReactNode; requireCatalog?: boolean }) {
  return (
    <ExamCatalogProvider>
      <CatalogAvailabilityGate requireCatalog={requireCatalog}>{children}</CatalogAvailabilityGate>
    </ExamCatalogProvider>
  );
}
