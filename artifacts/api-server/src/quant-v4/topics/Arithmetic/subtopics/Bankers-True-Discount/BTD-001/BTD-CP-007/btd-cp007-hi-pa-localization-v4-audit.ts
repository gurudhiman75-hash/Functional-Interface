import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";
import {
  BTD_CP007_LANGUAGES_V3,
  BTD_CP007_LOCALIZATION_BOUNDARY_V3,
  BTD_CP007_LOCALIZATION_V3,
  buildBtdLocalizedQuestionV3,
} from "./btd-cp007-hi-pa-localization-v3";

const AUDIT_VERSION = "BTD-001-CP007-HI-PA-LOCALIZATION-AUDIT-v4" as const;
const MIN_UNIQUE_STEMS_PER_100 = 84;
const MAX_EXACT_STEM_FREQUENCY = 4;
const MIN_CHAPTER_UNIQUE_RATE = 0.93;
const DEVANAGARI = /[\u0904-\u0939\u0950-\u0963]/u;
const GURMUKHI = /[\u0A05-\u0A39\u0A59-\u0A5E]/u;
const COMPUTATION = /[0-9₹%=:×/²√−+]/u;
const FORBIDDEN = [
  /undefined/iu,
  /\bNaN\b/u,
  /\bInfinity\b/u,
  /\[object Object\]/u,
  /frozen English/iu,
  /\bFind the\b/iu,
  /\bTherefore\b/iu,
  /\bGiven:/iu,
  /\bAsked:/iu,
  /\bMethod:/iu,
];

assert.equal(BTD_CP007_LOCALIZATION_V3, "BTD-001-CP007-HI-PA-LOCALIZATION-v3");
assert.deepEqual(BTD_CP007_LANGUAGES_V3, ["hi", "pa"]);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.englishAuthorityFrozen, true);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.multilingualFrozen, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.questionStudioDiscoverable, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.questionStudioGenerationEnabled, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.questionBankWritable, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.testEligible, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.mockTestEligible, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V3.publiclyPublishable, false);

let localizedQuestions = 0;
let sourceParityChecks = 0;
let englishAuthorityChecks = 0;
let optionParityChecks = 0;
let misconceptionParityChecks = 0;
let semanticChecks = 0;
let scriptChecks = 0;
let explanationChecks = 0;
let learnerTokenChecks = 0;
let deterministicReplayChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
let diversityChecks = 0;
let totalUniqueWithinScopes = 0;
let observedMinUniquePer100 = 100;
let observedMaxExactStemFrequency = 1;
const answerPositions = [0, 0, 0, 0];
const localizationFingerprints = new Set<string>();
const reviewSamples = new Map<string, any>();
const diversityByScope: Array<Readonly<{
  qlId: string;
  language: string;
  uniqueStems: number;
  duplicateCount: number;
  maxExactStemFrequency: number;
  familyCoverage: readonly string[];
}>> = [];

function normalizedStem(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
}

function learnerText(question: any) {
  return [
    question.presentation.stem,
    question.explanation.whatGiven,
    question.explanation.whatAsked,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
  ].join("\n");
}

