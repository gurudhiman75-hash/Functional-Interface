import assert from "node:assert/strict";

import { INE_CP002_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp002Question } from "./generator";
import { reverseComparisonOrientation } from "./scenario-builder";
import { assertSolverAgreement } from "../foundation/solver-agreement";
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
    assert.equal(question.metadata.runtimeVersion, "ine-cp002-prototype-v2");
    assert.match(question.recordId, /^INE-CP002-[0-9A-F]{8}$/);
    assert.equal(
      question.metadata.competency,
      "MULTI_LINK_INEQUALITY_REASONING",
    );
    assert.equal(question.metadata.reviewStatus, "PENDING_MANUAL_REVIEW");
    assert.match(question.metadata.contentHash, /^[0-9a-f]{8}$/);
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
assert.deepEqual([...definitePairRelations].sort(), [
  "EQUAL_TO",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
]);

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
  permanentQlCount: 0,
});
