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
  const categoriesQuery = useQuery({
    queryKey: ["exam-catalog", "categories"],
    queryFn: getCategories,
    staleTime: 60_000,
    retry: 2,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  const testsQuery = useQuery({
    queryKey: ["exam-catalog", "tests"],
    queryFn: getTests,
    staleTime: 60_000,
    retry: 2,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const value = useMemo((): ExamCatalogContextValue => {
    const apiCategories = categoriesQuery.data ?? [];
    const apiTests = testsQuery.data ?? [];
    return {
      categories: mergeRuntimeCategoriesFromApi(apiCategories),
      tests: mergeRuntimeTestsFromApi(apiTests),
      isLoading: categoriesQuery.isLoading || testsQuery.isLoading,
      error: (categoriesQuery.error ?? testsQuery.error) as Error | null,
    };
  }, [
    categoriesQuery.data,
    categoriesQuery.isLoading,
    categoriesQuery.error,
    testsQuery.data,
    testsQuery.isLoading,
    testsQuery.error,
  ]);

  return <ExamCatalogContext.Provider value={value}>{children}</ExamCatalogContext.Provider>;
}

export function useExamCatalog(): ExamCatalogContextValue {
  const ctx = useContext(ExamCatalogContext);
  if (!ctx) {
    throw new Error("useExamCatalog must be used within ExamCatalogProvider");
  }
  return ctx;
}
