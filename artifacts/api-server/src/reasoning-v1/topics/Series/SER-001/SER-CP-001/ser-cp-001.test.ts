import {
  SER_CP001_TEMPORARY_TEMPLATE_IDS,
  generateSerCp001Question,
  solveSerCp001Sequence,
  type SerDifficulty,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
const aggregateAnswerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let independentSolverChecks = 0;
let deterministicReplayChecks = 0;
let ambiguityChecks = 0;

const templateEvidence: Record<
  string,
  {
    answerPositions: number[];
    difficulties: Record<SerDifficulty, number>;
    distinctFingerprints: number;
  }
> = {};

for (
  let templateIndex = 0;
  templateIndex < SER_CP001_TEMPORARY_TEMPLATE_IDS.length;
  templateIndex += 1
) {
  const temporaryTemplateId =
    SER_CP001_TEMPORARY_TEMPLATE_IDS[templateIndex]!;
  const answerPositions = [0, 0, 0, 0];
  const difficulties: Record<SerDifficulty, number> = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp001Question(temporaryTemplateId, seed);
    const replay = generateSerCp001Question(temporaryTemplateId, seed);
    assert(
      JSON.stringify(question) === JSON.stringify(replay),
      `${temporaryTemplateId}/${seed}: deterministic replay failed`,
    );
    deterministicReplayChecks += 1;

    assert(question.packageId === "SER-001", "package identity");
    assert(question.checkpointId === "SER-CP-001", "checkpoint identity");
    assert(question.permanentQlId === null, "premature permanent QL allocation");
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
      question.options.filter((option) => option === question.correctAnswer)
        .length === 1,
      `${temporaryTemplateId}/${seed}: answer not unique`,
    );
    assert(
      question.explanation.trapAnalyses.length === question.options.length,
      `${temporaryTemplateId}/${seed}: option analysis incomplete`,
    );
    assert(
      question.explanation.working.length >= 2
        && question.explanation.ruleStatement.length > 20
        && question.explanation.conclusion.length > 10,
      `${temporaryTemplateId}/${seed}: explanation incomplete`,
    );

    const independent = solveSerCp001Sequence(
      question.taskKind,
      question.sequence,
    );
    assert(
      independent.candidateCount === 1,
      `${temporaryTemplateId}/${seed}: ambiguous rule match`,
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
    independentSolverChecks += 1;
    ambiguityChecks += 1;

    const missingCount = question.sequence.filter(
      (value) => value == null,
    ).length;
    assert(
      question.taskKind === "WRONG_TERM"
        ? missingCount === 0
        : missingCount === 1,
      `${temporaryTemplateId}/${seed}: invalid missing-position shape`,
    );
    if (question.taskKind === "WRONG_TERM") {
      assert(
        question.hiddenState.corruptedValue === question.correctAnswer,
        `${temporaryTemplateId}/${seed}: wrong-term answer semantic`,
      );
      assert(
        question.hiddenState.correctReplacement !== question.correctAnswer,
        `${temporaryTemplateId}/${seed}: corruption did not change the term`,
      );
    }

    for (const value of [
      ...question.sequence.filter((entry): entry is number => entry != null),
      ...question.options,
    ]) {
      assert(
        Number.isSafeInteger(value) && Math.abs(value) <= 500,
        `${temporaryTemplateId}/${seed}: unsafe numeric bound ${value}`,
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
    generatedQuestions += 1;
  }

  assert(
    answerPositions.every((count) => count === seedsPerTemplate / 4),
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
    answerPositions,
    difficulties,
    distinctFingerprints: fingerprints.size,
  };
}

assert(
  aggregateAnswerPositions.every(
    (count) =>
      count
      === (SER_CP001_TEMPORARY_TEMPLATE_IDS.length * seedsPerTemplate) / 4,
  ),
  "aggregate answer positions are not exactly balanced",
);

console.log(JSON.stringify({
  status: "PASS_SER_CP001_OPEN_EXECUTABLE_DISCOVERY",
  permanentQlCount: 0,
  temporaryTemplateCount: SER_CP001_TEMPORARY_TEMPLATE_IDS.length,
  candidateSolveAuthorityCount: 1,
  seedsPerTemplate,
  generatedQuestions,
  deterministicReplayChecks,
  independentSolverChecks,
  ambiguityChecks,
  aggregateAnswerPositions,
  templateEvidence,
  lifecycle: {
    questionStudioDiscoverableCount: 0,
    questionBankWritableCount: 0,
    testEligibleCount: 0,
    publiclyPublishableCount: 0,
  },
}, null, 2));