function familyKey(stemFamilyId: string) {
  const match = stemFamilyId.match(/(?:T|STEM-)([123])-(HI|PA)$/u);
  assert.ok(match, `unexpected localized stem family ${stemFamilyId}`);
  return match![1]!;
}

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V3) {
    const coverageKey = `${entry.qlId}:${language}`;
    const familyCoverage = new Set<string>();
    const stemCounts = new Map<string, number>();

    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const frozen = buildBtdFrozenEnglishQuestionV1(entry.qlId, seed) as any;
      const localized = buildBtdLocalizedQuestionV3(entry.qlId, seed, language) as any;
      const replay = buildBtdLocalizedQuestionV3(entry.qlId, seed, language) as any;

      assert.equal(localized.sourceStateFingerprint, frozen.sourceStateFingerprint, `${coverageKey}/${seed}: source-state parity drift`);
      sourceParityChecks += 1;
      assert.equal(localized.englishContentFingerprint, frozen.contentFingerprint, `${coverageKey}/${seed}: English authority fingerprint drift`);
      englishAuthorityChecks += 1;

      assert.equal(localized.options.length, 4, `${coverageKey}/${seed}: expected four options`);
      assert.deepEqual(localized.options.map((option: any) => option.text), frozen.options.map((option: any) => option.text), `${coverageKey}/${seed}: option text/order parity drift`);
      assert.deepEqual(localized.options.map((option: any) => option.isCorrect), frozen.options.map((option: any) => Boolean(option.isCorrect)), `${coverageKey}/${seed}: option ownership parity drift`);
      assert.equal(localized.correctIndex, frozen.correctIndex, `${coverageKey}/${seed}: correct-index parity drift`);
      assert.equal(localized.correctAnswer, frozen.correctAnswer, `${coverageKey}/${seed}: correct-answer parity drift`);
      assert.equal(localized.options[localized.correctIndex].text, localized.correctAnswer, `${coverageKey}/${seed}: correct option does not own answer`);
      assert.equal(localized.options.filter((option: any) => option.isCorrect).length, 1, `${coverageKey}/${seed}: expected one correct option`);
      assert.equal(new Set(localized.options.map((option: any) => option.text)).size, 4, `${coverageKey}/${seed}: duplicate option text`);
      optionParityChecks += 7;
      answerPositions[localized.correctIndex] += 1;

      for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
        assert.equal(localized.options[optionIndex].misconceptionId, frozen.options[optionIndex].misconceptionId, `${coverageKey}/${seed}: misconception metadata drift at option ${optionIndex + 1}`);
        misconceptionParityChecks += 1;
      }

      assert.equal(localized.qlId, entry.qlId);
      assert.equal(localized.semanticSignature, entry.semanticSignature);
      assert.equal(localized.answerSemantic, entry.answerSemantic);
      assert.equal(localized.sourceAuthorityId, entry.sourceAuthorityId);
      semanticChecks += 4;

      const expectedScript = language === "hi" ? DEVANAGARI : GURMUKHI;
      assert.ok(expectedScript.test(localized.presentation.stem), `${coverageKey}/${seed}: stem lacks expected script`);
      assert.ok(expectedScript.test(localized.explanation.whatGiven), `${coverageKey}/${seed}: given summary lacks expected script`);
      assert.ok(expectedScript.test(localized.explanation.whatAsked), `${coverageKey}/${seed}: asked line lacks expected script`);
      assert.ok(expectedScript.test(localized.explanation.keyIdea), `${coverageKey}/${seed}: key idea lacks expected script`);
      assert.ok(localized.explanation.steps.some((step: string) => expectedScript.test(step)), `${coverageKey}/${seed}: worked solution lacks expected script`);
      scriptChecks += 5;

      assert.ok(localized.presentation.stem.length >= 35 && localized.presentation.stem.length <= 500, `${coverageKey}/${seed}: localized stem length out of bounds`);
      assert.ok(localized.explanation.whatGiven.length >= 20, `${coverageKey}/${seed}: given summary too thin`);
      assert.ok(localized.explanation.whatAsked.length >= 8, `${coverageKey}/${seed}: asked line too thin`);
      assert.ok(localized.explanation.keyIdea.length >= 15, `${coverageKey}/${seed}: method line too thin`);
      assert.ok(localized.explanation.steps.length >= 2, `${coverageKey}/${seed}: insufficient calculation steps`);
      assert.ok(localized.explanation.steps.every((step: string) => step.length >= 10), `${coverageKey}/${seed}: thin calculation step`);
      assert.ok(localized.explanation.steps.some((step: string) => COMPUTATION.test(step)), `${coverageKey}/${seed}: solution is not computationally grounded`);
      assert.ok(localized.explanation.finalAnswer.includes(localized.correctAnswer), `${coverageKey}/${seed}: final answer does not own canonical answer`);
      assert.notEqual(normalizedStem(localized.explanation.whatGiven), normalizedStem(localized.presentation.stem), `${coverageKey}/${seed}: explanation repeats stem verbatim`);
      explanationChecks += 9;

      const text = learnerText(localized);
      for (const pattern of FORBIDDEN) {
        assert.equal(pattern.test(text), false, `${coverageKey}/${seed}: learner text contains forbidden token ${pattern}`);
        learnerTokenChecks += 1;
      }

      assert.deepEqual(replay, localized, `${coverageKey}/${seed}: localized replay is not deterministic`);
      deterministicReplayChecks += 1;

      assert.equal(localized.lifecycle.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
      assert.equal(localized.lifecycle.englishAuthorityFrozen, true);
      assert.equal(localized.lifecycle.multilingualFrozen, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.mockTestEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      lifecycleChecks += 9;

      const json = JSON.stringify(localized);
      assert.ok(json.length > 250, `${coverageKey}/${seed}: localized package unexpectedly small`);
      assert.equal(JSON.stringify(JSON.parse(json)), json, `${coverageKey}/${seed}: localized JSON round-trip drift`);
      jsonChecks += 2;

      assert.equal(localizationFingerprints.has(localized.localizationFingerprint), false, `${coverageKey}/${seed}: duplicate localization fingerprint`);
      localizationFingerprints.add(localized.localizationFingerprint);

      const stemKey = normalizedStem(localized.presentation.stem);
      stemCounts.set(stemKey, (stemCounts.get(stemKey) ?? 0) + 1);
      const familyId = familyKey(localized.presentation.stemFamilyId);
      familyCoverage.add(familyId);
      const reviewKey = `${coverageKey}:T${familyId}`;
      if (!reviewSamples.has(reviewKey)) reviewSamples.set(reviewKey, localized);
      localizedQuestions += 1;
    }

    const uniqueStems = stemCounts.size;
    const maxExactStemFrequency = Math.max(...stemCounts.values());
    const families = [...familyCoverage].sort();
    assert.ok(uniqueStems >= MIN_UNIQUE_STEMS_PER_100, `${coverageKey}: localized stem pool is thin (${uniqueStems}/100 unique; minimum ${MIN_UNIQUE_STEMS_PER_100})`);
    assert.ok(maxExactStemFrequency <= MAX_EXACT_STEM_FREQUENCY, `${coverageKey}: one exact localized stem repeats ${maxExactStemFrequency} times; maximum ${MAX_EXACT_STEM_FREQUENCY}`);
    assert.deepEqual(families, ["1", "2", "3"], `${coverageKey}: all three localized stem families were not reached`);
    diversityChecks += 3;
    totalUniqueWithinScopes += uniqueStems;
    observedMinUniquePer100 = Math.min(observedMinUniquePer100, uniqueStems);
    observedMaxExactStemFrequency = Math.max(observedMaxExactStemFrequency, maxExactStemFrequency);
    diversityByScope.push(Object.freeze({
      qlId: entry.qlId,
      language,
      uniqueStems,
      duplicateCount: 100 - uniqueStems,
      maxExactStemFrequency,
      familyCoverage: Object.freeze(families),
    }));
  }
}

