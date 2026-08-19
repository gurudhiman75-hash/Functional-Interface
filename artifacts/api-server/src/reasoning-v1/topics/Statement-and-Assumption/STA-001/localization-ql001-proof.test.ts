import { strict as assert } from "node:assert";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { STA_ENGLISH_FREEZE_V2_MANIFEST } from "./english-freeze-manifest.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import { generateStaQl001LocalizedQuestion, STA_QL001_LOCALIZATION_LIFECYCLE } from "./localization-ql001.ts";
import { STA_QL001_HINDI_REVIEW_COPY, STA_QL001_PUNJABI_REVIEW_COPY } from "./localization-ql001-copy.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const SOURCE = STA_ENGLISH_CORPUS_BY_QL["STA-QL-001"];
const EXPECTED_AUTHORITY_COUNT = 16;
const CASES_PER_LOCALE = Number(process.env.STA_QL001_LOCALIZATION_CASES_PER_LOCALE ?? 768);

function sameArray(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function validateBundle(locale: StaLocalizedLocale, bundle: StaLocalizationBundle, script: RegExp): void {
  const sourceIds = SOURCE.map((scenario) => scenario.scenarioId).sort();
  const localizedIds = Object.keys(bundle).sort();
  assert.deepEqual(localizedIds, sourceIds, `${locale}: localization authority set must exactly match frozen QL001`);

  for (const source of SOURCE) {
    const localized = bundle[source.scenarioId];
    assert.ok(localized, `${locale}:${source.scenarioId}: missing localization`);
    assert.equal(localized.statementVariants.length, source.statementVariants.length, `${locale}:${source.scenarioId}: statement variant count drift`);
    for (const text of localized.statementVariants) {
      assert.ok(script.test(text), `${locale}:${source.scenarioId}: statement lacks expected native script`);
      assert.ok(text.trim().length >= 12, `${locale}:${source.scenarioId}: statement too short`);
    }

    const sourceCandidateIds = source.candidates.map((candidate) => candidate.candidateId).sort();
    const localizedCandidateIds = Object.keys(localized.candidates).sort();
    assert.deepEqual(localizedCandidateIds, sourceCandidateIds, `${locale}:${source.scenarioId}: candidate identity drift`);

    for (const candidate of source.candidates) {
      const copy = localized.candidates[candidate.candidateId];
      assert.ok(copy, `${locale}:${source.scenarioId}:${candidate.candidateId}: missing copy`);
      assert.equal(copy.textVariants.length, candidate.textVariants.length, `${locale}:${source.scenarioId}:${candidate.candidateId}: variant-count drift`);
      assert.ok(script.test(copy.rationale), `${locale}:${source.scenarioId}:${candidate.candidateId}: rationale lacks expected native script`);
      for (const text of copy.textVariants) assert.ok(script.test(text), `${locale}:${source.scenarioId}:${candidate.candidateId}: candidate lacks expected native script`);
    }
  }
}

assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.freezeId, "STA-001-EN-v2-frozen");
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.authorityCount, 64);
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.authorityCountByQl["STA-QL-001"], EXPECTED_AUTHORITY_COUNT);
assert.equal(Object.keys(STA_ENGLISH_FREEZE_V2_MANIFEST.sourceBlobLocks).length, 17, "English V2 freeze lock set must remain intact");
assert.equal(SOURCE.length, EXPECTED_AUTHORITY_COUNT, "Frozen QL001 authority count drifted");
assert.equal(STA_QL001_LOCALIZATION_LIFECYCLE.englishCorpusStatus, "FROZEN_V2");
assert.equal(STA_QL001_LOCALIZATION_LIFECYCLE.hindiPunjabiStatus, "QL001_REVIEW_CANDIDATE");
assert.equal(STA_QL001_LOCALIZATION_LIFECYCLE.questionStudioDiscoverable, false);
assert.equal(STA_QL001_LOCALIZATION_LIFECYCLE.questionBankWritable, false);
assert.equal(STA_QL001_LOCALIZATION_LIFECYCLE.testEligible, false);
assert.equal(STA_QL001_LOCALIZATION_LIFECYCLE.publiclyPublishable, false);

