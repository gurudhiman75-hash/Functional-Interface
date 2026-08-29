import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";
import {
  BTD_CP007_LANGUAGES_V2,
  BTD_CP007_LOCALIZATION_BOUNDARY_V2,
  BTD_CP007_LOCALIZATION_V2,
  buildBtdLocalizedQuestionV2,
} from "./btd-cp007-hi-pa-localization-v2";

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const FORBIDDEN = [/undefined/iu, /\bNaN\b/u, /\bInfinity\b/u, /\[object Object\]/u, /frozen English/iu, /जमे हुए अंग्रेज़ी/u, /ਜਮੇ ਹੋਏ ਅੰਗਰੇਜ਼ੀ/u, /\bFind the\b/iu, /\bTherefore\b/iu, /\bGiven:/iu, /\bAsked:/iu, /\bMethod:/iu];

assert.equal(BTD_CP007_LOCALIZATION_V2, "BTD-001-CP007-HI-PA-LOCALIZATION-v2");
assert.deepEqual(BTD_CP007_LANGUAGES_V2, ["hi", "pa"]);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.englishAuthorityFrozen, true);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.multilingualFrozen, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.questionStudioDiscoverable, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.questionStudioGenerationEnabled, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.questionBankWritable, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.testEligible, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.mockTestEligible, false);
assert.equal(BTD_CP007_LOCALIZATION_BOUNDARY_V2.publiclyPublishable, false);

let localizedQuestions = 0;
let sourceParityChecks = 0;
let englishAuthorityChecks = 0;
let optionParityChecks = 0;
let semanticChecks = 0;
let scriptChecks = 0;
let explanationChecks = 0;
let learnerTokenChecks = 0;
let deterministicReplayChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
const exactStems = new Set<string>();
const localizationFingerprints = new Set<string>();
const familyCoverage = new Map<string, Set<string>>();
const reviewSamples = new Map<string, any>();

function normalizedStem(value: string) { return value.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(); }
function learnerText(question: any) { return [question.presentation.stem, question.explanation.whatGiven, question.explanation.whatAsked, question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer].join("\n"); }
function familyKey(stemFamilyId: string) { const match = stemFamilyId.match(/T([123])-(HI|PA)$/u); assert.ok(match, `unexpected localized stem family ${stemFamilyId}`); return match![1]!; }

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V2) {
    const coverageKey = `${entry.qlId}:${language}`;
    familyCoverage.set(coverageKey, new Set());
    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const frozen = buildBtdFrozenEnglishQuestionV1(entry.qlId, seed) as any;
      const localized = buildBtdLocalizedQuestionV2(entry.qlId, seed, language) as any;
      const replay = buildBtdLocalizedQuestionV2(entry.qlId, seed, language) as any;

      assert.equal(localized.sourceStateFingerprint, frozen.sourceStateFingerprint, `${coverageKey}/${seed}: source state parity drift`);
      sourceParityChecks += 1;
      assert.equal(localized.englishContentFingerprint, frozen.contentFingerprint, `${coverageKey}/${seed}: English authority fingerprint drift`);
      englishAuthorityChecks += 1;
      assert.deepEqual(localized.options.map((option: any) => option.text), frozen.options.map((option: any) => option.text), `${coverageKey}/${seed}: option text/order parity drift`);
      assert.equal(localized.correctIndex, frozen.correctIndex, `${coverageKey}/${seed}: correct-index parity drift`);
      assert.equal(localized.correctAnswer, frozen.correctAnswer, `${coverageKey}/${seed}: correct-answer parity drift`);
      optionParityChecks += 3;

      assert.equal(localized.qlId, entry.qlId);
      assert.equal(localized.semanticSignature, entry.semanticSignature);
      assert.equal(localized.answerSemantic, entry.answerSemantic);
      assert.equal(localized.sourceAuthorityId, entry.sourceAuthorityId);
      semanticChecks += 4;

      const text = learnerText(localized);
      const script = language === "hi" ? DEVANAGARI : GURMUKHI;
      assert.ok(script.test(localized.presentation.stem), `${coverageKey}/${seed}: stem lacks expected script`);
      assert.ok(script.test(localized.explanation.whatGiven), `${coverageKey}/${seed}: given summary lacks expected script`);
      assert.ok(script.test(localized.explanation.whatAsked), `${coverageKey}/${seed}: asked line lacks expected script`);
      assert.ok(script.test(localized.explanation.keyIdea), `${coverageKey}/${seed}: key idea lacks expected script`);
      assert.ok(localized.explanation.steps.some((step: string) => script.test(step)), `${coverageKey}/${seed}: solution steps lack expected script`);
      scriptChecks += 5;

      assert.ok(localized.presentation.stem.length >= 35 && localized.presentation.stem.length <= 500, `${coverageKey}/${seed}: localized stem length out of bounds`);
      assert.ok(localized.explanation.whatGiven.length >= 20);
      assert.ok(localized.explanation.whatAsked.length >= 8);
      assert.ok(localized.explanation.keyIdea.length >= 15);
      assert.ok(localized.explanation.steps.length >= 2);
      assert.ok(localized.explanation.steps.every((step: string) => step.length >= 10));
      assert.ok(localized.explanation.steps.some((step: string) => /[0-9₹%=:×/²√−+]/u.test(step)), `${coverageKey}/${seed}: solution is not computationally grounded`);
      assert.ok(localized.explanation.finalAnswer.includes(localized.correctAnswer), `${coverageKey}/${seed}: final answer does not own canonical answer`);
      assert.notEqual(normalizedStem(localized.explanation.whatGiven), normalizedStem(localized.presentation.stem));
      explanationChecks += 9;

      for (const pattern of FORBIDDEN) { assert.equal(pattern.test(text), false, `${coverageKey}/${seed}: learner text contains forbidden token ${pattern}`); learnerTokenChecks += 1; }
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
      assert.ok(json.length > 200);
      assert.equal(JSON.stringify(JSON.parse(json)), json, `${coverageKey}/${seed}: localized JSON round-trip drift`);
      jsonChecks += 2;

      const stemKey = `${language}:${normalizedStem(localized.presentation.stem)}`;
      assert.equal(exactStems.has(stemKey), false, `${coverageKey}/${seed}: exact localized stem collision`);
      exactStems.add(stemKey);
      assert.equal(localizationFingerprints.has(localized.localizationFingerprint), false, `${coverageKey}/${seed}: duplicate localization fingerprint`);
      localizationFingerprints.add(localized.localizationFingerprint);

      const familyId = familyKey(localized.presentation.stemFamilyId);
      familyCoverage.get(coverageKey)!.add(familyId);
      const reviewKey = `${coverageKey}:T${familyId}`;
      if (!reviewSamples.has(reviewKey)) reviewSamples.set(reviewKey, localized);
      localizedQuestions += 1;
    }
    assert.deepEqual([...familyCoverage.get(coverageKey)!].sort(), ["1", "2", "3"], `${coverageKey}: did not reach all three stem families`);
  }
}

