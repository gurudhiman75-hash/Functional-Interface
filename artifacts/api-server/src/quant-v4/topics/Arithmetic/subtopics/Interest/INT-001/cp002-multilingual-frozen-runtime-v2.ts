import type { IntCp002FinalQlId } from "./cp002-final-registry";
import {
  generateIntCp002LocalizedFrozenQuestionV1,
  type IntCp002LocalizedLanguage,
} from "./cp002-multilingual-frozen-runtime-v1";

export const INT_CP002_HI_PA_FREEZE_V2 = Object.freeze({
  freezeId: "INT-CP-002-HI-PA-v2-direct-calculation-frozen" as const,
  supersedes: "INT-CP-002-HI-PA-v1-frozen" as const,
  reason: "Remove algebra-setup-only learner lines and retain only calculation-dense numerical working.",
  minimumCalculationLines: 3 as const,
  maximumCalculationLines: 6 as const,
});

const NUMERIC = /[0-9०-९੦-੯]/u;
const CALCULATION = /[=×÷+−^/]|\\(?:frac|times)/u;

function isDirectCalculation(line: string): boolean {
  return NUMERIC.test(line) && CALCULATION.test(line);
}

function normalizeCalculationLine(line: string): string {
  return line
    .replace(/\s+/gu, " ")
    .replace(/(?<=\d)-(?=[A-Za-z0-9])/gu, "−")
    .trim();
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp002LocalizedFrozenQuestionV2(
  qlId: IntCp002FinalQlId,
  seed: string,
  language: IntCp002LocalizedLanguage,
) {
  const source = generateIntCp002LocalizedFrozenQuestionV1(qlId, seed, language);
  const candidates = [
    ...(source.explanation.workedSteps ?? []),
    source.explanation.examShortcut,
  ]
    .filter(Boolean)
    .map((line) => normalizeCalculationLine(String(line)))
    .filter(isDirectCalculation);

  const seen = new Set<string>();
  const direct = candidates.filter((line) => {
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  }).slice(0, INT_CP002_HI_PA_FREEZE_V2.maximumCalculationLines);

  if (direct.length < INT_CP002_HI_PA_FREEZE_V2.minimumCalculationLines) {
    throw new Error(`${qlId}/${language}: only ${direct.length} direct numerical working lines survived CP002 localization.`);
  }

  const explanation = Object.freeze({
    ...source.explanation,
    mainRule: "",
    workedSteps: Object.freeze(direct),
    examShortcut: "",
    verification: "",
    trapAnalysis: Object.freeze([]),
  });

  return deepFreeze({
    ...source,
    freezeId: INT_CP002_HI_PA_FREEZE_V2.freezeId,
    explanation,
    explanationPresentationPolicy: "DIRECT_CALCULATION_ONLY" as const,
    localization: Object.freeze({
      ...source.localization,
      version: INT_CP002_HI_PA_FREEZE_V2.freezeId,
      directCalculationOnly: true as const,
      minimumCalculationLines: INT_CP002_HI_PA_FREEZE_V2.minimumCalculationLines,
    }),
  });
}