validateBundle("hi-IN", STA_QL001_HINDI_REVIEW_COPY, /[\u0900-\u097F]/);
validateBundle("pa-IN", STA_QL001_PUNJABI_REVIEW_COPY, /[\u0A00-\u0A7F]/);

const seenByLocale: Record<StaLocalizedLocale, Set<string>> = {
  "hi-IN": new Set<string>(),
  "pa-IN": new Set<string>(),
};
let parityChecks = 0;
let localizedQuestions = 0;

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql001-localization-v1:${locale}:${index}`;
    const english = generateStaQuestionFromPool(seed, "STA-QL-001", STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl);
    const localized = generateStaQl001LocalizedQuestion(seed, locale);
    seenByLocale[locale].add(localized.scenarioId);
    localizedQuestions += 1;

    assert.equal(localized.questionId, english.questionId, `${seed}: question identity drift`);
    assert.equal(localized.qlId, english.qlId, `${seed}: QL drift`);
    assert.equal(localized.scenarioId, english.scenarioId, `${seed}: scenario drift`);
    assert.equal(localized.answerIndex, english.answerIndex, `${seed}: answer-index drift`);
    assert.ok(sameArray(localized.answerSet, english.answerSet), `${seed}: answer-set drift`);
    assert.equal(localized.candidates.length, english.candidates.length, `${seed}: candidate-count drift`);

    localized.candidates.forEach((candidate, candidateIndex) => {
      const sourceCandidate = english.candidates[candidateIndex]!;
      assert.equal(candidate.candidateId, sourceCandidate.candidateId, `${seed}: candidate identity drift`);
      assert.equal(candidate.oracle.classification, sourceCandidate.oracle.classification, `${seed}: oracle classification drift`);
      assert.equal(candidate.oracle.evidenceCode, sourceCandidate.oracle.evidenceCode, `${seed}: oracle evidence drift`);
      assert.equal(candidate.oracle.dependencyId, sourceCandidate.oracle.dependencyId, `${seed}: dependency identity drift`);
      assert.notEqual(candidate.text, sourceCandidate.text, `${seed}: learner candidate was not localized`);
    });

    localized.options.forEach((option, optionIndex) => {
      const sourceOption = english.options[optionIndex]!;
      assert.ok(sameArray(option.semanticAnswerSet, sourceOption.semanticAnswerSet), `${seed}: option semantic identity drift`);
      assert.equal(option.isCorrect, sourceOption.isCorrect, `${seed}: option correctness drift`);
    });

    assert.notEqual(localized.statement, english.statement, `${seed}: statement was not localized`);
    assert.equal(localized.lifecycle.englishCorpusStatus, "FROZEN_V2");
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    parityChecks += 1;
  }
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  assert.equal(seenByLocale[locale].size, EXPECTED_AUTHORITY_COUNT, `${locale}: generated proof did not reach all 16 QL001 authorities`);
}

console.log("PASS_STA_QL001_HI_PA_LOCALIZATION_REVIEW_V1");
console.log(JSON.stringify({
  englishFreezeId: STA_ENGLISH_FREEZE_V2_MANIFEST.freezeId,
  frozenEnglishAuthorities: STA_ENGLISH_FREEZE_V2_MANIFEST.authorityCount,
  localizedQl: "STA-QL-001",
  localizedAuthoritiesPerLanguage: EXPECTED_AUTHORITY_COUNT,
  localizedQuestions,
  parityChecks,
  reachedHindiAuthorities: seenByLocale["hi-IN"].size,
  reachedPunjabiAuthorities: seenByLocale["pa-IN"].size,
  hindiPunjabiStatus: STA_QL001_LOCALIZATION_LIFECYCLE.hindiPunjabiStatus,
  questionStudioDiscoverable: STA_QL001_LOCALIZATION_LIFECYCLE.questionStudioDiscoverable,
  questionBankWritable: STA_QL001_LOCALIZATION_LIFECYCLE.questionBankWritable,
  testEligible: STA_QL001_LOCALIZATION_LIFECYCLE.testEligible,
  publiclyPublishable: STA_QL001_LOCALIZATION_LIFECYCLE.publiclyPublishable,
}, null, 2));
