import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";

// First re-run the exhaustive v4 learner-surface/parity/diversity gate.
import "./btd-cp007-hi-pa-localization-v6-audit";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP007_LANGUAGES_V4,
  buildBtdLocalizedQuestionV4,
} from "./btd-cp007-hi-pa-localization-v4";
import {
  BTD_CP007_LOCALIZATION_BOUNDARY_V5,
  BTD_CP007_LOCALIZATION_V5,
  buildBtdLocalizedQuestionV5,
} from "./btd-cp007-hi-pa-localization-v5";

const EXPECTED_SCRIPT = {
  hi: /[\u0904-\u0939\u0950-\u0963]/u,
  pa: /[\u0A05-\u0A39\u0A59-\u0A5E]/u,
} as const;

const EXACT_WORKING_REQUIREMENTS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "BTD-PROT-001": Object.freeze(["/1200", "PW ="]),
  "BTD-PROT-002": Object.freeze(["/1200", "PW =", "TD ="]),
  "BTD-PROT-006": Object.freeze(["BD/TD", "1200/"]),
  "BTD-PROT-007": Object.freeze(["/1200", "PW ="]),
  "BTD-PROT-009": Object.freeze(["BD/TD", "R²"]),
  "BTD-CAND-011": Object.freeze(["F₁ + F₂", "/1200", "F₂"]),
  "BTD-CAND-013": Object.freeze(["/1200", "TD ="]),
  "BTD-CAND-014": Object.freeze(["BD/TD", "1200/"]),
  "BTD-CAND-015": Object.freeze(["/1200", "TD ="]),
  "BTD-CAND-018": Object.freeze(["1 + x", "1200/"]),
  "BTD-CAND-019": Object.freeze(["1200/", "BD", "TD"]),
  "BTD-CAND-020": Object.freeze(["/1200", "BD ="]),
});

assert.equal(BTD_CP007_LOCALIZATION_V5, "BTD-001-CP007-HI-PA-LOCALIZATION-v5");
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.multilingualFrozen, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.questionStudioDiscoverable, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.questionStudioGenerationEnabled, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.questionBankWritable, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.testEligible, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.mockTestEligible, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V5.publiclyPublishable, false);

let packagesChecked = 0;
let invariantSurfaceChecks = 0;
let deterministicChecks = 0;
let exactWorkingChecks = 0;
let nativeStepChecks = 0;
let lifecycleChecks = 0;
let residualEnglishChecks = 0;
const reviewSamples = new Map<string, any>();

