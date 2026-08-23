import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import { STA_QL002_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql002-freeze-manifest.ts";
import { STA_QL003_HINDI_REVIEW_COPY, STA_QL003_PUNJABI_REVIEW_COPY } from "./localization-ql003-copy.ts";
import { generateStaQl003LocalizedQuestion, STA_QL003_LOCALIZATION_LIFECYCLE } from "./localization-ql003.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL003_LOCALIZATION_CASES_PER_LOCALE ?? 768);
const sourceAuthorities = STA_ENGLISH_CORPUS_BY_QL["STA-QL-003"];

assert.equal(STA_QL002_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.ql002FreezeId, STA_QL002_HI_PA_FREEZE_V2_MANIFEST.freezeId);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.ql003HindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.questionStudioDiscoverable, false);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.questionBankWritable, false);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.testEligible, false);
assert.equal(STA_QL003_LOCALIZATION_LIFECYCLE.publiclyPublishable, false);
assert.equal(sourceAuthorities.length, 16);

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL003_HINDI_REVIEW_COPY : STA_QL003_PUNJABI_REVIEW_COPY;
}

let authoredCopyChecks = 0;
for (const locale of ["hi-IN", "pa-IN"] as const) {
  const bundle = bundleFor(locale);
  assert.equal(Object.keys(bundle).length, 16, `${locale}: expected exactly 16 QL003 localization authorities`);
  for (const source of sourceAuthorities) {
    const copy = bundle[source.scenarioId];
    assert.ok(copy, `${locale}/${source.scenarioId}: localization authority missing`);
    assert.equal(copy.statementVariants.length, source.statementVariants.length, `${locale}/${source.scenarioId}: statement variant count drift`);
    source.candidates.forEach((candidate) => {
      const localizedCandidate = copy.candidates[candidate.candidateId];
      assert.ok(localizedCandidate, `${locale}/${source.scenarioId}/${candidate.candidateId}: candidate copy missing`);
      assert.equal(localizedCandidate.textVariants.length, candidate.textVariants.length, `${locale}/${source.scenarioId}/${candidate.candidateId}: candidate variant count drift`);
      assert.ok(localizedCandidate.rationale.trim().length >= 20, `${locale}/${source.scenarioId}/${candidate.candidateId}: rationale too thin`);
      authoredCopyChecks += localizedCandidate.textVariants.length + 1;
    });
    copy.statementVariants.forEach((statement) => {
      assert.ok(statement.trim().length >= 15, `${locale}/${source.scenarioId}: statement too thin`);
      authoredCopyChecks += 1;
    });
  }
}

let semanticParityChecks = 0;
let selectedCandidateIdentityChecks = 0;
let editorialChecks = 0;
const reached = new Map<StaLocalizedLocale, Set<string>>([
  ["hi-IN", new Set<string>()],
  ["pa-IN", new Set<string>()],
]);

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql003-localization-v1:${locale}:${index}`;
    const english = generateStaQuestionFromPool(seed, "STA-QL-003", STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl);
    const localized = generateStaQl003LocalizedQuestion(seed, locale);
    reached.get(locale)!.add(localized.scenarioId);

    assert.equal(localized.questionId, english.questionId, `${locale}/${seed}: question identity drift`);
    assert.equal(localized.qlId, english.qlId, `${locale}/${seed}: QL identity drift`);
    assert.equal(localized.proposedQlId, english.proposedQlId, `${locale}/${seed}: proposed QL identity drift`);
    assert.equal(localized.scenarioId, english.scenarioId, `${locale}/${seed}: scenario identity drift`);
    assert.equal(localized.seed, english.seed, `${locale}/${seed}: seed drift`);
    assert.equal(localized.difficulty, english.difficulty, `${locale}/${seed}: difficulty drift`);
    assert.equal(localized.sourceProfile, english.sourceProfile, `${locale}/${seed}: source profile drift`);
    assert.deepEqual(localized.answerSet, english.answerSet, `${locale}/${seed}: answer-set drift`);
    assert.equal(localized.answerIndex, english.answerIndex, `${locale}/${seed}: correct-option drift`);
    assert.deepEqual(
      localized.options.map((option) => ({ semanticAnswerSet: option.semanticAnswerSet, isCorrect: option.isCorrect })),
      english.options.map((option) => ({ semanticAnswerSet: option.semanticAnswerSet, isCorrect: option.isCorrect })),
      `${locale}/${seed}: option semantic identity drift`,
    );
    assert.deepEqual(
      localized.candidates.map((candidate) => candidate.candidateId),
      english.candidates.map((candidate) => candidate.candidateId),
      `${locale}/${seed}: candidate identity drift`,
    );
    assert.deepEqual(
      localized.candidates.map((candidate) => candidate.oracle),
      english.candidates.map((candidate) => candidate.oracle),
      `${locale}/${seed}: oracle/misconception drift`,
    );
    selectedCandidateIdentityChecks += localized.candidates.length;
    assert.equal(localized.oracleParity, true);
    assert.equal(localized.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(localized.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(localized.lifecycle.ql003HindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    assert.equal(localized.explanation.includes(localized.statement), false, `${locale}/${seed}: explanation repeats full stem`);

    const learnerText = [localized.statement, ...localized.candidates.map((candidate) => candidate.text), localized.explanation].join("\n");
    if (locale === "hi-IN") {
      assert.ok(localized.explanation.includes("पूर्वधारणा"), `${locale}/${seed}: approved assumption term missing`);
      assert.equal(learnerText.includes("मान्यता"), false, `${locale}/${seed}: rejected Hindi term मान्यता found`);
      assert.equal(learnerText.includes("अंतर्निहित"), false, `${locale}/${seed}: rejected Hindi term अंतर्निहित found`);
    } else {
      assert.ok(localized.explanation.includes("ਧਾਰਨਾ"), `${locale}/${seed}: approved assumption term missing`);
      assert.equal(learnerText.includes("ਮਾਨਤਾ"), false, `${locale}/${seed}: rejected Punjabi term ਮਾਨਤਾ found`);
      assert.equal(learnerText.includes("ਅੰਤਰਿਨਿਹਿਤ"), false, `${locale}/${seed}: rejected Punjabi term ਅੰਤਰਿਨਿਹਿਤ found`);
    }

    semanticParityChecks += 1;
    editorialChecks += 1;
  }
}

assert.equal(reached.get("hi-IN")!.size, 16, "Hindi generation did not reach all 16 frozen QL003 authorities");
assert.equal(reached.get("pa-IN")!.size, 16, "Punjabi generation did not reach all 16 frozen QL003 authorities");

console.log("PASS_STA_QL003_HI_PA_LOCALIZATION_REVIEW_V1");
console.log(JSON.stringify({
  ql002FreezeId: STA_QL002_HI_PA_FREEZE_V2_MANIFEST.freezeId,
  frozenEnglishQl003Authorities: sourceAuthorities.length,
  authoredCopyChecks,
  localizedQuestions: semanticParityChecks,
  semanticParityChecks,
  selectedCandidateIdentityChecks,
  editorialChecks,
  reachedHindiAuthorities: reached.get("hi-IN")!.size,
  reachedPunjabiAuthorities: reached.get("pa-IN")!.size,
  ql001HindiPunjabiStatus: "FROZEN_V2",
  ql002HindiPunjabiStatus: "FROZEN_V2",
  ql003HindiPunjabiStatus: "REVIEW_CANDIDATE_V1",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
