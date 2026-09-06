import { strict as assert } from "node:assert";

import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-chapter-freeze-v1";
import { COM003_HINDI_LOCALIZATION_WAVE1_V3, COM003_PUNJABI_LOCALIZATION_WAVE1_V3 } from "./com003-localization-wave1-v3";
import { COM003_HINDI_LOCALIZATION_WAVE2_V3, COM003_PUNJABI_LOCALIZATION_WAVE2_V3 } from "./com003-localization-wave2-v3";
import { COM003_HINDI_LOCALIZATION_WAVE3_V2, COM003_PUNJABI_LOCALIZATION_WAVE3_V2 } from "./com003-localization-wave3-v2";
import { COM003_HINDI_LOCALIZATION_WAVE4_V2, COM003_PUNJABI_LOCALIZATION_WAVE4_V2 } from "./com003-localization-wave4-v2";
import {
  COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1,
  runCom003QuestionStudioPreRegistration,
} from "./com003-question-studio-pre-registration-adapter-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";

const LANGUAGES = ["en", "hi", "pa"] as const;
const QL_IDS = Array.from({ length: 19 }, (_, index) => `COM-003-QL-${String(index + 1).padStart(3, "0")}`);
const localized = {
  hi: [
    ...COM003_HINDI_LOCALIZATION_WAVE1_V3,
    ...COM003_HINDI_LOCALIZATION_WAVE2_V3,
    ...COM003_HINDI_LOCALIZATION_WAVE3_V2,
    ...COM003_HINDI_LOCALIZATION_WAVE4_V2,
  ],
  pa: [
    ...COM003_PUNJABI_LOCALIZATION_WAVE1_V3,
    ...COM003_PUNJABI_LOCALIZATION_WAVE2_V3,
    ...COM003_PUNJABI_LOCALIZATION_WAVE3_V2,
    ...COM003_PUNJABI_LOCALIZATION_WAVE4_V2,
  ],
};
const localizedByLanguage = {
  hi: new Map(localized.hi.map((item) => [item.sourceQuestionId, item])),
  pa: new Map(localized.pa.map((item) => [item.sourceQuestionId, item])),
};
const englishById = new Map(COM003_ENGLISH_REVIEW_CORPUS_V4.map((item) => [item.questionId, item]));

