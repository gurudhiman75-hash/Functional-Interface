import assert from "node:assert/strict";
import { renderStaExamFormat } from "./exam-format-renderer.ts";
import {
  generateStaQl004ExamRealnessEnglishQuestion,
  STA_QL004_EXAM_REALNESS_EXTENSION,
} from "./exam-realness-extension.ts";
import { generateStaQl004ExamRealnessLocalizedQuestion } from "./exam-realness-extension-localization.ts";
import { generateStaQl004LocalizedQuestionV3 } from "./localization-ql004-exam-realness-v3.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";

const LOCALES: readonly StaLocalizedLocale[] = ["hi-IN", "pa-IN"];
const BASE_SAMPLE_CASES = Number(process.env.STA_EXAM_REALNESS_BASE_CASES ?? 12_000);
const EXTENSION_SAMPLE_CASES = Number(process.env.STA_EXAM_REALNESS_EXTENSION_CASES ?? 12_000);

function sameNumbers(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameOptionSemantics(
  a: readonly { semanticAnswerSet: readonly number[] }[],
  b: readonly { semanticAnswerSet: readonly number[] }[],
): boolean {
  return a.length === b.length && a.every((option, index) => sameNumbers(option.semanticAnswerSet, b[index]!.semanticAnswerSet));
}

function collectBaseCanonical(locale: StaLocalizedLocale): string[] {
  const byScenario = new Map<string, Set<string>>();
  for (let index = 0; index < BASE_SAMPLE_CASES; index += 1) {
    const question = generateStaQl004LocalizedQuestionV3(`sta-exam-realness-v3:${locale}:${index}`, locale);
    const set = byScenario.get(question.scenarioId) ?? new Set<string>();
    set.add(question.statement);
    byScenario.set(question.scenarioId, set);
  }
  assert.equal(byScenario.size, 16, `${locale}: V3 base did not reach all 16 frozen QL004 authorities`);
  for (const [scenarioId, stems] of byScenario) {
    assert.ok(stems.size >= 2, `${locale}:${scenarioId}: V3 base did not exercise both authored stem variants`);
  }
  const canonical = [...byScenario.values()].flatMap((set) => [...set].slice(0, 2));
  assert.equal(canonical.length, 32, `${locale}: expected 32 canonical V3 base stems`);
  assert.equal(new Set(canonical).size, 32, `${locale}: duplicate canonical V3 base stem`);
  return canonical;
}

function collectExtensionCanonical(locale: StaLocalizedLocale): string[] {
  const expectedIds = new Set(STA_QL004_EXAM_REALNESS_EXTENSION.map((scenario) => scenario.scenarioId));
  const byScenario = new Map<string, Set<string>>();
  const answerCardinalities = new Set<number>();
  const candidateCounts = new Set<number>();
  const sourceProfiles = new Set<string>();
  const fiveOptionAnswerPositions = new Set<number>();
  let fiveOptionCases = 0;
  let fourOptionFallbackCases = 0;

  for (let index = 0; index < EXTENSION_SAMPLE_CASES; index += 1) {
    const seed = `sta-exam-realness-ext:${locale}:${index}`;
    const english = generateStaQl004ExamRealnessEnglishQuestion(seed);
    const localized = generateStaQl004ExamRealnessLocalizedQuestion(seed, locale);

    assert.equal(localized.scenarioId, english.scenarioId, `${seed}: scenario drift`);
    assert.equal(localized.qlId, "STA-QL-004", `${seed}: QL drift`);
    assert.equal(localized.difficulty, english.difficulty, `${seed}: difficulty drift`);
    assert.equal(localized.sourceProfile, english.sourceProfile, `${seed}: source-profile drift`);
    assert.deepEqual(localized.candidates.map((candidate) => candidate.candidateId), english.candidates.map((candidate) => candidate.candidateId), `${seed}: candidate identity drift`);
    assert.deepEqual(localized.candidates.map((candidate) => candidate.oracle.classification), english.candidates.map((candidate) => candidate.oracle.classification), `${seed}: oracle classification drift`);
    assert.deepEqual(localized.candidates.map((candidate) => candidate.oracle.evidenceCode), english.candidates.map((candidate) => candidate.oracle.evidenceCode), `${seed}: oracle evidence drift`);
    assert.ok(sameNumbers(localized.answerSet, english.answerSet), `${seed}: answer-set drift`);
    assert.equal(localized.answerIndex, english.answerIndex, `${seed}: answer-index drift`);
    assert.ok(sameOptionSemantics(localized.options, english.options), `${seed}: option semantic drift`);
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false, `${seed}: Question Studio opened prematurely`);
    assert.equal(localized.lifecycle.questionBankWritable, false, `${seed}: Question Bank opened prematurely`);
    assert.equal(localized.lifecycle.testEligible, false, `${seed}: test eligibility opened prematurely`);
    assert.equal(localized.lifecycle.publiclyPublishable, false, `${seed}: publication opened prematurely`);

    const stems = byScenario.get(localized.scenarioId) ?? new Set<string>();
    stems.add(localized.statement);
    byScenario.set(localized.scenarioId, stems);
    answerCardinalities.add(localized.answerSet.length);
    candidateCounts.add(localized.candidates.length);
    sourceProfiles.add(localized.sourceProfile);

    const rendered = renderStaExamFormat({
      seed,
      locale,
      candidateCount: localized.candidates.length as 2 | 3,
      answerSet: localized.answerSet,
    }, "FIVE_OPTION_BANKING");
    if (localized.candidates.length === 3) {
      assert.equal(rendered.profile, "FIVE_OPTION_BANKING", `${seed}: 3-assumption banking surface lost`);
      assert.equal(rendered.optionCount, 5, `${seed}: expected five banking options`);
      fiveOptionCases += 1;
      fiveOptionAnswerPositions.add(rendered.answerIndex);
    } else {
      assert.equal(rendered.profile, "FOUR_OPTION_STANDARD", `${seed}: two-assumption surface should use exact four-option form`);
      assert.equal(rendered.optionCount, 4, `${seed}: two-assumption fallback should have four options`);
      fourOptionFallbackCases += 1;
    }
  }

  assert.deepEqual(new Set(byScenario.keys()), expectedIds, `${locale}: extension authority coverage mismatch`);
  for (const scenario of STA_QL004_EXAM_REALNESS_EXTENSION) {
    const stems = byScenario.get(scenario.scenarioId);
    assert.ok(stems, `${locale}:${scenario.scenarioId}: missing extension authority`);
    assert.ok(stems.size >= 3, `${locale}:${scenario.scenarioId}: did not exercise all three authored stem variants`);
    const implicitAuthorities = scenario.candidates.filter((candidate) => candidate.expectedClassification === "IMPLICIT").length;
    assert.ok(implicitAuthorities >= 2, `${scenario.scenarioId}: extension must contain at least two genuine implicit authorities`);
    assert.ok(scenario.hiddenDependencies.length >= 2, `${scenario.scenarioId}: extension must contain at least two hidden dependencies`);
  }
  assert.deepEqual(answerCardinalities, new Set([0, 1, 2, 3]), `${locale}: extension must exercise none/one/two/all-three implicit answer shapes`);
  assert.deepEqual(candidateCounts, new Set([2, 3]), `${locale}: extension must exercise two- and three-assumption forms`);
  assert.deepEqual(sourceProfiles, new Set(["SSC", "BANKING", "PUNJAB_STATE", "CROSS_EXAM_DISCOVERY"]), `${locale}: extension source-profile coverage mismatch`);
  assert.ok(fiveOptionCases > 0 && fourOptionFallbackCases > 0, `${locale}: both four- and five-option exam surfaces must be exercised`);
  assert.deepEqual(fiveOptionAnswerPositions, new Set([0, 1, 2, 3, 4]), `${locale}: five-option answer positions are not fully exercised`);

  const canonical = [...byScenario.values()].flatMap((set) => [...set].slice(0, 3));
  assert.equal(canonical.length, STA_QL004_EXAM_REALNESS_EXTENSION.length * 3, `${locale}: extension canonical stem count mismatch`);
  assert.equal(new Set(canonical).size, canonical.length, `${locale}: duplicate extension stem`);
  return canonical;
}

