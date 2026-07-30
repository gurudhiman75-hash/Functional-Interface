import {
  SER_CP002_TEMPORARY_TEMPLATE_IDS,
  SER_CP002_TEMPORARY_TEMPLATES,
  generateSerCp002Question,
  solveSerCp002Sequence,
  type SerCp002Difficulty,
  type SerCp002RuleId,
  type SerCp002TaskKind,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
const aggregateAnswerPositions = [0, 0, 0, 0];
const ruleQuestionCounts: Record<SerCp002RuleId, number> = {
  UNIFORM_MULTIPLICATIVE_RATIO: 0,
  AFFINE_MULTIPLY_THEN_ADD: 0,
};
const taskQuestionCounts: Record<SerCp002TaskKind, number> = {
  NEXT_TERM: 0,
  MISSING_TERM: 0,
  PREVIOUS_TERM: 0,
  WRONG_TERM: 0,
};
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let completePoolAmbiguityChecks = 0;

const templateEvidence: Record<
  string,
  {
    candidateRuleId: SerCp002RuleId;
    answerPositions: number[];
    difficulties: Record<SerCp002Difficulty, number>;
    distinctFingerprints: number;
  }
> = {};

for (
  let templateIndex = 0;
  templateIndex < SER_CP002_TEMPORARY_TEMPLATE_IDS.length;
  templateIndex += 1
) {
  const temporaryTemplateId =
    SER_CP002_TEMPORARY_TEMPLATE_IDS[templateIndex]!;
  const template = SER_CP002_TEMPORARY_TEMPLATES[templateIndex]!;
  const answerPositions = [0, 0, 0, 0];
  const difficulties: Record<SerCp002Difficulty, number> = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp002Question(
      temporaryTemplateId,
      seed,
    );
    const replay = generateSerCp002Question(
      temporaryTemplateId,
      seed,
    );
    assert(
      JSON.stringify(question) === JSON.stringify(replay),
      `${temporaryTemplateId}/${seed}: deterministic replay failed`,
    );
    deterministicReplayChecks += 1;

    assert(question.packageId === "SER-001", "package identity");
    assert(question.checkpointId === "SER-CP-002", "checkpoint identity");
    assert(question.permanentQlId === null, "premature permanent QL allocation");
    assert(
      question.candidateRuleId === template.candidateRuleId,
      `${temporaryTemplateId}/${seed}: template rule mismatch`,
    );
    assert(
      question.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY",
      "incorrect discovery maturity",
    );
    assert(
      !question.lifecycle.active
        && !question.lifecycle.questionStudioDiscoverable
        && !question.lifecycle.questionBankWritable
        && !question.lifecycle.testEligible
        && !question.lifecycle.publiclyPublishable,
      `${temporaryTemplateId}/${seed}: lifecycle boundary leaked`,
    );

    if (
      question.candidateRuleId === "UNIFORM_MULTIPLICATIVE_RATIO"
    ) {
      assert(
        question.hiddenState.addition === 0,
        `${temporaryTemplateId}/${seed}: uniform rule gained an adjustment`,
      );
    } else {
      assert(
        question.hiddenState.addition !== 0,
        `${temporaryTemplateId}/${seed}: affine rule collapsed into uniform multiplication`,
      );
    }

    assert(question.options.length === 4, "four-option contract");
    assert(
      new Set(question.options).size === 4,
      `${temporaryTemplateId}/${seed}: duplicate options`,
    );
    assert(
      question.options[question.correctIndex] === question.correctAnswer,
      `${temporaryTemplateId}/${seed}: correct index mismatch`,
    );
    assert(
      question.options.filter(
        (option) => option === question.correctAnswer,
      ).length === 1,
      `${temporaryTemplateId}/${seed}: answer not unique`,
    );

    const independent = solveSerCp002Sequence(
      question.taskKind,
      question.sequence,
    );
    assert(
      independent.candidateCount === 1,
      `${temporaryTemplateId}/${seed}: complete-pool rule ambiguity`,
    );
    assert(
      independent.candidateRuleId === question.candidateRuleId,
      `${temporaryTemplateId}/${seed}: wrong solve authority`,
    );
    assert(
      independent.answer === question.correctAnswer,
      `${temporaryTemplateId}/${seed}: independent answer mismatch`,
    );
    assert(
      independent.correctReplacement
        === question.hiddenState.correctReplacement,
      `${temporaryTemplateId}/${seed}: replacement mismatch`,
    );
    assert(
      independent.inferredMultiplier
        === question.hiddenState.multiplier
        && independent.inferredAddition
          === question.hiddenState.addition,
      `${temporaryTemplateId}/${seed}: recurrence parameter mismatch`,
    );
    independentSolverChecks += 1;
    completePoolAmbiguityChecks += 1;

    const canonical = question.hiddenState.canonicalSequence;
    for (let index = 1; index < canonical.length; index += 1) {
      assert(
        canonical[index]
          === canonical[index - 1]!
            * question.hiddenState.multiplier
            + question.hiddenState.addition,
        `${temporaryTemplateId}/${seed}: hidden recurrence violation`,
      );
    }

    const missingCount = question.sequence.filter(
      (value) => value == null,
    ).length;
    assert(
      question.taskKind === "WRONG_TERM"
        ? missingCount === 0
        : missingCount === 1,
      `${temporaryTemplateId}/${seed}: invalid task shape`,
    );
    if (question.taskKind === "WRONG_TERM") {
      assert(
        question.hiddenState.corruptedValue === question.correctAnswer,
        `${temporaryTemplateId}/${seed}: wrong-term answer semantic`,
      );
      assert(
        question.hiddenState.correctReplacement !== question.correctAnswer,
        `${temporaryTemplateId}/${seed}: corruption did not alter the term`,
      );
    }

    assert(
      question.explanation.working.length >= 2
        && question.explanation.trapAnalyses.length === 4
        && question.explanation.ruleStatement.length > 20
        && question.explanation.conclusion.length > 10,
      `${temporaryTemplateId}/${seed}: explanation incomplete`,
    );

    for (const value of [
      ...question.sequence.filter(
        (entry): entry is number => entry != null,
      ),
      ...question.options,
    ]) {
      assert(
        Number.isSafeInteger(value) && Math.abs(value) <= 100_000,
        `${temporaryTemplateId}/${seed}: unsafe value ${value}`,
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
      !/SER-(?:CP|QL)|TMP-|undefined|null|\{\{|\}\}/i.test(
        studentFacingText,
      ),
      `${temporaryTemplateId}/${seed}: internal or placeholder text leaked`,
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
    answerPositions.every(
      (count) => count === seedsPerTemplate / 4,
    ),
    `${temporaryTemplateId}: answer positions are not exactly balanced`,
  );
  assert(
    Object.values(difficulties).every(
      (count) => count === seedsPerTemplate / 3,
    ),
    `${temporaryTemplateId}: difficulty reach is not exactly balanced`,
  );
  assert(
    fingerprints.size >= 80,
    `${temporaryTemplateId}: insufficient mathematical variation`,
  );

  templateEvidence[temporaryTemplateId] = {
    candidateRuleId: template.candidateRuleId,
    answerPositions,
    difficulties,
    distinctFingerprints: fingerprints.size,
  };
}

assert(
  ruleQuestionCounts.UNIFORM_MULTIPLICATIVE_RATIO
    === ruleQuestionCounts.AFFINE_MULTIPLY_THEN_ADD,
  "candidate rule families are not sampled equally",
);
assert(
  Object.values(taskQuestionCounts).every(
    (count) =>
      count
      === (SER_CP002_TEMPORARY_TEMPLATE_IDS.length
        * seedsPerTemplate)
        / 4,
  ),
  "task directions are not sampled equally",
);
assert(
  aggregateAnswerPositions.every(
    (count) =>
      count
      === (SER_CP002_TEMPORARY_TEMPLATE_IDS.length
        * seedsPerTemplate)
        / 4,
  ),
  "aggregate answer positions are not exactly balanced",
);

console.log(JSON.stringify({
  status: "PASS_SER_CP002_OPEN_EXECUTABLE_DISCOVERY",
  permanentQlCount: 0,
  temporaryTemplateCount: SER_CP002_TEMPORARY_TEMPLATE_IDS.length,
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
