import {
  NUM_CP005_PERMANENT_ALLOCATION,
  NUM_CP005_PERMANENT_QL_IDS,
} from "./allocation";
import {
  normalizeNumCp005OptionSemantic,
} from "./english-remediation";
import { runNumCp005PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 48;
const normalizedStemOwner = new Map<string, string>();
const exactStems = new Set<string>();
const exactExplanations = new Set<string>();
let generatedAuditQuestions = 0;
let crossQlStemCollisions = 0;
let lifecycleViolations = 0;
let optionContractViolations = 0;
let semanticOptionCollisions = 0;
let internalIdLeaks = 0;
let exponentRenderingViolations = 0;
let duplicatedFinalAnswerViolations = 0;
let genericAnswerGeometryQuestions = 0;
let fullyNumericOptionQuestions = 0;
let calculationCompletenessViolations = 0;
let maximumStemWords = 0;
let maximumStemCharacters = 0;
let maximumProseStemCharacters = 0;
let maximumStructuredTableStemCharacters = 0;

const internalIdPattern = /NUM-(?:QL|CP)|CP005-PROT|CP005-AUTH|CP005-SM|QLC-/i;
const unbracedPowerPattern = /\^[a-zA-Z0-9]/u;
const leftSuperscriptPattern = /[²³¹⁰⁴⁵⁶⁷⁸⁹]\s*[0-9a-zA-Z]/u;
const hugeRawIntegerPattern = /\b\d{25,}\b/u;
const calculationMarkerPattern = /(?:=|\\times|\\div|\\frac|\\lfloor|\bso\b|\bhence\b|\btherefore\b)/iu;

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = runNumCp005PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    generatedAuditQuestions += 1;

    const normalizedStem = question.stem.toLowerCase().replace(/\s+/g, " ").trim();
    const priorOwner = normalizedStemOwner.get(normalizedStem);
    if (priorOwner && priorOwner !== allocation.qlId) crossQlStemCollisions += 1;
    normalizedStemOwner.set(normalizedStem, allocation.qlId);
    exactStems.add(question.stem);
    exactExplanations.add(JSON.stringify(question.explanation));

    const stemWords = question.stem.trim().split(/\s+/).filter(Boolean).length;
    maximumStemWords = Math.max(maximumStemWords, stemWords);
    maximumStemCharacters = Math.max(maximumStemCharacters, question.stem.length);

    const isStructuredTable = question.representation === "DIVISOR_PAIR_TABLE";
    const stemCharacterLimit = isStructuredTable ? 320 : 260;
    if (isStructuredTable) {
      maximumStructuredTableStemCharacters = Math.max(
        maximumStructuredTableStemCharacters,
        question.stem.length,
      );
    } else {
      maximumProseStemCharacters = Math.max(maximumProseStemCharacters, question.stem.length);
    }

    assert(question.stem.trim().length > 0, `${allocation.qlId}/${seed}: empty stem`);
    assert(
      question.stem.length <= stemCharacterLimit,
      `${allocation.qlId}/${seed}: ${isStructuredTable ? "structured table" : "prose"} stem too long`,
    );
    assert(question.explanation.coreConcept.trim().length > 0, `${allocation.qlId}/${seed}: missing core concept`);
    assert(question.explanation.givenDataAndStrategy.trim().length > 0, `${allocation.qlId}/${seed}: missing strategy`);
    assert(question.explanation.stepByStep.length >= 2, `${allocation.qlId}/${seed}: insufficient calculation steps`);
    assert(question.explanation.examSpeedMethod.trim().length > 0, `${allocation.qlId}/${seed}: missing speed method`);

    const finalAnswerMatches = allocation.qlId === "NUM-QL-068"
      ? question.canonicalAnswer.includes("Number A")
        ? question.explanation.finalAnswer.includes("Number A")
        : question.canonicalAnswer.includes("Number B")
          ? question.explanation.finalAnswer.includes("Number B")
          : /same number of divisors/iu.test(question.explanation.finalAnswer)
      : question.explanation.finalAnswer.includes(question.canonicalAnswer);
    assert(finalAnswerMatches, `${allocation.qlId}/${seed}: final answer mismatch`);

    const semanticOptions = question.options.map((option) => normalizeNumCp005OptionSemantic(option.value));
    if (new Set(semanticOptions).size !== 4) semanticOptionCollisions += 1;

    const wrongOptions = question.options.filter((option) => !option.isCorrect);
    if (
      question.options.length !== 4
      || question.options.filter((option) => option.isCorrect).length !== 1
      || question.options[question.correctIndex]?.value !== question.canonicalAnswer
      || wrongOptions.length !== 3
      || wrongOptions.some((option) => !option.misconceptionId || !option.analysis.trim())
      || question.explanation.commonTraps.length !== 3
    ) optionContractViolations += 1;

    const learnerFacing = [
      question.stem,
      ...question.options.map((option) => option.value),
      question.explanation.coreConcept,
      question.explanation.givenDataAndStrategy,
      ...question.explanation.stepByStep,
      question.explanation.examSpeedMethod,
      ...question.explanation.commonTraps,
      question.explanation.finalAnswer,
    ].join("\n");

    if (internalIdPattern.test(learnerFacing)) internalIdLeaks += 1;
    if (unbracedPowerPattern.test(learnerFacing) || leftSuperscriptPattern.test(learnerFacing)) {
      exponentRenderingViolations += 1;
    }
    const openingMath = learnerFacing.match(/\\\(/g)?.length ?? 0;
    const closingMath = learnerFacing.match(/\\\)/g)?.length ?? 0;
    if (openingMath !== closingMath) exponentRenderingViolations += 1;

    if (/Final answer:\s*Final answer:/iu.test(question.explanation.finalAnswer)) {
      duplicatedFinalAnswerViolations += 1;
    }

    if (!question.explanation.stepByStep.some((step) => calculationMarkerPattern.test(step))) {
      calculationCompletenessViolations += 1;
    }

    const numericOptions = question.options.map((option) => /^-?\d+$/u.test(option.value) ? Number(option.value) : null);
    if (numericOptions.every((value) => value !== null) && /^-?\d+$/u.test(question.canonicalAnswer)) {
      fullyNumericOptionQuestions += 1;
      const answer = Number(question.canonicalAnswer);
      const wrongValues = numericOptions.filter((_value, index) => index !== question.correctIndex) as number[];
      if (wrongValues.every((value) => Math.abs(value - answer) <= 2)) genericAnswerGeometryQuestions += 1;
    }

    if (allocation.qlId === "NUM-QL-052") {
      assert(!hugeRawIntegerPattern.test(learnerFacing), `${allocation.qlId}/${seed}: huge raw divisor product leaked`);
      assert(/n\^\{/u.test(question.canonicalAnswer), `${allocation.qlId}/${seed}: symbolic product contract missing`);
    }

    if (allocation.qlId === "NUM-QL-057") {
      const parity = question.hiddenState.parity;
      const numericOptions = question.options.filter((option) => /^\d+$/u.test(option.value));
      if (parity === "ODD") {
        assert(numericOptions.every((option) => Number(option.value) % 2 === 1), `${allocation.qlId}/${seed}: odd-option parity leak`);
      }
      if (parity === "EVEN") {
        assert(numericOptions.every((option) => Number(option.value) % 2 === 0), `${allocation.qlId}/${seed}: even-option parity leak`);
      }
      if (question.canonicalAnswer === "No such integer") {
        assert(question.options.filter((option) => !/^\d+$/u.test(option.value)).length === 1, `${allocation.qlId}/${seed}: no-solution option contract`);
        assert(question.options[question.correctIndex]?.value === "No such integer", `${allocation.qlId}/${seed}: governed no-solution answer lost`);
      } else {
        assert(numericOptions.length === 4, `${allocation.qlId}/${seed}: solved bounded maximum must use four numeric options`);
      }
    }

    if (allocation.qlId === "NUM-QL-066" && question.canonicalAnswer === "∅") {
      assert(new Set(semanticOptions).size === 4, `${allocation.qlId}/${seed}: equivalent empty-set options`);
    }

    if (allocation.qlId === "NUM-QL-069") {
      const expected = new Set([
        "Statement I alone is sufficient, but Statement II alone is not.",
        "Statement II alone is sufficient, but Statement I alone is not.",
        "Both statements together are sufficient, but neither statement alone is sufficient.",
        "Even both statements together are not sufficient.",
      ]);
      assert(question.options.every((option) => expected.has(option.value)), `${allocation.qlId}/${seed}: non-exclusive DS option`);
    }

    if (
      question.lifecycle.active
      || question.lifecycle.questionStudioDiscoverable
      || question.lifecycle.questionBankWritable
      || question.lifecycle.testEligible
      || question.lifecycle.publiclyPublishable
    ) lifecycleViolations += 1;
  }
}

