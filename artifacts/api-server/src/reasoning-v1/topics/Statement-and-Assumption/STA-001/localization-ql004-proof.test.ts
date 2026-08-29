import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import { STA_QL003_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql003-freeze-manifest.ts";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import { generateStaQl004LocalizedQuestion, STA_QL004_LOCALIZATION_LIFECYCLE } from "./localization-ql004.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL004_LOCALIZATION_CASES_PER_LOCALE ?? 768);

const BLOCKED_OPENINGS = {
  "hi-IN": ["सूचना:", "स्मरण:", "नोटिस:", "घोषणा:", "सिस्टम सूचना:", "रूट सूचना:"],
  "pa-IN": ["ਸੂਚਨਾ:", "ਯਾਦ ਦਿਹਾਨੀ:", "ਨੋਟਿਸ:", "ਐਲਾਨ:", "ਸਿਸਟਮ ਸੂਚਨਾ:", "ਰੂਟ ਸੂਚਨਾ:"],
} as const;

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

const expectedScenarios = STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"];
assert.equal(expectedScenarios.length, 16, "QL004 must retain exactly 16 frozen English authorities");

let authoredCopyChecks = 0;
for (const locale of ["hi-IN", "pa-IN"] as const) {
  const bundle = bundleFor(locale);
  assert.deepEqual(Object.keys(bundle).sort(), expectedScenarios.map((scenario) => scenario.scenarioId).sort(), `${locale}: localized scenario membership drift`);
  for (const sourceScenario of expectedScenarios) {
    const copy = bundle[sourceScenario.scenarioId];
    assert.ok(copy, `${locale}/${sourceScenario.scenarioId}: missing localization copy`);
    assert.equal(copy.statementVariants.length, sourceScenario.statementVariants.length, `${locale}/${sourceScenario.scenarioId}: statement variant count drift`);
    assert.ok(copy.statementVariants.length >= 2, `${locale}/${sourceScenario.scenarioId}: two stem variants required`);
    assert.equal(new Set(copy.statementVariants).size, copy.statementVariants.length, `${locale}/${sourceScenario.scenarioId}: duplicate localized stems`);
    for (const statement of copy.statementVariants) {
      assert.ok(statement.trim().length >= 35, `${locale}/${sourceScenario.scenarioId}: stem too thin`);
      for (const opening of BLOCKED_OPENINGS[locale]) assert.equal(statement.trimStart().startsWith(opening), false, `${locale}/${sourceScenario.scenarioId}: unnecessary opening label returned: ${opening}`);
      authoredCopyChecks += 1;
    }
    assert.deepEqual(Object.keys(copy.candidates).sort(), sourceScenario.candidates.map((candidate) => candidate.candidateId).sort(), `${locale}/${sourceScenario.scenarioId}: candidate membership drift`);
    for (const sourceCandidate of sourceScenario.candidates) {
      const localized = copy.candidates[sourceCandidate.candidateId];
      assert.ok(localized, `${locale}/${sourceScenario.scenarioId}/${sourceCandidate.candidateId}: missing localized candidate`);
      assert.equal(localized.textVariants.length, sourceCandidate.textVariants.length, `${locale}/${sourceScenario.scenarioId}/${sourceCandidate.candidateId}: candidate variant count drift`);
      assert.equal(new Set(localized.textVariants).size, localized.textVariants.length, `${locale}/${sourceScenario.scenarioId}/${sourceCandidate.candidateId}: duplicate candidate wording`);
      assert.ok(localized.rationale.trim().length >= 25, `${locale}/${sourceScenario.scenarioId}/${sourceCandidate.candidateId}: rationale too thin`);
      for (const value of [...localized.textVariants, localized.rationale]) {
        for (const opening of BLOCKED_OPENINGS[locale]) assert.equal(value.trimStart().startsWith(opening), false, `${locale}/${sourceScenario.scenarioId}/${sourceCandidate.candidateId}: unnecessary opening label in authored copy`);
        authoredCopyChecks += 1;
      }
    }
  }
}

assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.ql003FreezeId, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.freezeId);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.multilingualChapterFrozen, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.questionStudioDiscoverable, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.questionBankWritable, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.testEligible, false);
assert.equal(STA_QL004_LOCALIZATION_LIFECYCLE.publiclyPublishable, false);

