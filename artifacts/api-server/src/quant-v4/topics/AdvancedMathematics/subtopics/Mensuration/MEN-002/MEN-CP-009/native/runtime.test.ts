import assert from "node:assert/strict";
import { MEN_CP_009_FROZEN_QLS_V2 } from "../coverage-v2/registry";
import { buildMenCp009V3StudentReviewBatch } from "../coverage-v2/student-review-batch-v3";
import { generateMenCp009ApprovedEnglishView } from "../approved/english";
import { generateMenCp009NativeDraftView } from "./runtime";
import type { MenCp009NativeLanguage } from "./types";

const languages = ["hi", "pa"] as const satisfies readonly MenCp009NativeLanguage[];
const forbiddenEnglish = /\b(?:sphere|hemisphere|radius|diameter|surface|volume|find|cost|painted|polished|ratio|increase|answer|litres?|capacity|total|curved|second|cancel|obtain|hence)\b/i;
const devanagari = /[\u0900-\u097F]/;
const gurmukhi = /[\u0A00-\u0A7F]/;

function assertNativeSurface(
  language: MenCp009NativeLanguage,
  qlId: string,
  seed: string,
) {
  const source = generateMenCp009ApprovedEnglishView(qlId, seed);
  const first = generateMenCp009NativeDraftView(qlId, seed, language);
  const second = generateMenCp009NativeDraftView(qlId, seed, language);

  assert.deepEqual(first, second, `${qlId} ${language}: native draft must be deterministic.`);
  assert.equal(first.sourceEnglishReleaseId, "MEN-CP009-EN-V3-APPROVED");
  assert.equal(first.sourceEnglishAuthority, "MEN-CP009-STUDENT-VIEW-V3");
  assert.equal(first.permanentQlId, source.permanentQlId);
  assert.equal(first.familyId, source.familyId);
  assert.equal(first.solveMode, source.solveMode);
  assert.equal(first.correctIndex, source.correctIndex);
  assert.equal(first.options.length, 4);
  assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
  assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(first.parity.valid, true);
  assert.equal(first.parity.optionMathParity, true);
  assert.equal(first.parity.answerMathParity, true);
  assert.equal(first.parity.correctIndexParity, true);
  assert.equal(first.parity.correctOptionParity, true);
  assert.equal(first.sourceValidationPassed, true);
  assert.equal(first.sourceVerificationPassed, true);
  assert.ok(first.explanationLines.length >= 2 && first.explanationLines.length <= 4);
  assert.equal(first.showDiagram, false);

  const learnerText = [first.stem, ...first.explanationLines].join(" ");
  assert.equal(forbiddenEnglish.test(learnerText), false, `${qlId} ${language}: English prose leaked: ${learnerText}`);
  assert.equal(
    language === "hi" ? devanagari.test(first.stem) : gurmukhi.test(first.stem),
    true,
    `${qlId} ${language}: expected native script in stem.`,
  );
  assert.equal(
    language === "hi" ? devanagari.test(first.explanationLines[0]!) : gurmukhi.test(first.explanationLines[0]!),
    true,
    `${qlId} ${language}: expected native script in explanation.`,
  );

  assert.equal(first.reviewStatus, "PENDING_NATIVE_EDITORIAL");
  assert.equal(first.humanReviewStatus, "PENDING_HUMAN_REVIEW");
  assert.equal(first.active, false);
  assert.equal(first.questionStudioDiscoverable, false);
  assert.equal(first.questionBankStatus, "NOT_STORED");
  assert.equal(first.questionBankWritable, false);
  assert.equal(first.testEligibility, "INELIGIBLE");
  assert.equal(first.testEligible, false);
  assert.equal(first.publiclyPublishable, false);

  return first;
}

const reviewed = buildMenCp009V3StudentReviewBatch();
assert.equal(reviewed.rows.length, 110);
assert.equal(reviewed.uniqueLearnerStems, 110);
assert.equal(Object.keys(reviewed.semanticReviewCountByQl).length, 28);

const reviewedStemSets = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};
const reviewedQlSets = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};

let reviewedNativeCount = 0;
for (const row of reviewed.rows) {
  for (const language of languages) {
    const native = assertNativeSurface(language, row.permanentQlId, row.seed);
    reviewedStemSets[language].add(native.stem);
    reviewedQlSets[language].add(native.permanentQlId);
    reviewedNativeCount += 1;
  }
}

assert.equal(reviewedNativeCount, 220);
assert.equal(reviewedStemSets.hi.size, 110);
assert.equal(reviewedStemSets.pa.size, 110);
assert.equal(reviewedQlSets.hi.size, 28);
assert.equal(reviewedQlSets.pa.size, 28);

let regressionCount = 0;
for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
  for (const language of languages) {
    const positions = new Set<number>();
    for (let index = 0; index < 40; index += 1) {
      const native = assertNativeSurface(
        language,
        definition.qlId,
        `men-cp009-native-v1:${language}:${definition.qlId}:${index}`,
      );
      positions.add(native.correctIndex);
      regressionCount += 1;
    }
    assert.deepEqual(
      [...positions].sort(),
      [0, 1, 2, 3],
      `${definition.qlId} ${language}: all four answer positions must remain reachable.`,
    );
  }
}

assert.equal(regressionCount, 28 * 2 * 40);
assert.throws(
  () => generateMenCp009NativeDraftView("MEN-002-QL-999", "unknown", "hi"),
  /Unknown MEN-CP-009/,
);

console.log(
  `MEN-CP-009 multilingual draft V1 passed: ${reviewedNativeCount} Hindi/Punjabi review surfaces preserve the approved 110-question English V3 artifact, ` +
    `${regressionCount} deterministic parity packages passed across 28 QLs, and every product lifecycle gate remains locked.`,
);
