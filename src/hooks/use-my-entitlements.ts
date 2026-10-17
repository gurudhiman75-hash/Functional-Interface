import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ApiError } from "@/lib/api";
import { fetchMyEntitlements } from "@/lib/data";

export function useMyEntitlements() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      void queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
      void queryClient.invalidateQueries({ queryKey: ["exam", "test-detail"] });
    }
  }, [queryClient]);

  return useQuery({
    queryKey: ["me", "entitlements"],
    queryFn: async () => {
      try {
        return await fetchMyEntitlements();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          return { testIds: [] as string[] };
        }
        throw e;
      }
    },
    staleTime: 15_000,
  });
}
