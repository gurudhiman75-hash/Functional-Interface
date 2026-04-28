import { useQuery } from "@tanstack/react-query";
import { listPatterns, type PatternOption } from "@/lib/data";

export function usePatterns(options?: { enabled?: boolean }) {
  return useQuery<PatternOption[]>({
    queryKey: ["generator-patterns"],
    queryFn: listPatterns,
    staleTime: 60_000,
    enabled: options?.enabled ?? true,
  });
}
