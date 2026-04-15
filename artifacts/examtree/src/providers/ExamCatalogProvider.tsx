import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTests, type Category, type Test } from "@/lib/data";
import { mergeRuntimeCategoriesFromApi, mergeRuntimeTestsFromApi } from "@/lib/test-bank";

export type ExamCatalogContextValue = {
  categories: Category[];
  tests: Test[];
  isLoading: boolean;
  error: Error | null;
};

const ExamCatalogContext = createContext<ExamCatalogContextValue | null>(null);

export function ExamCatalogProvider({ children }: { children: ReactNode }) {
  const examCatalogQuery = useQuery({
    queryKey: ["exam-catalog"],
    queryFn: async () => {
      const [categories, tests] = await Promise.all([getCategories(), getTests()]);
      return { categories, tests };
    },
    staleTime: 60_000,
    retry: 2,
    refetchOnWindowFocus: true,
  });

  const value = useMemo((): ExamCatalogContextValue => {
    const apiCategories = examCatalogQuery.data?.categories ?? [];
    const apiTests = examCatalogQuery.data?.tests ?? [];
    return {
      categories: mergeRuntimeCategoriesFromApi(apiCategories),
      tests: mergeRuntimeTestsFromApi(apiTests),
      isLoading: examCatalogQuery.isLoading,
      error: examCatalogQuery.error as Error | null,
    };
  }, [examCatalogQuery.data, examCatalogQuery.isLoading, examCatalogQuery.error]);

  return <ExamCatalogContext.Provider value={value}>{children}</ExamCatalogContext.Provider>;
}

export function useExamCatalog(): ExamCatalogContextValue {
  const ctx = useContext(ExamCatalogContext);
  if (!ctx) {
    throw new Error("useExamCatalog must be used within ExamCatalogProvider");
  }
  return ctx;
}