function familyKey(stemFamilyId: string) {
  const match = stemFamilyId.match(/(?:T|STEM-)([123])-(HI|PA)$/u);
  assert.ok(match, `unexpected localized stem family ${stemFamilyId}`);
  return match![1]!;
}

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const base = buildBtdLocalizedQuestionV4(entry.qlId, seed, language) as any;
      const localized = buildBtdLocalizedQuestionV5(entry.qlId, seed, language) as any;
      const replay = buildBtdLocalizedQuestionV5(entry.qlId, seed, language) as any;

      assert.equal(localized.sourceStateFingerprint, base.sourceStateFingerprint);
      assert.equal(localized.englishContentFingerprint, base.englishContentFingerprint);
      assert.deepEqual(localized.presentation, base.presentation);
      assert.deepEqual(localized.options, base.options);
      assert.equal(localized.correctIndex, base.correctIndex);
      assert.equal(localized.correctAnswer, base.correctAnswer);
      assert.equal(localized.explanation.whatGiven, base.explanation.whatGiven);
      assert.equal(localized.explanation.whatAsked, base.explanation.whatAsked);
      assert.equal(localized.explanation.keyIdea, base.explanation.keyIdea);
      assert.equal(localized.explanation.finalAnswer, base.explanation.finalAnswer);
      invariantSurfaceChecks += 10;

      assert.deepEqual(replay, localized, `${entry.qlId}/${language}/${seed}: v5 replay drift`);
      deterministicChecks += 1;

      const script = EXPECTED_SCRIPT[language];
      for (const step of localized.explanation.steps as readonly string[]) {
        assert.ok(script.test(step), `${entry.qlId}/${language}/${seed}: exact calculation step lacks native-language lead-in`);
        assert.equal(/\bmonths\b/iu.test(step), false, `${entry.qlId}/${language}/${seed}: English month unit leaked into exact working`);
        assert.equal(/\bFace\b/u.test(step), false, `${entry.qlId}/${language}/${seed}: English Face token leaked into exact working`);
        nativeStepChecks += 3;
      }

      const requirements = EXACT_WORKING_REQUIREMENTS[entry.sourceAuthorityId];
      if (requirements) {
        const working = localized.explanation.steps.join(" ");
        for (const token of requirements) {
          assert.ok(working.includes(token), `${entry.qlId}/${language}/${seed}: exact working missing ${token}`);
          exactWorkingChecks += 1;
        }
        assert.equal(/\bx\s*=.*=\s*0\.\d+/u.test(working), false, `${entry.qlId}/${language}/${seed}: rounded x proxy survived exact-working pass`);
        assert.equal(/0\.\d{3,4}F[₁₂]/u.test(working), false, `${entry.qlId}/${language}/${seed}: rounded weighted-bill coefficient survived exact-working pass`);
        exactWorkingChecks += 2;
      }

      const learnerText = [
        localized.presentation.stem,
        ...localized.options.map((option: any) => option.text),
        localized.correctAnswer,
        localized.explanation.whatGiven,
        localized.explanation.whatAsked,
        localized.explanation.keyIdea,
        ...localized.explanation.steps,
        localized.explanation.finalAnswer,
      ].join("\n");
      assert.equal(/\bmonths\b/iu.test(learnerText), false);
      assert.equal(/\bFace\b/u.test(learnerText), false);
      residualEnglishChecks += 2;

      assert.equal(localized.lifecycle.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
      assert.equal(localized.lifecycle.multilingualFrozen, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.mockTestEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      lifecycleChecks += 8;

      const familyId = familyKey(localized.presentation.stemFamilyId);
      const reviewKey = `${entry.qlId}:${language}:T${familyId}`;
      if (!reviewSamples.has(reviewKey)) reviewSamples.set(reviewKey, localized);
      packagesChecked += 1;
    }
  }
}

assert.equal(packagesChecked, 4000);
assert.equal(reviewSamples.size, 120);

const reviewLines: string[] = [
  "# BTD-001 CP007 Hindi/Punjabi Localization Review v7",
  "",
  "Status: REVIEW CANDIDATE — NOT FROZEN — NOT QUESTION STUDIO ENABLED",
  "",
  "This review corpus uses native time units/formula vocabulary and exact reproducible calculation expressions.",
  "",
];
for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  reviewLines.push(`## ${entry.qlId} — ${entry.title}`, "");
  for (const language of BTD_CP007_LANGUAGES_V4) {
    reviewLines.push(`### ${language === "hi" ? "Hindi" : "Punjabi"}`, "");
    for (const familyId of ["1", "2", "3"]) {
      const q = reviewSamples.get(`${entry.qlId}:${language}:T${familyId}`)!;
      reviewLines.push(`#### Stem family ${familyId}`, "", q.presentation.stem, "", "Options:");
      q.options.forEach((option: any, optionIndex: number) => reviewLines.push(`${optionIndex + 1}. ${option.text}${optionIndex === q.correctIndex ? "  ✓" : ""}`));
      reviewLines.push(
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
      q.explanation.steps.forEach((step: string, stepIndex: number) => reviewLines.push(`${stepIndex + 1}. ${step}`));
      reviewLines.push("", q.explanation.finalAnswer, "");
    }
  }
}
const review = reviewLines.join("\n");
assert.ok(review.length > 50000);
writeFileSync("btd-cp007-hi-pa-review-v7.md", review, "utf8");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP007-HI-PA-LOCALIZATION-AUDIT-v7",
  localizationVersion: BTD_CP007_LOCALIZATION_V5,
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP007_LANGUAGES_V4,
  seedsPerQlPerLanguage: 100,
  packagesChecked,
  invariantSurfaceChecks,
  deterministicChecks,
  exactWorkingChecks,
  nativeStepChecks,
  residualEnglishChecks,
  lifecycleChecks,
  reviewQuestionCount: reviewSamples.size,
  reviewArtifactBytes: Buffer.byteLength(review, "utf8"),
  localizationStatus: BTD_CP007_LOCALIZATION_BOUNDARY_V5.localizationStatus,
  multilingualFrozen: false,
  questionStudioDiscoverable: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP007_HI_PA_LOCALIZATION_AUDIT_V7");
