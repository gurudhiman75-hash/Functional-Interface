import {
  SER_CP003_TEMPORARY_TEMPLATE_IDS,
  SER_CP003_TEMPORARY_TEMPLATES,
  generateSerCp003Question,
  solveSerCp003Sequence,
  type SerCp003Difficulty,
  type SerCp003RuleId,
  type SerCp003TaskKind,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function differences(values: readonly number[]): number[] {
  const result: number[] = [];
  for (let index = 1; index < values.length; index += 1) {
    result.push(values[index]! - values[index - 1]!);
  }
  return result;
}

const seedsPerTemplate = 120;
const aggregateAnswerPositions = [0, 0, 0, 0];
const ruleQuestionCounts: Record<SerCp003RuleId, number> = {
  CONSTANT_NONZERO_SECOND_DIFFERENCE: 0,
  CONSTANT_NONZERO_THIRD_DIFFERENCE: 0,
};
const taskQuestionCounts: Record<SerCp003TaskKind, number> = {
  NEXT_TERM: 0,
  MISSING_TERM: 0,
  PREVIOUS_TERM: 0,
  WRONG_TERM: 0,
};
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let completePoolAmbiguityChecks = 0;

const templateEvidence: Record<string, {
  candidateRuleId: SerCp003RuleId;
  answerPositions: number[];
  difficulties: Record<SerCp003Difficulty, number>;
  distinctFingerprints: number;
}> = {};

for (
  let templateIndex = 0;
  templateIndex < SER_CP003_TEMPORARY_TEMPLATE_IDS.length;
  templateIndex += 1
) {
  const temporaryTemplateId = SER_CP003_TEMPORARY_TEMPLATE_IDS[templateIndex]!;
  const template = SER_CP003_TEMPORARY_TEMPLATES[templateIndex]!;
  const answerPositions = [0, 0, 0, 0];
  const difficulties: Record<SerCp003Difficulty, number> = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp003Question(temporaryTemplateId, seed);
    const replay = generateSerCp003Question(temporaryTemplateId, seed);
    assert(
      JSON.stringify(question) === JSON.stringify(replay),
      temporaryTemplateId + "/" + seed + ": deterministic replay failed",
    );
    deterministicReplayChecks += 1;

    assert(question.packageId === "SER-001", "package identity");
    assert(question.checkpointId === "SER-CP-003", "checkpoint identity");
    assert(question.permanentQlId === null, "premature permanent QL allocation");
    assert(
      question.candidateRuleId === template.candidateRuleId,
      temporaryTemplateId + "/" + seed + ": template rule mismatch",
    );
    assert(
      question.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY"
        && !question.lifecycle.active
        && !question.lifecycle.questionStudioDiscoverable
        && !question.lifecycle.questionBankWritable
        && !question.lifecycle.testEligible
        && !question.lifecycle.publiclyPublishable,
      temporaryTemplateId + "/" + seed + ": lifecycle boundary leaked",
    );

    if (question.candidateRuleId === "CONSTANT_NONZERO_SECOND_DIFFERENCE") {
      assert(
        question.hiddenState.secondDifference !== 0
          && question.hiddenState.thirdDifference === 0,
        temporaryTemplateId + "/" + seed + ": second-difference authority collapsed",
      );
    } else {
      assert(
        question.hiddenState.thirdDifference !== 0,
        temporaryTemplateId + "/" + seed + ": third-difference authority collapsed",
      );
    }

    assert(
      question.options.length === 4
        && new Set(question.options).size === 4
        && question.options[question.correctIndex] === question.correctAnswer
        && question.options.filter(
          (option) => option === question.correctAnswer,
        ).length === 1,
      temporaryTemplateId + "/" + seed + ": invalid four-option contract",
    );

    const independent = solveSerCp003Sequence(
      question.taskKind,
      question.sequence,
    );
    assert(
      independent.candidateCount === 1
        && independent.candidateRuleId === question.candidateRuleId,
      temporaryTemplateId + "/" + seed + ": complete-pool authority ambiguity",
    );
    assert(
      independent.answer === question.correctAnswer
        && independent.correctReplacement
          === question.hiddenState.correctReplacement,
      temporaryTemplateId + "/" + seed + ": independent answer mismatch",
    );
    assert(
      independent.inferredStart === question.hiddenState.start
        && independent.inferredFirstDifference
          === question.hiddenState.firstDifference
        && independent.inferredSecondDifference
          === question.hiddenState.secondDifference
        && independent.inferredThirdDifference
          === question.hiddenState.thirdDifference,
      temporaryTemplateId + "/" + seed + ": finite-difference parameter mismatch",
    );
    independentSolverChecks += 1;
    completePoolAmbiguityChecks += 1;

    const first = differences(question.hiddenState.canonicalSequence);
    const second = differences(first);
    const third = differences(second);
    assert(
      first[0] === question.hiddenState.firstDifference
        && second[0] === question.hiddenState.secondDifference
        && third.every(
          (value) => value === question.hiddenState.thirdDifference,
        ),
      temporaryTemplateId + "/" + seed + ": hidden difference violation",
    );
    if (question.candidateRuleId === "CONSTANT_NONZERO_SECOND_DIFFERENCE") {
      assert(
        second.every(
          (value) => value === question.hiddenState.secondDifference,
        ),
        temporaryTemplateId + "/" + seed + ": second difference is not constant",
      );
    }

    const missingCount = question.sequence.filter(
      (value) => value == null,
    ).length;
    assert(
      question.taskKind === "WRONG_TERM"
        ? missingCount === 0
        : missingCount === 1,
      temporaryTemplateId + "/" + seed + ": invalid task shape",
    );
    if (question.taskKind === "WRONG_TERM") {
      assert(
        question.hiddenState.corruptedValue === question.correctAnswer
          && question.hiddenState.correctReplacement !== question.correctAnswer,
        temporaryTemplateId + "/" + seed + ": wrong-term semantic failed",
      );
    }

    assert(
      question.explanation.working.length >= 2
        && question.explanation.trapAnalyses.length === 4
        && question.explanation.ruleStatement.length > 20
        && question.explanation.conclusion.length > 10,
      temporaryTemplateId + "/" + seed + ": explanation incomplete",
    );
    for (const value of [
      ...question.sequence.filter(
        (entry): entry is number => entry != null,
      ),
      ...question.options,
    ]) {
      assert(
        Number.isSafeInteger(value) && Math.abs(value) <= 100_000,
        temporaryTemplateId + "/" + seed + ": unsafe value " + value,
      );
    }

    const studentFacingText = [
      question.stem,
      question.explanation.ruleStatement,
      ...question.explanation.working,
      question.explanation.conclusion,
      ...question.explanation.trapAnalyses,
    ].join(" ");
    assert(
      !/SER-(?:CP|QL)|TMP-|undefined|null/i.test(studentFacingText),
      temporaryTemplateId + "/" + seed + ": internal text leaked",
    );

    answerPositions[question.correctIndex]! += 1;
    aggregateAnswerPositions[question.correctIndex]! += 1;
    difficulties[question.difficulty] += 1;
    fingerprints.add(question.mathematicalFingerprint);
    ruleQuestionCounts[question.candidateRuleId] += 1;
    taskQuestionCounts[question.taskKind] += 1;
    generatedQuestions += 1;
  }

  assert(
    answerPositions.every((count) => count === seedsPerTemplate / 4),
    temporaryTemplateId + ": answer positions are not exactly balanced",
  );
  assert(
    Object.values(difficulties).every(
      (count) => count === seedsPerTemplate / 3,
    ),
    temporaryTemplateId + ": difficulty reach is not exactly balanced",
  );
  assert(
    fingerprints.size >= 90,
    temporaryTemplateId + ": insufficient mathematical variation",
  );
  templateEvidence[temporaryTemplateId] = {
    candidateRuleId: template.candidateRuleId,
    answerPositions,
    difficulties,
    distinctFingerprints: fingerprints.size,
  };
}

