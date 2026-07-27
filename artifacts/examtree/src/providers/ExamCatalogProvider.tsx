import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getSubcategories, getTests, type Category, type Subcategory, type Test } from "@/lib/data";
import { mergeRuntimeTestsFromApi } from "@/lib/test-bank";

export type ExamCatalogContextValue = {
  categories: Category[];
  subcategories: Subcategory[];
  tests: Test[];
  isLoading: boolean;
  error: Error | null;
};

const defaultCatalog: ExamCatalogContextValue = {
  categories: [],
  subcategories: [],
  tests: [],
  isLoading: true,
  error: null,
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

  const value = useMemo((): ExamCatalogContextValue => {
    const apiCategories = examCatalogQuery.data?.categories ?? [];
    const apiSubcategories = examCatalogQuery.data?.subcategories ?? [];
    const apiTests = examCatalogQuery.data?.tests ?? [];
    return {
      categories: apiCategories,
      subcategories: apiSubcategories,
      tests: mergeRuntimeTestsFromApi(apiTests),
      isLoading: examCatalogQuery.isLoading,
      error: examCatalogQuery.error as Error | null,
    };
  }, [examCatalogQuery.data, examCatalogQuery.isLoading, examCatalogQuery.error]);

  return <ExamCatalogContext.Provider value={value}>{children}</ExamCatalogContext.Provider>;
}

export function useExamCatalog(): ExamCatalogContextValue {
  return useContext(ExamCatalogContext);
}
