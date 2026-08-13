import assert from "node:assert/strict";

import { INE_CP002_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp002Question } from "./generator";
import { reverseComparisonOrientation } from "./scenario-builder";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import { createComparisonConstraint } from "../foundation/relations";
import { validateIneCp002Question } from "./validator";

assert.equal(INE_CP002_PROTOTYPE_CONTRACTS.length, 9);
assert.equal(
  new Set(INE_CP002_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  9,
);
assert.equal(
  new Set(INE_CP002_PROTOTYPE_CONTRACTS.map((entry) => entry.authorityId)).size,
  9,
);
assert.ok(
  INE_CP002_PROTOTYPE_CONTRACTS.every(
    (entry) => entry.status === "PROTOTYPE" && entry.permanentQlId === null,
  ),
);

const answerPositions = [0, 0, 0, 0];
const relationAnswers = new Set<string>();
const topologies = new Set<string>();
const authorities = new Set<string>();
const taskKinds = new Set<string>();
let generatedCount = 0;
let pairSelectionCount = 0;
let indeterminateCount = 0;
const sourceOperators = new Set<string>();
const fiveSeedPositionSequences = new Set<string>();
const definitePairRelations = new Set<string>();
const reviewGraphFingerprints = new Set<string>();
const reviewNodeCounts = new Set<number>();
const reviewStatementCounts = new Set<number>();
const difficulties = new Set<string>();
const releaseTiers = new Set<string>();
const allowedDistractorRoles = new Set([
  "REVERSED_DIRECTION",
  "STRICTNESS_IGNORED",
  "VALID_PATH_IGNORED",
  "QUERY_ORDER_REVERSED",
  "EQUALITY_PROPAGATION_IGNORED",
  "EQUALITY_MISREAD_AS_UNKNOWN",
  "STRICTNESS_INVENTED",
  "EQUALITY_ASSUMED",
  "NO_PATH_MISREAD_AS_EQUALITY",
  "COMMON_BOUND_MISREAD",
  "DIRECT_BUT_WRONG_PAIR",
  "ACTUAL_DEFINITE_PATH",
  "COMMON_BOUND_ONLY",
  "DISCONNECTED_PAIR",
]);

for (const contract of INE_CP002_PROTOTYPE_CONTRACTS) {
  const prototypePositions: number[] = [];
  for (let seed = 0; seed < 20; seed += 1) {
    const question = generateIneCp002Question(contract.prototypeId, seed);
    if (seed < 2) {
      assert.deepEqual(
        generateIneCp002Question(contract.prototypeId, seed),
        question,
        `${contract.prototypeId}/${seed} must be deterministic.`,
      );
    }
    assert.equal(question.packageId, "INE-001");
    assert.equal(question.checkpointId, "INE-CP-002");
    assert.equal(question.authorityId, contract.authorityId);
    assert.equal(question.metadata.taskKind, contract.taskKind);
    assert.equal(question.metadata.runtimeVersion, "ine-cp002-prototype-v4");
    assert.match(question.recordId, /^INE-CP002-[0-9A-F]{8}$/);
    assert.equal(
      question.metadata.competency,
      "MULTI_LINK_INEQUALITY_REASONING",
    );
    assert.equal(question.metadata.reviewStatus, "CHECKPOINT_ACCEPTED");
    assert.ok(question.solutions.mock.length > 60);
    assert.deepEqual(question.solutions.learning, question.explanation);
    assert.match(question.metadata.contentHash, /^[0-9a-f]{8}$/);
    assert.match(question.metadata.graphFingerprint, /^[0-9a-f]{8}$/);
    assert.equal(
      question.metadata.nodeCount,
      Object.keys(question.structuredPrompt.entityNames).length,
    );
    assert.equal(question.metadata.optionRoles.length, 4);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.graphConsistent, true);
    assert.equal(
      question.metadata.statementCount >= contract.minimumStatementCount &&
        question.metadata.statementCount <= contract.maximumStatementCount,
      true,
    );
    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => option.value)).size,
      4,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.metadata.distractorErrorLabels.length, 3);
    assert.ok(
      question.metadata.distractorErrorLabels.every((label) =>
        allowedDistractorRoles.has(label),
      ),
    );
    assert.equal(question.explanation.distractorAnalysis.length, 3);
    assert.ok(question.explanation.ruleStatement.length > 20);
    assert.ok(question.explanation.proofSteps.length >= 1);
    assert.ok(question.explanation.conclusion.length > 35);

    if (seed === 0) {
      const validation = validateIneCp002Question(question);
      assert.equal(validation.valid, true, validation.errors.join(" "));
    }

    if (question.metadata.taskKind === "RELATION") {
      const answer = question.options[question.correctIndex]!.semanticRelation!;
      relationAnswers.add(answer);
      if (answer === "INDETERMINATE") indeterminateCount += 1;
      assert.ok(question.structuredPrompt.query);
      assert.equal(question.answerType, "DEFINITELY_ESTABLISHED_RELATION");
      const reversedAgreement = assertSolverAgreement(
        question.structuredPrompt.statements.map(reverseComparisonOrientation),
        question.structuredPrompt.query!.leftId,
        question.structuredPrompt.query!.rightId,
      );
      assert.equal(
        reversedAgreement.graphEvidence?.strongestDefiniteRelation ??
          "INDETERMINATE",
        answer,
        "Equivalent statement orientation must preserve the answer.",
      );
    } else {
      pairSelectionCount += 1;
      assert.equal(question.answerType, "PAIR_SELECTION");
      assert.equal(question.structuredPrompt.candidatePairs?.length, 4);
      assert.equal(
        Object.keys(question.metadata.candidatePairDefiniteness ?? {}).length,
        4,
      );
      if (question.metadata.taskKind === "SELECT_DEFINITE_PAIR" && seed < 5) {
        const correctPair = question.options[question.correctIndex]!.pair!;
        const agreement = assertSolverAgreement(
          question.structuredPrompt.statements,
          correctPair.leftId,
          correctPair.rightId,
        );
        definitePairRelations.add(
          agreement.graphEvidence!.strongestDefiniteRelation!,
        );
      }
    }

    const learnerText = JSON.stringify({
      stem: question.stem,
      statements: question.displayedStatements,
      options: question.options.map((option) => option.value),
      explanation: question.explanation,
    });
    assert.ok(!/\bE\d+\b/.test(learnerText));
    assert.ok(!learnerText.includes("A valid model has"));
    assert.ok(!learnerText.includes("independently verified"));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));

    answerPositions[question.correctIndex] += 1;
    prototypePositions.push(question.correctIndex);
    for (const statement of question.structuredPrompt.statements) {
      sourceOperators.add(statement.relation);
    }
    topologies.add(question.metadata.topologyId);
    authorities.add(question.authorityId);
    taskKinds.add(question.metadata.taskKind);
    generatedCount += 1;
    difficulties.add(question.difficulty);
    releaseTiers.add(question.metadata.releaseTier);
    if (seed < 5) {
      reviewGraphFingerprints.add(question.metadata.graphFingerprint);
      reviewNodeCounts.add(question.metadata.nodeCount);
      reviewStatementCounts.add(question.metadata.statementCount);
    }
  }
  assert.ok(
    new Set(prototypePositions).size >= 3,
    `${contract.prototypeId} must vary answer positions.`,
  );
  fiveSeedPositionSequences.add(prototypePositions.slice(0, 5).join(","));
}

