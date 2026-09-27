import assert from "node:assert/strict";

import { buildTrg002Cp007LocalizedReviewBank } from "../topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp007-v1";
import { buildTrg002Cp008LocalizedReviewBank } from "../topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp008-v1";
import { buildTrg002Cp009LocalizedReviewBank } from "../topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp009-v1";
import { buildTrg002Cp010LocalizedReviewBank } from "../topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/localization-cp010-v1";

const FORBIDDEN_LEARNER_PROSE = [
  /\bdrop\b/iu,
  /\brise\b/iu,
  /\bhorizontal\b/iu,
  /\bvertical\b/iu,
  /\bopposite\b/iu,
  /\badjacent\b/iu,
  /\btriangle\b/iu,
  /\bsight[- ]line\b/iu,
  /\bline of sight\b/iu,
  /\broof[- ]level\b/iu,
  /\beye[- ]height\b/iu,
  /\btotal height\b/iu,
  /\bmast height\b/iu,
  /\bwidth\b/iu,
] as const;

function learnerStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(learnerStrings);
  if (!value || typeof value !== "object") return [];
  return Object.values(value as Record<string, unknown>).flatMap(learnerStrings);
}

const builders = [
  ["CP007", buildTrg002Cp007LocalizedReviewBank],
  ["CP008", buildTrg002Cp008LocalizedReviewBank],
  ["CP009", buildTrg002Cp009LocalizedReviewBank],
  ["CP010", buildTrg002Cp010LocalizedReviewBank],
] as const;

let reviewedQuestions = 0;
for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (const [cp, build] of builders) {
    const bank = build(locale, 1);
    assert.ok(bank.length > 0, `${cp} ${locale} review bank is empty.`);
    reviewedQuestions += bank.length;

    for (const question of bank) {
      const texts = [
        question.stem,
        ...learnerStrings(question.explanation),
      ].filter((value): value is string => typeof value === "string");

      for (const text of texts) {
        for (const pattern of FORBIDDEN_LEARNER_PROSE) {
          assert.equal(
            pattern.test(text),
            false,
            `${cp} ${locale} ${question.qlId} leaks English learner prose ${pattern}: ${text}`,
          );
        }
      }
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_TRG002_NATIVE_LANGUAGE_LEAKAGE_P3",
  reviewedQuestions,
  locales: ["hi-IN", "pa-IN"],
  cps: ["CP007", "CP008", "CP009", "CP010"],
  humanApprovalGranted: false,
  multilingualFreezeGranted: false,
}));
