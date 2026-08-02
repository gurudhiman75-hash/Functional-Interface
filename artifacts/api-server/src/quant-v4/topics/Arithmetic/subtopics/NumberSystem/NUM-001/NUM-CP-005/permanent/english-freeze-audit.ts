import {
  NUM_CP005_PERMANENT_ALLOCATION,
  NUM_CP005_PERMANENT_QL_IDS,
} from "./allocation";
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
let optionTrapViolations = 0;
let internalIdLeaks = 0;
let maximumStemWords = 0;
let maximumStemCharacters = 0;
let maximumProseStemCharacters = 0;
let maximumStructuredTableStemCharacters = 0;

const internalIdPattern = /NUM-(?:QL|CP)|CP005-PROT|CP005-AUTH|CP005-SM|QLC-/i;

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
    const stemCharacterLimit = isStructuredTable ? 520 : 260;
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
    assert(question.explanation.stepByStep.length > 0, `${allocation.qlId}/${seed}: missing steps`);
    assert(question.explanation.examSpeedMethod.trim().length > 0, `${allocation.qlId}/${seed}: missing speed method`);
    assert(question.explanation.finalAnswer.includes(question.canonicalAnswer), `${allocation.qlId}/${seed}: final answer mismatch`);

    const wrongOptions = question.options.filter((option) => !option.isCorrect);
    if (
      wrongOptions.length !== 3
      || wrongOptions.some((option) => !option.misconceptionId || !option.analysis.trim())
      || question.explanation.commonTraps.length !== 3
    ) optionTrapViolations += 1;

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
assert(optionTrapViolations === 0, "option/trap violations");
assert(internalIdLeaks === 0, "learner-facing internal ID leaks");

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_ENGLISH_IMPLEMENTATION_FREEZE_AUDIT",
  permanentQlCount: NUM_CP005_PERMANENT_QL_IDS.length,
  frozenSolveModeCount: new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  seedsPerQl,
  generatedAuditQuestions,
  exactStemCount: exactStems.size,
  exactExplanationCount: exactExplanations.size,
  crossQlStemCollisions,
  lifecycleViolations,
  optionTrapViolations,
  internalIdLeaks,
  maximumStemWords,
  maximumStemCharacters,
  maximumProseStemCharacters,
  maximumStructuredTableStemCharacters,
  proseStemCharacterLimit: 260,
  structuredTableStemCharacterLimit: 520,
  nextChapterIdentity: "NUM-QL-070",
}, null, 2));
