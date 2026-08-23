import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import {
  editorializeStaQl004LocalizedText,
  generateStaQl004LocalizedQuestionV2,
} from "./localization-ql004-editorial-v2.ts";
import {
  examRealizeStaQl004Statement,
  generateStaQl004LocalizedQuestionV3,
  STA_QL004_EXAM_REALNESS_VERSION,
  type StaQl004LocalizedQuestionV3,
} from "./localization-ql004-exam-realness-v3.ts";
import {
  generateStaFourAssumptionBankQuestion,
  STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION,
  type StaExamLocale,
} from "./exam-format-four-assumption.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL004_EXAM_REALNESS_CASES_PER_LOCALE ?? 768);
const FOUR_ASSUMPTION_CASES_PER_LOCALE = Number(process.env.STA_FOUR_ASSUMPTION_CASES_PER_LOCALE ?? 320);
const MAX_SEARCH = 100_000;

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

function collectReview(locale: StaLocalizedLocale): StaQl004LocalizedQuestionV3[] {
  const expectedIds = STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"].map((scenario) => scenario.scenarioId);
  const baseByScenario = new Map<string, StaQl004LocalizedQuestionV3>();
  for (let index = 0; index < MAX_SEARCH && baseByScenario.size < expectedIds.length; index += 1) {
    const question = generateStaQl004LocalizedQuestionV3(`sta-ql004-exam-realness-v3:${locale}:${index}`, locale);
    if (!baseByScenario.has(question.scenarioId)) baseByScenario.set(question.scenarioId, question);
  }
  const bundle = bundleFor(locale);
  return expectedIds.flatMap((scenarioId) => {
    const base = baseByScenario.get(scenarioId);
    assert.ok(base, `${locale}:${scenarioId}: deterministic V3 review seed missing`);
    const copy = bundle[scenarioId];
    assert.ok(copy, `${locale}:${scenarioId}: localization copy missing`);
    assert.ok(copy.statementVariants.length >= 2, `${locale}:${scenarioId}: needs two authored statement variants`);
    return copy.statementVariants.slice(0, 2).map((statement) => ({
      ...base,
      statement: examRealizeStaQl004Statement(locale, editorializeStaQl004LocalizedText(locale, statement)),
    }));
  });
}

function prefix(value: string, words: number): string {
  return value.trim().split(/\s+/).slice(0, words).join(" ");
}

function countToken(rows: readonly StaQl004LocalizedQuestionV3[], token: string): number {
  return rows.filter((question) => question.statement.includes(token)).length;
}

