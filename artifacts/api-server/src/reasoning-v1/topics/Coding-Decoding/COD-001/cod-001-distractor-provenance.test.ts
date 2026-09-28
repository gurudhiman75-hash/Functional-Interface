import assert from "node:assert/strict";

import {
  COD_001_QUESTION_STUDIO_LOCALES,
  COD_001_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-review";
import { generateCod001Question } from "./multilingual-runtime";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

const seedsPerQlLocale = 4;
let questionsChecked = 0;
let wrongOptionsChecked = 0;
const missing: string[] = [];

for (const qlId of COD_001_QUESTION_STUDIO_QL_IDS) {
  for (const locale of COD_001_QUESTION_STUDIO_LOCALES) {
    for (let seed = 0; seed < seedsPerQlLocale; seed++) {
      const question = generateCod001Question(qlId, locale, 31000 + seed) as Record<string, unknown>;
      const options = Array.isArray(question.options) ? question.options : [];
      const correctIndex = Number(question.correctIndex);

      assert.equal(options.length, 4, `${qlId}/${locale}/${seed}: expected four options.`);

      options.forEach((option, optionIndex) => {
        if (optionIndex === correctIndex) return;
        const record = asRecord(option);
        const label = String(record.errorLabel ?? "").trim();
        wrongOptionsChecked++;

        if (!label) {
          missing.push(`${qlId}/${locale}/${seed}/option-${optionIndex + 1}`);
          return;
        }

        assert.doesNotMatch(
          label,
          /^(?:wrong|incorrect|other|random|fallback|distractor)$/i,
          `${qlId}/${locale}/${seed}: distractor provenance is generic ('${label}').`,
        );
      });

      questionsChecked++;
    }
  }
}

assert.deepEqual(
  missing,
  [],
  `Distractor provenance missing for ${missing.length} wrong options. First failures: ${missing.slice(0, 20).join(", ")}`,
);

console.log(JSON.stringify({
  status: "PASS_COD_001_DISTRACTOR_PROVENANCE",
  qlCount: COD_001_QUESTION_STUDIO_QL_IDS.length,
  locales: COD_001_QUESTION_STUDIO_LOCALES,
  seedsPerQlLocale,
  questionsChecked,
  wrongOptionsChecked,
  arbitraryFallbackAllowed: false,
}, null, 2));
