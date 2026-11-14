import { apiRequest } from "@/lib/api";

export const PREPARATION_CATEGORIES = [
  { id: "ssc", label: "SSC" },
  { id: "banking", label: "Banking" },
  { id: "punjab-government", label: "Punjab Government" },
  { id: "railways", label: "Railways" },
  { id: "insurance", label: "Insurance" },
  { id: "other", label: "Other exams" },
] as const;
export interface PreparationPreferences { categories: string[]; onboardingCompleted: boolean; }
export const getPreparationPreferences = () => apiRequest<PreparationPreferences>("/users/me/preparation-preferences");
export const savePreparationPreferences = (categories: string[]) => apiRequest<PreparationPreferences>("/users/me/preparation-preferences", {
  method: "PUT", body: JSON.stringify({ categories }),
});
export function preparationDestination(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    && !/^\/(login|preparation|admin)(?:[/?#]|$)/.test(value) ? value : "/dashboard";
}
