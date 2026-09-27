import assert from "node:assert/strict";

import {
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  buildRnkCp006PermanentRuntime,
  rnkCp006PermanentProjectionSha256,
} from "./cp006-permanent-runtime-v1";
import {
  buildRnkCp006LocalizedReviewBankV1,
  RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION,
  type RnkCp006LocalizedLocale,
} from "./cp006-localization-review-v1";

const canonical = buildRnkCp006PermanentRuntime();
const locales = ["hi-IN", "pa-IN"] as const satisfies readonly RnkCp006LocalizedLocale[];

assert.equal(canonical.length, 576);
assert.equal(
  rnkCp006PermanentProjectionSha256(canonical),
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  "CP006 frozen English projection drifted",
);

const qlCounts = new Map<string, number>();
const modeCounts = new Map<string, number>();
const contextCounts = new Map<string, number>();
let localizedQuestions = 0;
let clueParityChecks = 0;
let optionParityChecks = 0;
let lifecycleChecks = 0;
let structuredStateChecks = 0;
const localizationFingerprints = new Set<string>();

function learnerText(question: ReturnType<typeof buildRnkCp006LocalizedReviewBankV1>[number]): string {
  return [question.stem, ...question.clues, ...question.options, ...question.explanation].join("\n");
}

for (const locale of locales) {
  const localized = buildRnkCp006LocalizedReviewBankV1(locale);
  const replay = buildRnkCp006LocalizedReviewBankV1(locale);
  assert.equal(localized.length, 576, `${locale}: localized bank size`);
  assert.deepEqual(localized, replay, `${locale}: deterministic replay`);

  localized.forEach((question, index) => {
    const source = canonical[index]!;
    localizedQuestions += 1;

    assert.equal(question.checkpointId, source.checkpointId);
    assert.equal(question.sourceForm, source.sourceForm);
    assert.equal(question.authorityId, source.authorityId);
    assert.equal(question.authorityOrdinal, source.authorityOrdinal);
    assert.equal(question.seed, source.seed);
    assert.equal(question.mode, source.mode);
    assert.equal(question.context, source.context);
    assert.equal(question.difficulty, source.difficulty);
    assert.equal(question.correctIndex, source.correctIndex);
    assert.equal(question.permanentRuntimeFingerprint, source.permanentRuntimeFingerprint);
    assert.deepEqual(question.state, source.state);
    assert.deepEqual(question.permanentProfile, source.permanentProfile);
    structuredStateChecks += 1;

    assert.equal(question.clues.length, source.clues.length);
    assert.equal(question.options.length, source.options.length);
    clueParityChecks += question.clues.length;
    optionParityChecks += question.options.length;

    assert.equal(new Set(question.options).size, question.options.length, `${locale} ${question.permanentProfile.permanentQlId}: duplicate options`);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.ok(question.stem.trim().length > 0);
    assert.ok(question.explanation.length >= 2);
    assert.ok(question.explanation.every((line) => line.trim().length > 0));

    const text = learnerText(question);
    assert.doesNotMatch(text, /\b(?:Aman|Ananya|Arjun|Gurleen|Harleen|Ishaan|Jaspreet|Karan|Mehak|Navdeep|Pooja|Riya|Simran|Tanvi)\b/, `${locale}: canonical name leakage`);
    assert.doesNotMatch(text, /[A-Za-z]/, `${locale}: residual Latin learner prose`);
    if (locale === "hi-IN") assert.match(text, /[\u0900-\u097F]/, "Hindi learner text must contain Devanagari");
    if (locale === "pa-IN") assert.match(text, /[\u0A00-\u0A7F]/, "Punjabi learner text must contain Gurmukhi");

    assert.equal(question.lifecycle.hindiPunjabi, "REVIEW_CANDIDATE");
    assert.equal(question.lifecycle.questionStudio, "DISABLED");
    assert.equal(question.lifecycle.persistence, "DISABLED");
    assert.equal(question.lifecycle.questionBank, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.humanLanguageReviewRequired, true);
    assert.equal(question.lifecycle.multilingualFreezeGranted, false);
    assert.equal(question.lifecycle.productDeliveryUnlocked, false);
    lifecycleChecks += 1;

    assert.equal(question.localizationProof.version, RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION);
    assert.equal(question.localizationProof.canonicalPermanentRuntimeFingerprint, source.permanentRuntimeFingerprint);
    assert.equal(question.localizationProof.canonicalMathematicalStateKey, source.state.mathematicalStateKey);
    assert.equal(question.localizationProof.structuredStateReconstruction, true);
    assert.equal(question.localizationProof.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(question.localizationProof.humanLanguageReviewRequired, true);
    assert.equal(question.localizationProof.multilingualFreezeGranted, false);
    assert.equal(question.localizationProof.productDeliveryUnlocked, false);

    assert.ok(
      !localizationFingerprints.has(question.localizationProof.localizationFingerprint),
      `${locale}: duplicate localization fingerprint`,
    );
    localizationFingerprints.add(question.localizationProof.localizationFingerprint);

    const ql = question.permanentProfile.permanentQlId;
    qlCounts.set(`${locale}:${ql}`, (qlCounts.get(`${locale}:${ql}`) ?? 0) + 1);
    modeCounts.set(`${locale}:${question.mode}`, (modeCounts.get(`${locale}:${question.mode}`) ?? 0) + 1);
    contextCounts.set(`${locale}:${question.context}`, (contextCounts.get(`${locale}:${question.context}`) ?? 0) + 1);
  });
}

for (const locale of locales) {
  for (const ql of ["RNK-QL-039", "RNK-QL-040", "RNK-QL-041"]) {
    assert.equal(qlCounts.get(`${locale}:${ql}`), 192, `${locale}:${ql} count`);
  }
  assert.equal(modeCounts.get(`${locale}:PAIR_LOCAL_BRIDGE`), 96);
  assert.equal(modeCounts.get(`${locale}:PAIR_FULL_CHAIN`), 96);
  assert.equal(modeCounts.get(`${locale}:ENDPOINT_HIGHEST`), 96);
  assert.equal(modeCounts.get(`${locale}:ENDPOINT_LOWEST`), 96);
  assert.equal(modeCounts.get(`${locale}:COMPLETE_WEAK_ORDER`), 192);
  for (const context of ["HEIGHT", "SCORES", "SPEED", "SENIORITY", "PERFORMANCE"]) {
    assert.ok((contextCounts.get(`${locale}:${context}`) ?? 0) > 0, `${locale}:${context} missing`);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION,
  canonicalQuestions: canonical.length,
  localizedQuestions,
  structuredStateChecks,
  clueParityChecks,
  optionParityChecks,
  lifecycleChecks,
  localizationFingerprints: localizationFingerprints.size,
  qlCounts: Object.fromEntries([...qlCounts.entries()].sort()),
  modeCounts: Object.fromEntries([...modeCounts.entries()].sort()),
  contexts: [...new Set(canonical.map((question) => question.context))].sort(),
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
