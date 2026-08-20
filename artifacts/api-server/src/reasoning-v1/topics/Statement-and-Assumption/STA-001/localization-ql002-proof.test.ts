import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import { STA_QL001_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql001-freeze-manifest.ts";
import { STA_QL002_HINDI_REVIEW_COPY, STA_QL002_PUNJABI_REVIEW_COPY } from "./localization-ql002-copy.ts";
import {
  generateStaQl002LocalizedQuestion,
  STA_QL002_LOCALIZATION_LIFECYCLE,
} from "./localization-ql002.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL002_LOCALIZATION_CASES_PER_LOCALE ?? 768);
const frozenQl002 = STA_ENGLISH_CORPUS_BY_QL["STA-QL-002"];
const expectedIds = frozenQl002.map((scenario) => scenario.scenarioId).sort();

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL002_HINDI_REVIEW_COPY : STA_QL002_PUNJABI_REVIEW_COPY;
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const bundle = bundleFor(locale);
  assert.deepEqual(Object.keys(bundle).sort(), expectedIds, `${locale}: localization bundle must cover exactly the 16 frozen QL002 authorities`);
  for (const source of frozenQl002) {
    const copy = bundle[source.scenarioId];
    assert.ok(copy, `${locale}:${source.scenarioId}: missing localization copy`);
    assert.equal(copy.statementVariants.length, source.statementVariants.length, `${locale}:${source.scenarioId}: statement variant count mismatch`);
    assert.deepEqual(Object.keys(copy.candidates).sort(), source.candidates.map((candidate) => candidate.candidateId).sort(), `${locale}:${source.scenarioId}: candidate authority set mismatch`);
    for (const sourceCandidate of source.candidates) {
      const candidateCopy = copy.candidates[sourceCandidate.candidateId];
      assert.ok(candidateCopy, `${locale}:${source.scenarioId}:${sourceCandidate.candidateId}: missing candidate copy`);
      assert.equal(candidateCopy.textVariants.length, sourceCandidate.textVariants.length, `${locale}:${source.scenarioId}:${sourceCandidate.candidateId}: text variant count mismatch`);
      assert.ok(candidateCopy.rationale.trim().length > 20, `${locale}:${source.scenarioId}:${sourceCandidate.candidateId}: rationale too thin`);
    }
  }
}

assert.equal(STA_QL001_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql001HindiPunjabiFrozen, true);
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE.ql001FreezeId, STA_QL001_HI_PA_FREEZE_V2_MANIFEST.freezeId);
assert.equal(STA_QL002_LOCALIZATION_LIFECYCLE.ql002HindiPunjabiStatus, "REVIEW_CANDIDATE_V1");

let semanticParityChecks = 0;
let editorialChecks = 0;
let selectedCandidateIdentityChecks = 0;
const reached = new Map<StaLocalizedLocale, Set<string>>([
  ["hi-IN", new Set<string>()],
  ["pa-IN", new Set<string>()],
]);

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql002-localization-v1:${locale}:${index}`;
    const english = generateStaQuestionFromPool(seed, "STA-QL-002", STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl);
    const localized = generateStaQl002LocalizedQuestion(seed, locale);
    reached.get(locale)!.add(localized.scenarioId);

    assert.equal(localized.questionId, english.questionId, `${locale}/${seed}: question identity drift`);
    assert.equal(localized.qlId, english.qlId, `${locale}/${seed}: QL identity drift`);
    assert.equal(localized.scenarioId, english.scenarioId, `${locale}/${seed}: scenario identity drift`);
    assert.equal(localized.seed, english.seed, `${locale}/${seed}: seed drift`);
    assert.equal(localized.difficulty, english.difficulty, `${locale}/${seed}: difficulty drift`);
    assert.equal(localized.sourceProfile, english.sourceProfile, `${locale}/${seed}: source profile drift`);
    assert.deepEqual(localized.answerSet, english.answerSet, `${locale}/${seed}: answer-set drift`);
    assert.equal(localized.answerIndex, english.answerIndex, `${locale}/${seed}: correct-option drift`);
    assert.deepEqual(
      localized.options.map((option) => option.semanticAnswerSet),
      english.options.map((option) => option.semanticAnswerSet),
      `${locale}/${seed}: option semantic identity drift`,
    );
    assert.deepEqual(
      localized.candidates.map((candidate) => candidate.candidateId),
      english.candidates.map((candidate) => candidate.candidateId),
      `${locale}/${seed}: selected candidate identity drift`,
    );
    assert.deepEqual(
      localized.candidates.map((candidate) => candidate.oracle),
      english.candidates.map((candidate) => candidate.oracle),
      `${locale}/${seed}: oracle/misconception semantic drift`,
    );
    selectedCandidateIdentityChecks += localized.candidates.length;

    assert.equal(localized.locale, locale);
    assert.equal(localized.oracleParity, true);
    assert.equal(localized.lifecycle.englishCorpusStatus, "FROZEN_V2");
    assert.equal(localized.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(localized.lifecycle.ql002HindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    assert.equal(localized.explanation.includes(localized.statement), false, `${locale}/${seed}: explanation repeats full stem`);

    const learnerText = [localized.statement, ...localized.candidates.map((candidate) => candidate.text), localized.explanation].join("\n");
    if (locale === "hi-IN") {
      assert.equal(learnerText.includes("मान्यता"), false, `${locale}/${seed}: rejected translation-heavy term मान्यता returned`);
      assert.equal(learnerText.includes("अंतर्निहित"), false, `${locale}/${seed}: rejected term अंतर्निहित returned`);
      assert.ok(localized.explanation.includes("पूर्वधारणा"), `${locale}/${seed}: approved exam term पूर्वधारणा missing`);
    } else {
      assert.equal(learnerText.includes("ਮਾਨਤਾ"), false, `${locale}/${seed}: rejected translation-heavy term ਮਾਨਤਾ returned`);
      assert.equal(learnerText.includes("ਅੰਤਰਿਨਿਹਿਤ"), false, `${locale}/${seed}: rejected term ਅੰਤਰਿਨਿਹਿਤ returned`);
      assert.ok(localized.explanation.includes("ਧਾਰਨਾ"), `${locale}/${seed}: approved exam term ਧਾਰਨਾ missing`);
    }

    semanticParityChecks += 1;
    editorialChecks += 1;
  }
}

assert.equal(reached.get("hi-IN")!.size, 16, "Hindi generation did not reach all 16 frozen QL002 authorities");
assert.equal(reached.get("pa-IN")!.size, 16, "Punjabi generation did not reach all 16 frozen QL002 authorities");

console.log("PASS_STA_QL002_HI_PA_LOCALIZATION_REVIEW_V1");
console.log(JSON.stringify({
  ql001FreezeId: STA_QL001_HI_PA_FREEZE_V2_MANIFEST.freezeId,
  frozenEnglishQl002Authorities: frozenQl002.length,
  localizedQuestions: semanticParityChecks,
  semanticParityChecks,
  selectedCandidateIdentityChecks,
  editorialChecks,
  reachedHindiAuthorities: reached.get("hi-IN")!.size,
  reachedPunjabiAuthorities: reached.get("pa-IN")!.size,
  ql002Status: STA_QL002_LOCALIZATION_LIFECYCLE.ql002HindiPunjabiStatus,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
