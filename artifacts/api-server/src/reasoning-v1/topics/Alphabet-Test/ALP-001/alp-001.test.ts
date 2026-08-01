import { auditAlpInstance } from "./ambiguity-checker";
import { generateAlpInstance } from "./instance-generator";
import { solveAlpInstance } from "./independent-solver";
import { ALP_001_CHECKPOINTS, ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function equal<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`);
}

const expectedIds = Array.from({ length: 156 }, (_, index) => `ALP-QL-${String(index + 1).padStart(3, "0")}`);
equal(ALP_001_QLS.length, 156, "ALP-001 QL count");
equal(new Set(ALP_001_QLS.map((ql) => ql.qlId)).size, 156, "ALP-001 unique QL IDs");
equal(JSON.stringify(ALP_001_QLS.map((ql) => ql.qlId)), JSON.stringify(expectedIds), "ALP-001 continuous QL range");
equal(ALP_001_CHECKPOINTS.reduce((sum, checkpoint) => sum + checkpoint.qlCount, 0), 156, "Checkpoint QL allocation");
for (const checkpoint of ALP_001_CHECKPOINTS) {
  equal(ALP_001_QLS.filter((ql) => ql.checkpointId === checkpoint.checkpointId).length, checkpoint.qlCount, `${checkpoint.checkpointId} count`);
}

const answerPositions = [0, 0, 0, 0];
const checkpointDifficulties = new Map<string, Set<string>>();
const checkpointRenderers = new Map<string, Set<string>>();
let generatedCount = 0;
let legacySolverChecks = 0;
let completionChecks = 0;
let repeatedOccurrenceCount = 0;

for (const ql of ALP_001_QLS) {
  const stems = new Set<string>();
  const checkpointNumber = Number(ql.checkpointId.slice(-3));
  for (let seed = 0; seed < 80; seed += 1) {
    let legacyAnswer: string | undefined;
    let legacyOccurrence = false;
    if (checkpointNumber <= 5) {
      const instance = generateAlpInstance(ql, seed);
      const solved = solveAlpInstance(ql, instance);
      const audit = auditAlpInstance(ql, instance, solved);
      assert(audit.accepted, `${ql.qlId} seed ${seed} ambiguity failure: ${audit.reasons.join(" | ")}`);
      legacyAnswer = solved.answer;
      legacyOccurrence = Boolean(instance.occurrenceRef && instance.occurrenceRef.occurrence > 1);
      legacySolverChecks += 1;
    }

    const question = generateAlp001Question(ql.qlId, seed, "en-IN");
    const repeated = generateAlp001Question(ql.qlId, seed, "en-IN");
    equal(JSON.stringify(question), JSON.stringify(repeated), `${ql.qlId} seed ${seed} determinism`);
    generatedCount += 1;
    stems.add(`${question.stem}|${question.options.map((option) => option.value).join("|")}`);
    answerPositions[question.correctIndex] = (answerPositions[question.correctIndex] ?? 0) + 1;
    checkpointDifficulties.set(ql.checkpointId, checkpointDifficulties.get(ql.checkpointId) ?? new Set());
    checkpointDifficulties.get(ql.checkpointId)!.add(question.difficulty);
    checkpointRenderers.set(ql.checkpointId, checkpointRenderers.get(ql.checkpointId) ?? new Set());
    checkpointRenderers.get(ql.checkpointId)!.add(question.renderer);

    if (legacyAnswer !== undefined) equal(question.answer, legacyAnswer, `${ql.qlId} seed ${seed} solver parity`);
    else {
      completionChecks += 1;
      if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
        assert(!question.structuredPrompt.sequence?.length, `${ql.qlId} seed ${seed} option-only question leaked a source sequence`);
        assert(!question.structuredPrompt.word, `${ql.qlId} seed ${seed} option-only question leaked a source word`);
      } else {
        assert((question.structuredPrompt.sequence?.length ?? 0) > 0, `${ql.qlId} seed ${seed} missing completion sequence`);
      }
    }
    equal(question.options.length, 4, `${ql.qlId} seed ${seed} option count`);
    equal(new Set(question.options.map((option) => option.value)).size, 4, `${ql.qlId} seed ${seed} unique options`);
    equal(question.options.filter((option) => option.errorLabel === null).length, 1, `${ql.qlId} seed ${seed} correct marker count`);
    equal(question.options[question.correctIndex]!.value, question.answer, `${ql.qlId} seed ${seed} correct option`);
    assert(question.metadata.independentSolverVerified, `${ql.qlId} seed ${seed} solver verification flag`);
    equal(question.metadata.ambiguityAudit, "EXPLICIT_OPERATION_UNIQUE", `${ql.qlId} seed ${seed} ambiguity flag`);
    equal(question.metadata.runtimeVersion, "ALP-001-RUNTIME-V3", `${ql.qlId} seed ${seed} runtime version`);
    assert(question.stem.length >= 20, `${ql.qlId} seed ${seed} weak stem`);
    assert(!/ALP_|undefined|null|\{\{|\}\}/.test(question.stem), `${ql.qlId} seed ${seed} internal or unresolved stem text`);
    assert(question.explanation.ruleStatement.length >= 35, `${ql.qlId} seed ${seed} weak rule statement`);
    assert(question.explanation.steps.length >= 1, `${ql.qlId} seed ${seed} missing explanation steps`);
    assert(question.explanation.conclusion.includes(question.answer), `${ql.qlId} seed ${seed} conclusion omits answer`);
    assert(!/ALP_|WORD_TRANSFORM_|ALPHA_TRANSFORM_/.test(JSON.stringify(question.explanation)), `${ql.qlId} seed ${seed} leaks internal IDs`);

    if (legacyOccurrence) repeatedOccurrenceCount += 1;
    if (ql.checkpointId === "ALP-CP-004") assert((question.structuredPrompt.transformedSequence?.length ?? 0) > 0, `${ql.qlId} seed ${seed} missing transformed alphabet`);
    if (ql.checkpointId === "ALP-CP-005" && question.metadata.wordTransformId) assert((question.structuredPrompt.transformedWord?.length ?? 0) > 0, `${ql.qlId} seed ${seed} missing transformed word`);
  }
  assert(stems.size >= 8, `${ql.qlId} has insufficient visible variety: ${stems.size}`);
}

const minAnswerPosition = Math.min(...answerPositions);
const maxAnswerPosition = Math.max(...answerPositions);
assert(minAnswerPosition > 0, `An answer position is unused: ${answerPositions.join(", ")}`);
assert(maxAnswerPosition / minAnswerPosition < 1.15, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert(repeatedOccurrenceCount > 20, `Repeated-letter occurrence coverage is too low: ${repeatedOccurrenceCount}`);

for (const checkpoint of ALP_001_CHECKPOINTS) {
  const difficulties = checkpointDifficulties.get(checkpoint.checkpointId)!;
  assert(difficulties.has("MEDIUM"), `${checkpoint.checkpointId} lacks MEDIUM coverage`);
  if (checkpoint.checkpointId !== "ALP-CP-001") assert(difficulties.has("HARD"), `${checkpoint.checkpointId} lacks HARD coverage`);
  assert((checkpointRenderers.get(checkpoint.checkpointId)?.size ?? 0) >= 1, `${checkpoint.checkpointId} lacks renderer coverage`);
}

console.log("ALP-001 CP-001 through CP-010 exhaustive English runtime audit passed.", {
  qlCount: ALP_001_QLS.length,
  generatedCount,
  legacySolverChecks,
  completionChecks,
  answerPositions,
  repeatedOccurrenceCount,
  checkpointDifficulties: Object.fromEntries([...checkpointDifficulties].map(([key, value]) => [key, [...value].sort()])),
});