assert.equal(localizedQuestions, 4000);
assert.equal(exactStems.size, 4000);
assert.equal(localizationFingerprints.size, 4000);
assert.equal(reviewSamples.size, 120, "review corpus must contain 20 QLs × 2 languages × 3 families");

function renderReview() {
  const lines: string[] = ["# BTD-001 CP007 Hindi/Punjabi Localization Review v2", "", "Status: REVIEW CANDIDATE — NOT FROZEN — NOT QUESTION STUDIO ENABLED", ""];
  for (const entry of BTD_PERMANENT_QL_REGISTRY) {
    lines.push(`## ${entry.qlId} — ${entry.title}`, "");
    for (const language of BTD_CP007_LANGUAGES_V2) {
      lines.push(`### ${language === "hi" ? "Hindi" : "Punjabi"}`, "");
      for (const familyId of ["1", "2", "3"]) {
        const q = reviewSamples.get(`${entry.qlId}:${language}:T${familyId}`)!;
        lines.push(`#### Stem family ${familyId}`, "", q.presentation.stem, "", "Options:");
        q.options.forEach((option: any, index: number) => lines.push(`${index + 1}. ${option.text}${index === q.correctIndex ? "  ✓" : ""}`));
        lines.push("", `Correct answer: ${q.correctAnswer}`, "", `Given: ${q.explanation.whatGiven}`, "", `Asked: ${q.explanation.whatAsked}`, "", `Method: ${q.explanation.keyIdea}`, "", "Solution:");
        q.explanation.steps.forEach((step: string, index: number) => lines.push(`${index + 1}. ${step}`));
        lines.push("", q.explanation.finalAnswer, "");
      }
    }
  }
  return lines.join("\n");
}

const review = renderReview();
assert.ok(review.length > 50000, "localized review artifact unexpectedly small");
writeFileSync("btd-cp007-hi-pa-review-v2.md", review, "utf8");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP007-HI-PA-LOCALIZATION-AUDIT-v2",
  localizationVersion: BTD_CP007_LOCALIZATION_V2,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-007",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP007_LANGUAGES_V2,
  seedsPerQlPerLanguage: 100,
  localizedQuestions,
  sourceParityChecks,
  englishAuthorityChecks,
  optionParityChecks,
  semanticChecks,
  scriptChecks,
  explanationChecks,
  learnerTokenChecks,
  deterministicReplayChecks,
  lifecycleChecks,
  jsonChecks,
  exactLocalizedStems: exactStems.size,
  uniqueLocalizationFingerprints: localizationFingerprints.size,
  reviewQuestionCount: reviewSamples.size,
  reviewArtifactBytes: Buffer.byteLength(review, "utf8"),
  localizationStatus: BTD_CP007_LOCALIZATION_BOUNDARY_V2.localizationStatus,
  multilingualFrozen: BTD_CP007_LOCALIZATION_BOUNDARY_V2.multilingualFrozen,
  questionStudioDiscoverable: BTD_CP007_LOCALIZATION_BOUNDARY_V2.questionStudioDiscoverable,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP007_HI_PA_LOCALIZATION_AUDIT_V2");