function auditReviewSurface(locale: StaLocalizedLocale, rows: readonly StaQl004LocalizedQuestionV3[]): void {
  assert.equal(rows.length, 32, `${locale}: expected 32 QL004 review questions`);
  assert.equal(new Set(rows.map((question) => question.statement)).size, 32, `${locale}: stems must all be unique`);

  const scenarioCounts = new Map<string, number>();
  for (const question of rows) scenarioCounts.set(question.scenarioId, (scenarioCounts.get(question.scenarioId) ?? 0) + 1);
  assert.equal(scenarioCounts.size, 16, `${locale}: all 16 QL004 authorities must be represented`);
  for (const [scenarioId, count] of scenarioCounts) assert.equal(count, 2, `${locale}:${scenarioId}: expected two stem variants`);

  const sourceProfiles = new Set(rows.map((question) => question.sourceProfile));
  for (const required of ["SSC", "BANKING", "PUNJAB_STATE", "CROSS_EXAM_DISCOVERY"] as const) {
    assert.ok(sourceProfiles.has(required), `${locale}: missing source profile ${required}`);
  }
  const difficulties = new Set(rows.map((question) => question.difficulty));
  for (const required of ["Easy", "Medium", "Hard"] as const) assert.ok(difficulties.has(required), `${locale}: missing difficulty ${required}`);

  const candidateCounts = new Set(rows.map((question) => question.candidates.length));
  assert.ok(candidateCounts.has(2) && candidateCounts.has(3), `${locale}: 2- and 3-assumption surfaces must both be present`);
  const answerPositions = new Set(rows.map((question) => question.answerIndex));
  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${locale}: all four answer positions must occur`);
  assert.ok(new Set(rows.map((question) => question.answerSet.join(","))).size >= 4, `${locale}: answer-set variety too thin`);

  const wordCounts = rows.map((question) => question.statement.trim().split(/\s+/).length);
  assert.ok(Math.min(...wordCounts) >= 14, `${locale}: a stem is too terse for the reviewed QL004 surface`);
  assert.ok(Math.max(...wordCounts) <= 38, `${locale}: a stem is too long for exam-speed reading`);

  const prefixCounts = new Map<string, number>();
  for (const question of rows) {
    const key = prefix(question.statement, 2);
    prefixCounts.set(key, (prefixCounts.get(key) ?? 0) + 1);
  }
  assert.ok(Math.max(...prefixCounts.values()) <= 2, `${locale}: repeated opening skeleton exceeds two stems`);

  if (locale === "hi-IN") {
    assert.ok(countToken(rows, "उम्मीद") <= 2, "Hindi QL004 still overuses उम्मीद prediction phrasing");
    assert.ok(countToken(rows, "इसलिए") <= 8, "Hindi QL004 still overuses इसलिए");
    assert.ok(countToken(rows, "इससे") <= 16, "Hindi QL004 still overuses इससे");
    for (const blocked of ["स्मरण:", "सूचना:", "दावे के लिए दावे के लिए", "अलर्ट-सेवा"]) {
      assert.ok(rows.every((question) => !question.statement.includes(blocked)), `Hindi blocked exam-realness phrase survived: ${blocked}`);
    }
  } else {
    assert.ok(countToken(rows, "ਉਮੀਦ") <= 2, "Punjabi QL004 still overuses ਉਮੀਦ prediction phrasing");
    assert.ok(countToken(rows, "ਇਸ ਲਈ") <= 8, "Punjabi QL004 still overuses ਇਸ ਲਈ");
    assert.ok(countToken(rows, "ਇਸ ਨਾਲ") <= 16, "Punjabi QL004 still overuses ਇਸ ਨਾਲ");
    for (const blocked of ["ਯਾਦ ਦਿਹਾਨੀ:", "ਸੂਚਨਾ:", "ਪਹਿਲਾਂ ਤੋਂ ਬਣੇ ਪਹਿਲਾਂ ਹੀ ਬਣੇ"]) {
      assert.ok(rows.every((question) => !question.statement.includes(blocked)), `Punjabi blocked exam-realness phrase survived: ${blocked}`);
    }
  }

  for (const question of rows) {
    assert.equal(question.qlId, "STA-QL-004");
    assert.equal(question.proposedQlId, "STA-QL-004");
    assert.equal(question.oracleParity, true);
    assert.equal(question.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V3");
    assert.equal(question.lifecycle.examRealnessVersion, STA_QL004_EXAM_REALNESS_VERSION);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
  }
}

let semanticParityChecks = 0;
let statementMutations = 0;
for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql004-exam-realness-proof:${locale}:${index}`;
    const v2 = generateStaQl004LocalizedQuestionV2(seed, locale);
    const v3 = generateStaQl004LocalizedQuestionV3(seed, locale);
    assert.equal(v3.questionId, v2.questionId);
    assert.equal(v3.scenarioId, v2.scenarioId);
    assert.equal(v3.qlId, v2.qlId);
    assert.equal(v3.difficulty, v2.difficulty);
    assert.equal(v3.sourceProfile, v2.sourceProfile);
    assert.deepEqual(v3.answerSet, v2.answerSet);
    assert.equal(v3.answerIndex, v2.answerIndex);
    assert.deepEqual(v3.candidates, v2.candidates);
    assert.deepEqual(v3.options, v2.options);
    assert.equal(v3.explanation, v2.explanation);
    if (v3.statement !== v2.statement) statementMutations += 1;
    semanticParityChecks += 1;
  }
}

const hindi = collectReview("hi-IN");
const punjabi = collectReview("pa-IN");
auditReviewSurface("hi-IN", hindi);
auditReviewSurface("pa-IN", punjabi);