let localizedQuestions = 0;
let semanticParityChecks = 0;
let selectedCandidateIdentityChecks = 0;
let editorialChecks = 0;
const reached = new Map<StaLocalizedLocale, Set<string>>([["hi-IN", new Set<string>()], ["pa-IN", new Set<string>()]]);

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql004-localization-v1:${locale}:${index}`;
    const english = generateStaQuestionFromPool(seed, "STA-QL-004", STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl);
    const question = generateStaQl004LocalizedQuestion(seed, locale);
    const sourceScenario = expectedScenarios.find((scenario) => scenario.scenarioId === question.scenarioId);
    assert.ok(sourceScenario, `${locale}/${seed}: scenario left frozen QL004 pool`);
    reached.get(locale)!.add(question.scenarioId);

    assert.equal(question.questionId, english.questionId, `${locale}/${seed}: question identity drift`);
    assert.equal(question.qlId, english.qlId, `${locale}/${seed}: QL identity drift`);
    assert.equal(question.proposedQlId, english.proposedQlId, `${locale}/${seed}: proposed QL drift`);
    assert.equal(question.scenarioId, english.scenarioId, `${locale}/${seed}: scenario identity drift`);
    assert.equal(question.seed, english.seed, `${locale}/${seed}: seed drift`);
    assert.equal(question.difficulty, english.difficulty, `${locale}/${seed}: difficulty drift`);
    assert.equal(question.sourceProfile, english.sourceProfile, `${locale}/${seed}: source-profile drift`);
    assert.deepEqual(question.answerSet, english.answerSet, `${locale}/${seed}: answer-set drift`);
    assert.equal(question.answerIndex, english.answerIndex, `${locale}/${seed}: answer-index drift`);
    assert.deepEqual(question.candidates.map((candidate) => candidate.candidateId), english.candidates.map((candidate) => candidate.candidateId), `${locale}/${seed}: selected candidate identity drift`);
    assert.deepEqual(question.candidates.map((candidate) => candidate.oracle), english.candidates.map((candidate) => candidate.oracle), `${locale}/${seed}: oracle identity drift`);
    assert.deepEqual(question.options.map((option) => ({ semanticAnswerSet: option.semanticAnswerSet, isCorrect: option.isCorrect })), english.options.map((option) => ({ semanticAnswerSet: option.semanticAnswerSet, isCorrect: option.isCorrect })), `${locale}/${seed}: option semantic drift`);
    assert.equal(question.oracleParity, true);
    assert.equal(question.lifecycle.englishCorpusStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
    assert.equal(question.lifecycle.multilingualChapterFrozen, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);

    const copy = bundleFor(locale)[question.scenarioId];
    assert.ok(copy.statementVariants.includes(question.statement), `${locale}/${seed}: rendered stem is not authored localized copy`);
    for (const opening of BLOCKED_OPENINGS[locale]) assert.equal(question.statement.trimStart().startsWith(opening), false, `${locale}/${seed}: unnecessary stem opening returned`);

    const sourceById = new Map(sourceScenario.candidates.map((candidate) => [candidate.candidateId, candidate]));
    question.candidates.forEach((candidate) => {
      const source = sourceById.get(candidate.candidateId);
      assert.ok(source, `${locale}/${seed}/${candidate.candidateId}: candidate identity left source authority`);
      const localized = copy.candidates[candidate.candidateId];
      assert.ok(localized.textVariants.includes(candidate.text), `${locale}/${seed}/${candidate.candidateId}: candidate wording not authored`);
      assert.equal(candidate.oracle.classification, source.expectedClassification, `${locale}/${seed}/${candidate.candidateId}: oracle classification drift`);
      selectedCandidateIdentityChecks += 1;
    });

    assert.equal(question.explanation.includes(question.statement), false, `${locale}/${seed}: explanation repeats full stem`);
    assert.ok(question.explanation.length < 1400, `${locale}/${seed}: explanation became bloated`);
    localizedQuestions += 1;
    semanticParityChecks += 1;
    editorialChecks += 1;
  }
}

assert.equal(reached.get("hi-IN")!.size, 16, "Hindi generation did not reach all 16 frozen QL004 authorities");
assert.equal(reached.get("pa-IN")!.size, 16, "Punjabi generation did not reach all 16 frozen QL004 authorities");

console.log("PASS_STA_QL004_HI_PA_LOCALIZATION_REVIEW_V1");
console.log(JSON.stringify({ ql003FreezeId: STA_QL003_HI_PA_FREEZE_V2_MANIFEST.freezeId, frozenEnglishQl004Authorities: expectedScenarios.length, authoredCopyChecks, localizedQuestions, semanticParityChecks, selectedCandidateIdentityChecks, editorialChecks, reachedHindiAuthorities: reached.get("hi-IN")!.size, reachedPunjabiAuthorities: reached.get("pa-IN")!.size, ql001HindiPunjabiStatus: "FROZEN_V2", ql002HindiPunjabiStatus: "FROZEN_V2", ql003HindiPunjabiStatus: "FROZEN_V2", ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V1", multilingualChapterFrozen: false, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false }, null, 2));