const summaries: Record<string, unknown> = {};
for (const locale of LOCALES) {
  const base = collectBaseCanonical(locale);
  const extension = collectExtensionCanonical(locale);
  const combined = [...base, ...extension];
  const expectationToken = locale === "hi-IN" ? "उम्मीद" : "ਉਮੀਦ";
  const expectationCount = combined.filter((stem) => stem.includes(expectationToken)).length;
  const expectationShare = expectationCount / combined.length;
  assert.ok(expectationShare <= 0.2, `${locale}: prediction wording remains too template-heavy (${expectationCount}/${combined.length})`);
  assert.equal(new Set(combined).size, combined.length, `${locale}: combined exam-realness surface contains duplicate stems`);
  summaries[locale] = {
    baseCanonicalStems: base.length,
    extensionCanonicalStems: extension.length,
    combinedCanonicalStems: combined.length,
    expectationTokenCount: expectationCount,
    expectationShare: Number(expectationShare.toFixed(3)),
  };
}

console.log("PASS_STA_001_EXAM_REALNESS_EXTENSION_V1");
console.log(JSON.stringify({
  frozenBaseUntouched: true,
  baseQl004Authorities: 16,
  supplementalQl004Authorities: STA_QL004_EXAM_REALNESS_EXTENSION.length,
  effectiveQl004Authorities: 16 + STA_QL004_EXAM_REALNESS_EXTENSION.length,
  supportedAssumptionCounts: [2, 3],
  supportedExactOptionCounts: [4, 5],
  supportedAnswerCardinalities: [0, 1, 2, 3],
  questionStudioDiscoverable: false,
  summaries,
}, null, 2));