const fourAssumptionScenarioCoverage = new Map<StaExamLocale, Set<string>>();
const fourAssumptionAnswerPositions = new Map<StaExamLocale, Set<number>>();
let fourAssumptionChecks = 0;

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  const scenarios = new Set<string>();
  const answerPositions = new Set<number>();
  for (let index = 0; index < FOUR_ASSUMPTION_CASES_PER_LOCALE; index += 1) {
    const question = generateStaFourAssumptionBankQuestion(`sta-bank-four-assumption:${locale}:${index}`, locale);
    assert.equal(question.qlId, "STA-QL-004");
    assert.equal(question.proposedQlId, "STA-QL-004");
    assert.equal(question.sourceProfile, "BANKING");
    assert.equal(question.candidates.length, 4);
    assert.deepEqual(question.candidates.map((candidate) => candidate.label), ["I", "II", "III", "IV"]);
    assert.equal(question.candidates[3].oracle.classification, "NOT_IMPLICIT");
    assert.equal(question.candidates[3].oracle.evidenceCode, "EXPLICIT_RESTATEMENT");
    assert.ok(!question.answerSet.includes(3), `${locale}:${question.questionId}: explicit restatement cannot be implicit`);
    assert.equal(question.options.length, 5);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(question.options[question.answerIndex]?.isCorrect);
    assert.equal(new Set(question.options.map((option) => option.semanticAnswerSet.join(","))).size, 5);
    assert.equal(new Set(question.options.map((option) => option.display)).size, 5);
    assert.equal(question.format.version, STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION);
    assert.equal(question.format.assumptionCount, 4);
    assert.equal(question.format.optionCount, 5);
    assert.equal(question.format.formatIsMetadataNotQlIdentity, true);
    assert.equal(question.format.questionStudioDiscoverable, false);
    assert.equal(question.format.questionBankWritable, false);
    assert.equal(question.format.testEligible, false);
    assert.equal(question.format.publiclyPublishable, false);
    scenarios.add(question.scenarioId);
    answerPositions.add(question.answerIndex);
    fourAssumptionChecks += 1;
  }
  assert.ok(scenarios.size >= 3, `${locale}: four-assumption banking format covers fewer than three QL004 banking authorities`);
  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3, 4], `${locale}: five-option answer positions are not all exercised`);
  fourAssumptionScenarioCoverage.set(locale, scenarios);
  fourAssumptionAnswerPositions.set(locale, answerPositions);
}

assert.ok(statementMutations > 0, "V3 exam-realness overlay made no statement changes");

console.log("PASS_STA_001_EXAM_REALNESS_V3");
console.log(JSON.stringify({
  examRealnessVersion: STA_QL004_EXAM_REALNESS_VERSION,
  semanticParityChecks,
  statementMutations,
  ql004AuthoritiesPerLocale: 16,
  canonicalReviewQuestionsPerLocale: 32,
  uniqueHindiStems: new Set(hindi.map((question) => question.statement)).size,
  uniquePunjabiStems: new Set(punjabi.map((question) => question.statement)).size,
  hindiExpectationSkeletons: countToken(hindi, "उम्मीद"),
  punjabiExpectationSkeletons: countToken(punjabi, "ਉਮੀਦ"),
  hindiThereforeSkeletons: countToken(hindi, "इसलिए"),
  punjabiThereforeSkeletons: countToken(punjabi, "ਇਸ ਲਈ"),
  fourAssumptionFormat: STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION,
  fourAssumptionChecks,
  fourAssumptionScenarioCoverage: Object.fromEntries(
    [...fourAssumptionScenarioCoverage].map(([locale, scenarios]) => [locale, scenarios.size]),
  ),
  fiveOptionAnswerPositions: Object.fromEntries(
    [...fourAssumptionAnswerPositions].map(([locale, positions]) => [locale, [...positions].sort()]),
  ),
  ql001HindiPunjabiStatus: "FROZEN_V2",
  ql002HindiPunjabiStatus: "FROZEN_V2",
  ql003HindiPunjabiStatus: "FROZEN_V2",
  ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V3",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