assert(
  ruleQuestionCounts.CONSTANT_NONZERO_SECOND_DIFFERENCE
    === ruleQuestionCounts.CONSTANT_NONZERO_THIRD_DIFFERENCE,
  "candidate rule families are not sampled equally",
);
assert(
  Object.values(taskQuestionCounts).every(
    (count) => count === 240,
  ),
  "task directions are not sampled equally",
);
assert(
  aggregateAnswerPositions.every((count) => count === 240),
  "aggregate answer positions are not exactly balanced",
);

console.log(JSON.stringify({
  status: "PASS_SER_CP003_OPEN_EXECUTABLE_DISCOVERY",
  permanentQlCount: 0,
  temporaryTemplateCount: SER_CP003_TEMPORARY_TEMPLATE_IDS.length,
  candidateSolveAuthorityCount: 2,
  candidateRules: Object.keys(ruleQuestionCounts),
  seedsPerTemplate,
  generatedQuestions,
  deterministicReplayChecks,
  independentSolverChecks,
  completePoolAmbiguityChecks,
  aggregateAnswerPositions,
  ruleQuestionCounts,
  taskQuestionCounts,
  templateEvidence,
  lifecycle: {
    questionStudioDiscoverableCount: 0,
    questionBankWritableCount: 0,
    testEligibleCount: 0,
    publiclyPublishableCount: 0,
  },
}, null, 2));