assert(NUM_CP005_PERMANENT_QL_IDS.length === 24, "permanent QL count");
assert(generatedAuditQuestions === 1_152, "audit corpus size");
assert(crossQlStemCollisions === 0, "cross-QL exact stem collision");
assert(lifecycleViolations === 0, "lifecycle violations");
assert(optionContractViolations === 0, "option-contract violations");
assert(semanticOptionCollisions === 0, "semantic option collisions");
assert(internalIdLeaks === 0, "learner-facing internal ID leaks");
assert(exponentRenderingViolations === 0, "exponent/base rendering violations");
assert(duplicatedFinalAnswerViolations === 0, "duplicated final-answer wording");
assert(calculationCompletenessViolations === 0, "calculation completeness violations");
assert(
  genericAnswerGeometryQuestions <= Math.ceil(fullyNumericOptionQuestions * 0.1),
  "answer±1/±2 distractor geometry remains dominant",
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_ENGLISH_EXAM_READINESS_REMEDIATION_AUDIT",
  permanentQlCount: NUM_CP005_PERMANENT_QL_IDS.length,
  solveModeCount: new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  seedsPerQl,
  generatedAuditQuestions,
  exactStemCount: exactStems.size,
  exactExplanationCount: exactExplanations.size,
  crossQlStemCollisions,
  lifecycleViolations,
  optionContractViolations,
  semanticOptionCollisions,
  internalIdLeaks,
  exponentRenderingViolations,
  duplicatedFinalAnswerViolations,
  calculationCompletenessViolations,
  fullyNumericOptionQuestions,
  genericAnswerGeometryQuestions,
  genericAnswerGeometryRate: fullyNumericOptionQuestions === 0 ? 0 : genericAnswerGeometryQuestions / fullyNumericOptionQuestions,
  maximumStemWords,
  maximumStemCharacters,
  maximumProseStemCharacters,
  maximumStructuredTableStemCharacters,
  proseStemCharacterLimit: 260,
  structuredTableStemCharacterLimit: 320,
  reviewStatus: "CRITICAL_REVIEW_REMEDIATED_AWAITING_APPROVAL",
  nextChapterIdentity: "NUM-QL-070",
}, null, 2));