const chapterUniqueRate = totalUniqueWithinScopes / localizedQuestions;
assert.equal(localizedQuestions, 4000);
assert.equal(localizationFingerprints.size, 4000);
assert.equal(reviewSamples.size, 120, "review corpus must contain 20 QLs × 2 languages × 3 families");
assert.equal(answerPositions.reduce((sum, value) => sum + value, 0), 4000);
assert.ok(chapterUniqueRate >= MIN_CHAPTER_UNIQUE_RATE, `chapter localized unique-stem rate ${chapterUniqueRate} fell below ${MIN_CHAPTER_UNIQUE_RATE}`);
assert.equal(diversityByScope.length, 40);

function renderReview() {
  const lines: string[] = [
    "# BTD-001 CP007 Hindi/Punjabi Localization Review v4",
    "",
    "Status: REVIEW CANDIDATE — NOT FROZEN — NOT QUESTION STUDIO ENABLED",
    "",
    `Diversity gate: at least ${MIN_UNIQUE_STEMS_PER_100}/100 unique stems per QL-language scope; no exact stem more than ${MAX_EXACT_STEM_FREQUENCY} times; chapter unique rate at least ${MIN_CHAPTER_UNIQUE_RATE * 100}%.`,
    "",
  ];

  for (const entry of BTD_PERMANENT_QL_REGISTRY) {
    lines.push(`## ${entry.qlId} — ${entry.title}`, "");
    for (const language of BTD_CP007_LANGUAGES_V3) {
      lines.push(`### ${language === "hi" ? "Hindi" : "Punjabi"}`, "");
      for (const familyId of ["1", "2", "3"]) {
        const q = reviewSamples.get(`${entry.qlId}:${language}:T${familyId}`)!;
        lines.push(`#### Stem family ${familyId}`, "", q.presentation.stem, "", "Options:");
        q.options.forEach((option: any, optionIndex: number) => {
          lines.push(`${optionIndex + 1}. ${option.text}${optionIndex === q.correctIndex ? "  ✓" : ""}`);
        });
        lines.push(
          "",
          `Correct answer: ${q.correctAnswer}`,
          "",
          `Given: ${q.explanation.whatGiven}`,
          "",
          `Asked: ${q.explanation.whatAsked}`,
          "",
          `Method: ${q.explanation.keyIdea}`,
          "",
          "Solution:",
        );
        q.explanation.steps.forEach((step: string, stepIndex: number) => lines.push(`${stepIndex + 1}. ${step}`));
        lines.push("", q.explanation.finalAnswer, "");
      }
    }
  }

  return lines.join("\n");
}