function stable(value: unknown) { return JSON.stringify(value); }
function assertThrows(action: () => unknown, label: string) {
  let failed = false;
  try { action(); } catch { failed = true; }
  assert.equal(failed, true, `${label}: invalid request did not fail closed.`);
}
function assertLocked(response: ReturnType<typeof runCom003QuestionStudioPreRegistration>, label: string) {
  assert.equal(response.generationContext.corpusAuthorityId, COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId, `${label}: corpus authority drift.`);
  assert.equal(response.generationContext.packageId, "COM-003", `${label}: package drift.`);
  assert.equal(response.generationContext.registrationStatus, "NOT_REGISTERED", `${label}: registration gate opened.`);
  assert.equal(response.generationContext.questionStudioDiscoverable, false, `${label}: discoverability opened.`);
  assert.equal(response.generationContext.preRegistrationOnly, true, `${label}: pre-registration marker missing.`);
  assert.equal(response.generationContext.readOnly, true, `${label}: read-only marker missing.`);
  assert.equal(response.generationContext.questionBankStatus, "NOT_STORED", `${label}: storage gate opened.`);
  assert.equal(response.generationContext.testEligibility, "INELIGIBLE", `${label}: test gate opened.`);
  assert.equal(response.generationContext.publiclyPublishable, false, `${label}: publication gate opened.`);
  assert.equal(response.generationContext.productionReleased, false, `${label}: production gate opened.`);
  assert.equal(response.questions.length, response.generationContext.count, `${label}: count mismatch.`);
  assert.equal(response.trace.length, response.questions.length, `${label}: trace count mismatch.`);
  assert.equal(new Set(response.questions.map((item) => item.sourceQuestionId)).size, response.questions.length, `${label}: duplicate frozen question emitted.`);
  for (const question of response.questions) {
    assert.equal(question.corpusStatus, "FROZEN", `${label}/${question.id}: corpus is not frozen.`);
    assert.equal(question.registrationStatus, "NOT_REGISTERED", `${label}/${question.id}: question registered early.`);
    assert.equal(question.preRegistrationOnly, true, `${label}/${question.id}: pre-registration marker missing.`);
    assert.equal(question.questionStudioDiscoverable, false, `${label}/${question.id}: question became discoverable.`);
    assert.equal(question.readOnly, true, `${label}/${question.id}: question not read-only.`);
    assert.equal(question.questionBankStatus, "NOT_STORED", `${label}/${question.id}: question stored early.`);
    assert.equal(question.testEligibility, "INELIGIBLE", `${label}/${question.id}: question became test eligible.`);
    assert.equal(question.publiclyPublishable, false, `${label}/${question.id}: question became publishable.`);
    assert.equal(question.productionReleased, false, `${label}/${question.id}: question released early.`);
    assert.equal(question.options.length, 4, `${label}/${question.id}: option count drift.`);
    assert.equal(new Set(question.options).size, 4, `${label}/${question.id}: option collision.`);
    assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${label}/${question.id}: invalid correct index.`);
    assert.equal(question.answer, question.options[question.correctIndex], `${label}/${question.id}: answer/index mismatch.`);
    assert(question.explanation.length > 0, `${label}/${question.id}: explanation missing.`);
    assert(question.sourceFactIds.length >= 1, `${label}/${question.id}: source fact lineage missing.`);
    assert(question.sourceIds.length >= 1, `${label}/${question.id}: source lineage missing.`);
    assert.equal(question.solverAuthority, "CANONICAL_FACT_RELATION", `${label}/${question.id}: solver authority drift.`);
  }
  JSON.parse(JSON.stringify(response));
}

const capability = COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1;
assert.equal(capability.corpus.authorityId, COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(capability.corpus.englishQuestionCount, 228);
assert.equal(capability.corpus.hindiQuestionCount, 228);
assert.equal(capability.corpus.punjabiQuestionCount, 228);
assert.equal(capability.corpus.questionsPerQlPerLanguage, 12);
assert.equal(capability.corpus.qlCount, 19);
assert.equal(capability.corpus.immutable, true);
assert.equal(capability.corpus.deterministicSelection, true);
assert.equal(capability.corpus.selectionWithoutReplacement, true);
assert.equal(capability.qlIds.length, 19);
assert.deepEqual([...capability.qlIds], QL_IDS);
assert.deepEqual([...capability.supportedLanguages], ["en", "hi", "pa"]);
assert.equal(capability.difficultySelection.supported, false);
assert.equal(capability.difficultySelection.policy, "FAIL_CLOSED");
assert.equal(capability.registrationStatus, "NOT_REGISTERED");
assert.equal(capability.questionStudioDiscoverable, false);
assert.equal(capability.preRegistrationOnly, true);
assert.equal(capability.readOnly, true);
assert.equal(capability.questionBankStatus, "NOT_STORED");
assert.equal(capability.testEligibility, "INELIGIBLE");
assert.equal(capability.publiclyPublishable, false);
assert.equal(capability.productionReleased, false);

const counters = {
  directQlLanguageChecks: 0,
  deterministicReplayChecks: 0,
  crossLanguageParityChecks: 0,
  exactFrozenArtifactChecks: 0,
  fullCorpusLanguageChecks: 0,
  cpSelectorChecks: 0,
  aliasChecks: 0,
  invalidRequestChecks: 0,
};

for (const qlId of QL_IDS) {
  const byLanguage = new Map<string, ReturnType<typeof runCom003QuestionStudioPreRegistration>>();
  for (const language of LANGUAGES) {
    const request = {
      packageId: "COM-003",
      patternId: qlId,
      language,
      seed: `com003-question-studio-audit:${qlId}`,
      count: 12,
    } as const;
    const response = runCom003QuestionStudioPreRegistration(request);
    const replay = runCom003QuestionStudioPreRegistration(request);
    assert.equal(stable(response), stable(replay), `${qlId}/${language}: deterministic replay failed.`);
    assertLocked(response, `${qlId}/${language}`);
    assert.equal(response.questions.length, 12, `${qlId}/${language}: QL count drift.`);
    assert(response.questions.every((item) => item.qlId === qlId), `${qlId}/${language}: cross-QL leakage.`);
    byLanguage.set(language, response);
    counters.directQlLanguageChecks += 1;
    counters.deterministicReplayChecks += 1;
  }

  const english = byLanguage.get("en")!;
  for (const language of ["hi", "pa"] as const) {
    const target = byLanguage.get(language)!;
    assert.deepEqual(target.questions.map((item) => item.sourceQuestionId), english.questions.map((item) => item.sourceQuestionId), `${qlId}/${language}: deterministic source alignment failed.`);
    for (let index = 0; index < 12; index += 1) {
      const en = english.questions[index]!;
      const loc = target.questions[index]!;
      assert.equal(loc.correctIndex, en.correctIndex, `${qlId}/${language}/${index}: correct index drift.`);
      assert.equal(loc.qlId, en.qlId, `${qlId}/${language}/${index}: QL drift.`);
      assert.equal(loc.cpId, en.cpId, `${qlId}/${language}/${index}: CP drift.`);
      assert.equal(loc.surfaceMode, en.surfaceMode, `${qlId}/${language}/${index}: surface drift.`);
      assert.equal(loc.targetFactId, en.targetFactId, `${qlId}/${language}/${index}: fact drift.`);
      assert.deepEqual(loc.sourceFactIds, en.sourceFactIds, `${qlId}/${language}/${index}: fact provenance drift.`);
      assert.deepEqual(loc.sourceIds, en.sourceIds, `${qlId}/${language}/${index}: source provenance drift.`);
      assert.equal(loc.versionScoped, en.versionScoped, `${qlId}/${language}/${index}: version-scope drift.`);
      assert.equal(loc.solverAuthority, en.solverAuthority, `${qlId}/${language}/${index}: solver drift.`);
      counters.crossLanguageParityChecks += 1;
    }
  }
}

for (const language of LANGUAGES) {
  const response = runCom003QuestionStudioPreRegistration({
    chapterCode: "COM-003",
    language,
    seed: "com003-question-studio-full-corpus",
    count: 228,
  });
  assertLocked(response, `full-corpus/${language}`);
  assert.equal(response.questions.length, 228, `full-corpus/${language}: corpus size drift.`);
  assert.equal(new Set(response.questions.map((item) => item.sourceQuestionId)).size, 228, `full-corpus/${language}: duplicate source questions.`);
  assert.equal(new Set(response.questions.map((item) => item.qlId)).size, 19, `full-corpus/${language}: QL coverage drift.`);
  counters.fullCorpusLanguageChecks += 1;

  for (const question of response.questions) {
    const englishSource = englishById.get(question.sourceQuestionId)!;
    assert(englishSource, `full-corpus/${language}/${question.id}: missing English source.`);
    if (language === "en") {
      assert.equal(question.stem, englishSource.stem, `${question.id}: English stem mutated.`);
      assert.deepEqual(question.options, englishSource.options, `${question.id}: English options mutated.`);
      assert.equal(question.explanation, englishSource.explanation, `${question.id}: English explanation mutated.`);
    } else {
      const frozenLocalized = localizedByLanguage[language].get(question.sourceQuestionId)!;
      assert(frozenLocalized, `${question.id}: missing frozen ${language} artifact.`);
      assert.equal(question.id, frozenLocalized.localizationId, `${question.id}: localized artifact ID drift.`);
      assert.equal(question.stem, frozenLocalized.stem, `${question.id}: localized stem mutated.`);
      assert.deepEqual(question.options, frozenLocalized.options, `${question.id}: localized options mutated.`);
      assert.equal(question.correctIndex, frozenLocalized.correctIndex, `${question.id}: localized correct index mutated.`);
      assert.equal(question.answer, frozenLocalized.canonicalAnswer, `${question.id}: localized answer mutated.`);
      assert.equal(question.explanation, frozenLocalized.explanation, `${question.id}: localized explanation mutated.`);
    }
    counters.exactFrozenArtifactChecks += 1;
  }
}

for (const cpId of ["COM-003-CP-001", "COM-003-CP-002", "COM-003-CP-003", "COM-003-CP-004"] as const) {
  const expectedCount = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((item) => item.cpId === cpId).length;
  const response = runCom003QuestionStudioPreRegistration({
    packageId: "COM-003",
    cpId,
    questionLanguageId: "en-IN",
    seed: `com003-question-studio-cp:${cpId}`,
    count: expectedCount,
  });
  assertLocked(response, cpId);
  assert.equal(response.questions.length, expectedCount, `${cpId}: CP count drift.`);
  assert(response.questions.every((item) => item.cpId === cpId), `${cpId}: CP leakage.`);
  counters.cpSelectorChecks += 1;
}

const aliases = [
  runCom003QuestionStudioPreRegistration({ archetypeId: "COM-003", topic: "Computer Awareness", subtopic: "Office Software", language: "English", seed: "alias-en", count: 3 }),
  runCom003QuestionStudioPreRegistration({ chapterCode: "COM-003", topic: "Computer", subtopic: "Microsoft Office", questionLanguageId: "hi-IN", seed: "alias-hi", count: 3 }),
  runCom003QuestionStudioPreRegistration({ packageId: "COM-003", topic: "Office & Productivity Software", subtopic: "Office & Productivity Software", questionLanguageId: "pa-IN", seed: "alias-pa", count: 3 }),
];
for (const [index, response] of aliases.entries()) {
  assertLocked(response, `alias-${index + 1}`);
  counters.aliasChecks += 1;
}

const invalidRequests: Array<() => unknown> = [
  () => runCom003QuestionStudioPreRegistration({ packageId: "COM-999", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ chapterCode: "COM-002", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ topic: "Networking", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ subtopic: "Operating Systems", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ patternId: "COM-003-QL-999", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ qlId: "COM-003-QL-001", patternId: "COM-003-QL-002", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ cpId: "COM-003-CP-999", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ language: "fr", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ language: "hi", questionLanguageId: "pa-IN", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ difficulty: "Easy", seed: "x" }),
  () => runCom003QuestionStudioPreRegistration({ seed: "" }),
  () => runCom003QuestionStudioPreRegistration({ patternId: "COM-003-QL-001", seed: "x", count: 13 }),
  () => runCom003QuestionStudioPreRegistration({ seed: "x", count: 229 }),
  () => runCom003QuestionStudioPreRegistration({ seed: "x", count: 0 }),
  () => runCom003QuestionStudioPreRegistration({ seed: "x", count: 1.5 }),
];
for (const [index, action] of invalidRequests.entries()) {
  assertThrows(action, `invalid-${index + 1}`);
  counters.invalidRequestChecks += 1;
}

assert.equal(COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.governance.questionStudioRegistrationGateAuthorized, true);
assert.equal(COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.governance.questionStudioRegistered, false);
assert.equal(COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.governance.runtimeRegistrationAuthorized, false);
assert.equal(COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.governance.questionBankWritesAuthorized, false);
assert.equal(COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.governance.testEligibilityAuthorized, false);
assert.equal(COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.governance.productionReleased, false);

console.log("[COM003-QUESTION-STUDIO-PRE-REGISTRATION-AUDIT-V1]", {
  valid: true,
  qlCount: 19,
  languages: LANGUAGES,
  frozenQuestionsPerLanguage: 228,
  frozenQuestionLanguageArtifacts: 684,
  selectionMode: "FROZEN_CORPUS_DETERMINISTIC_WITHOUT_REPLACEMENT",
  difficultyFilteringAuthorized: false,
  registrationStatus: capability.registrationStatus,
  questionStudioDiscoverable: capability.questionStudioDiscoverable,
  questionBankStatus: capability.questionBankStatus,
  testEligibility: capability.testEligibility,
  publiclyPublishable: capability.publiclyPublishable,
  productionReleased: capability.productionReleased,
  counters,
});
