import type { EditorialDifficulty } from "./editorial-content";
import { CP001_CONTEXTS, type LegacyEditorialContext } from "./editorial-v2-cp001-contexts";
import { CP002_CONTEXTS } from "./editorial-v2-cp002-contexts";
import { CP003_CONTEXTS } from "./editorial-v2-cp003-contexts";

export function legacyEditorialContext(cpId: string, qlNumber: number): LegacyEditorialContext {
  const contexts = cpId === "PNL-CP-001" ? CP001_CONTEXTS : cpId === "PNL-CP-002" ? CP002_CONTEXTS : CP003_CONTEXTS;
  const start = cpId === "PNL-CP-001" ? 1 : cpId === "PNL-CP-002" ? 37 : 71;
  const context = contexts[qlNumber - start];
  if (!context) throw new Error(`Missing Editorial V2 context for PNL-QL-${String(qlNumber).padStart(3, "0")}.`);
  return context;
}

export const LEGACY_EDITORIAL_DIFFICULTY_OVERRIDES: Readonly<Record<string, EditorialDifficulty>> = {
  "PNL-QL-016": "Medium",
  "PNL-QL-017": "Medium",
  "PNL-QL-026": "Medium",
  "PNL-QL-027": "Medium",
  "PNL-QL-028": "Medium",
  "PNL-QL-029": "Medium",
  "PNL-QL-032": "Medium",
  "PNL-QL-033": "Medium",
  "PNL-QL-034": "Medium",
  "PNL-QL-036": "Medium",
  "PNL-QL-045": "Medium",
  "PNL-QL-046": "Medium",
  "PNL-QL-047": "Medium",
  "PNL-QL-048": "Medium",
  "PNL-QL-056": "Medium",
  "PNL-QL-057": "Medium",
  "PNL-QL-059": "Medium",
  "PNL-QL-060": "Medium",
  "PNL-QL-065": "Medium",
  "PNL-QL-066": "Medium",
  "PNL-QL-068": "Medium",
  "PNL-QL-072": "Medium",
  "PNL-QL-076": "Medium"
};

export function legacyDifficultyRationale(difficulty: EditorialDifficulty, solveMode: string): string {
  if (difficulty === "Easy") return "One visible commercial relationship with a direct substitution or comparison.";
  if (difficulty === "Medium") {
    if (/SP_RATE_TO_CP|AMOUNT_RATE_TO_CP|MARGIN|FRACTION|DIFFERENCE|SUCCESSIVE|EQUIVALENT|CASHBACK|COUPON|EQUAL_SP|RECOVERY_FRACTION/.test(solveMode)) {
      return "A reverse step, base conversion, or two-stage commercial transformation is required.";
    }
    return "Two linked calculations are required, but the reasoning path is directly visible.";
  }
  return "The unknown is coupled to several constraints, weighted groups, eligibility rules, or data-sufficiency logic.";
}
