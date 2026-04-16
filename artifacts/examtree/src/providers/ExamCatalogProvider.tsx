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

export function ExamCatalogProvider({ children }: { children: ReactNode }) {
  const examCatalogQuery = useQuery({
    queryKey: ["exam-catalog"],
    queryFn: async () => {
      const [categories, subcategories, tests] = await Promise.all([
        getCategories(),
        getSubcategories(),
        getTests(),
      ]);
      return { categories, subcategories, tests };
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