assert.equal(generatedCount, 180);
assert.ok(
  Math.max(...answerPositions) - Math.min(...answerPositions) <= 20,
  `Answer positions are too imbalanced: ${answerPositions.join(", ")}`,
);
assert.ok(
  fiveSeedPositionSequences.size >= 6,
  "Exported prototypes must not share one seed-to-position sequence.",
);
assert.deepEqual([...sourceOperators].sort(), [
  "EQUAL_TO",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
]);
assert.deepEqual([...relationAnswers].sort(), [
  "EQUAL_TO",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "INDETERMINATE",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
]);
assert.ok(topologies.size >= 10);
assert.equal(authorities.size, 9);
assert.deepEqual([...taskKinds].sort(), [
  "RELATION",
  "SELECT_DEFINITE_PAIR",
  "SELECT_INDETERMINATE_PAIR",
]);
assert.equal(pairSelectionCount, 40);
assert.equal(indeterminateCount, 40);
assert.ok(
  reviewGraphFingerprints.size >= 30,
  `Review pack has only ${reviewGraphFingerprints.size} canonical graph profiles.`,
);
assert.deepEqual([...reviewNodeCounts].sort(), [3, 4, 5]);
assert.deepEqual([...reviewStatementCounts].sort(), [2, 3, 4, 5, 6]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...releaseTiers].sort(), [
  "ADVANCED_PRACTICE",
  "BANKING_PRELIMS",
  "SSC_STANDARD_MOCK",
]);
assert.deepEqual([...definitePairRelations].sort(), [
  "EQUAL_TO",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
]);

const emptyRouteQuestion = generateIneCp002Question(
  "INE-CP002-PROT-SELECT-DEFINITE-PAIR",
  2,
);
const emptyRouteValidation = validateIneCp002Question({
  ...emptyRouteQuestion,
  solutions: {
    ...emptyRouteQuestion.solutions,
    learning: {
      ...emptyRouteQuestion.solutions.learning,
      proofSteps: ["D and A: , so D = A."],
    },
  },
});
assert.ok(
  emptyRouteValidation.errors.includes(
    "Learner explanation contains an empty displayed route.",
  ),
);

const exposedPairQuestion = generateIneCp002Question(
  "INE-CP002-PROT-SELECT-DEFINITE-PAIR",
  0,
);
const exposedPair =
  exposedPairQuestion.options[exposedPairQuestion.correctIndex]!.pair!;
const exposedPairRelation = assertSolverAgreement(
  exposedPairQuestion.structuredPrompt.statements,
  exposedPair.leftId,
  exposedPair.rightId,
).graphEvidence!.strongestDefiniteRelation!;
const exposureValidation = validateIneCp002Question({
  ...exposedPairQuestion,
  structuredPrompt: {
    ...exposedPairQuestion.structuredPrompt,
    statements: [
      ...exposedPairQuestion.structuredPrompt.statements,
      createComparisonConstraint(
        exposedPair.leftId,
        exposedPairRelation,
        exposedPair.rightId,
        "S-EXPOSED",
      ),
    ],
  },
});
assert.ok(
  exposureValidation.errors.includes(
    "A hard pair audit cannot expose the correct pair in one statement.",
  ),
);

console.log("INE-CP-002 multi-link discovery audit passed.", {
  generatedCount,
  answerPositions,
  exportedPositionSequenceCount: fiveSeedPositionSequences.size,
  sourceOperators: [...sourceOperators].sort(),
  relationAnswers: [...relationAnswers].sort(),
  authorityCount: authorities.size,
  topologyCount: topologies.size,
  pairSelectionCount,
  indeterminateCount,
  definitePairRelations: [...definitePairRelations].sort(),
  reviewGraphFingerprintCount: reviewGraphFingerprints.size,
  reviewNodeCounts: [...reviewNodeCounts].sort(),
  reviewStatementCounts: [...reviewStatementCounts].sort(),
  difficulties: [...difficulties].sort(),
  releaseTiers: [...releaseTiers].sort(),
  permanentQlCount: 0,
});
