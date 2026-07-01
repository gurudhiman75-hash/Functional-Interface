export const PREFERRED_SCENARIO_ROOTS = [
  "students",
  "workers",
  "books",
  "trees",
  "employees",
  "marks",
  "salary",
  "profit",
  "income",
  "savings",
  "revenue",
  "population",
  "distance",
  "area",
  "production",
  "inventory",
] as const;

export const FORBIDDEN_EVENT_ROOTS = [
  "marriage",
  "marriages",
  "accident",
  "accidents",
  "death",
  "deaths",
  "birth",
  "births",
  "illness",
  "illnesses",
  "complaint",
  "complaints",
  "case",
  "cases",
  "incident",
  "incidents",
  "application",
  "applications",
  "patient",
  "patients",
] as const;

export function normalizeContextLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, " ");
}

export function contextWords(label: string): readonly string[] {
  return normalizeContextLabel(label).split(" ");
}

export function hasForbiddenEventRoot(label: string): boolean {
  const words = new Set(contextWords(label));
  return FORBIDDEN_EVENT_ROOTS.some((root) => words.has(root));
}

export function hasPreferredScenarioRoot(label: string): boolean {
  const words = new Set(contextWords(label));
  return PREFERRED_SCENARIO_ROOTS.some((root) => words.has(root));
}