const review = renderReview();
assert.ok(review.length > 50000, "localized review artifact unexpectedly small");
writeFileSync("btd-cp007-hi-pa-review-v4.md", review, "utf8");
writeFileSync("btd-cp007-hi-pa-diversity-v4.json", JSON.stringify({
  thresholds: {
    minUniqueStemsPer100: MIN_UNIQUE_STEMS_PER_100,
    maxExactStemFrequency: MAX_EXACT_STEM_FREQUENCY,
    minChapterUniqueRate: MIN_CHAPTER_UNIQUE_RATE,
  },
  observed: {
    totalUniqueWithinScopes,
    chapterUniqueRate,
    observedMinUniquePer100,
    observedMaxExactStemFrequency,
  },
  scopes: diversityByScope,
}, null, 2), "utf8");

console.log(JSON.stringify({
  auditVersion: AUDIT_VERSION,
  localizationVersion: BTD_CP007_LOCALIZATION_V3,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-007",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP007_LANGUAGES_V3,
  seedsPerQlPerLanguage: 100,
  localizedQuestions,
  sourceParityChecks,
  englishAuthorityChecks,
  optionParityChecks,
  misconceptionParityChecks,
  semanticChecks,
  scriptChecks,
  explanationChecks,
  learnerTokenChecks,
  deterministicReplayChecks,
  lifecycleChecks,
  jsonChecks,
  diversityChecks,
  totalUniqueWithinScopes,
  chapterUniqueRate,
  observedMinUniquePer100,
  observedMaxExactStemFrequency,
  uniqueLocalizationFingerprints: localizationFingerprints.size,
  reviewQuestionCount: reviewSamples.size,
  reviewArtifactBytes: Buffer.byteLength(review, "utf8"),
  answerPositions,
  localizationStatus: BTD_CP007_LOCALIZATION_BOUNDARY_V3.localizationStatus,
  multilingualFrozen: BTD_CP007_LOCALIZATION_BOUNDARY_V3.multilingualFrozen,
  questionStudioDiscoverable: BTD_CP007_LOCALIZATION_BOUNDARY_V3.questionStudioDiscoverable,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP007_HI_PA_LOCALIZATION_AUDIT_V4");
