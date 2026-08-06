import { verifySolverAgreement } from "../foundation/solver-agreement";
import { relationAcceptsAtomicOrder } from "../foundation/relations";
import { answerOptionLabel } from "../INE-CP-001/presentation";
import type { IneCp001StructuredPrompt } from "../INE-CP-001/types";
import { formatPairOption } from "./option-builder";
import type {
  GeneratedIneCp002Question,
  IneCp002ValidationResult,
} from "./types";

function directlyCompared(
  question: GeneratedIneCp002Question,
  leftId: string,
  rightId: string,
): boolean {
  return question.structuredPrompt.statements.some(
    (statement) =>
      (statement.leftId === leftId && statement.rightId === rightId) ||
      (statement.leftId === rightId && statement.rightId === leftId),
  );
}

function shortestUndirectedPathLength(
  question: GeneratedIneCp002Question,
  startId: string,
  endId: string,
): number | undefined {
  const queue: { entityId: string; distance: number }[] = [
    { entityId: startId, distance: 0 },
  ];
  const visited = new Set([startId]);
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.entityId === endId) return current.distance;
    for (const statement of question.structuredPrompt.statements) {
      const neighbour =
        statement.leftId === current.entityId
          ? statement.rightId
          : statement.rightId === current.entityId
            ? statement.leftId
            : undefined;
      if (neighbour && !visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push({ entityId: neighbour, distance: current.distance + 1 });
      }
    }
  }
  return undefined;
}

function explanationStrings(question: GeneratedIneCp002Question): string[] {
  const explanation = question.solutions.learning;
  return [
    question.solutions.mock,
    explanation.ruleStatement,
    ...explanation.normalizedStatements,
    ...explanation.proofSteps,
    ...explanation.modelWitnesses,
    explanation.conclusion,
    ...explanation.distractorAnalysis.flatMap((entry) => [
      entry.optionValue,
      entry.studentWarning,
    ]),
  ];
}

export function validateIneCp002Question(
  question: GeneratedIneCp002Question,
): IneCp002ValidationResult {
  const errors: string[] = [];
  if (question.options.length !== 4) {
    errors.push("Exactly four options are required.");
  }
  if (new Set(question.options.map((option) => option.value)).size !== 4) {
    errors.push("Options must have unique text.");
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    errors.push("Exactly one option must be marked correct.");
  }
  if (question.options[question.correctIndex]?.isCorrect !== true) {
    errors.push("correctIndex must identify the marked answer.");
  }
  if (question.metadata.distractorErrorLabels.length !== 3) {
    errors.push("Every distractor requires a misconception owner.");
  }
  if (question.structuredPrompt.statements.length === 0) {
    errors.push("A question cannot have an empty statement list.");
  }
  if (
    question.metadata.topologyId === "BRANCH_PLUS_DISCONNECTED_EQUALITY" ||
    question.metadata.topologyId === "CHAIN_PLUS_DISCONNECTED_EQUALITY"
  ) {
    errors.push("Pair-audit topology metadata is misleading.");
  }
  const expectedTier =
    question.difficulty === "EASY"
      ? "SSC_STANDARD_MOCK"
      : question.difficulty === "HARD"
        ? "ADVANCED_PRACTICE"
        : "BANKING_PRELIMS";
  if (question.metadata.releaseTier !== expectedTier) {
    errors.push("Release tier does not match calibrated difficulty.");
  }
  const explanationParts = explanationStrings(question);
  if (explanationParts.some((part) => part.trim().length === 0)) {
    errors.push("Learner explanations cannot contain empty proof text.");
  }
  if (explanationParts.some((part) => /:\s*,/.test(part))) {
    errors.push("Learner explanation contains an empty displayed route.");
  }
  if (question.solutions.learning.proofSteps.length === 0) {
    errors.push("A learning solution requires at least one proof step.");
  }

  if (question.metadata.taskKind === "RELATION") {
    const query = question.structuredPrompt.query;
    if (!query) {
      errors.push("A relation question requires a query pair.");
    } else {
      const agreement = verifySolverAgreement(
        question.structuredPrompt.statements,
        query.leftId,
        query.rightId,
      );
      if (!agreement.agreed) errors.push("The two solvers disagree.");
      if (!agreement.graphAnalysis.consistent) {
        errors.push("Displayed statements are contradictory.");
      }
      const expected =
        agreement.graphEvidence?.strongestDefiniteRelation ?? "INDETERMINATE";
      if (
        question.options[question.correctIndex]?.semanticRelation !== expected
      ) {
        errors.push("The marked relation does not match the solved answer.");
      }
      const cp001Prompt: IneCp001StructuredPrompt = {
        statements: question.structuredPrompt.statements,
        query,
        entityNames: question.structuredPrompt.entityNames,
      };
      const necessarilyTrueOptions = question.options.filter((option) => {
        const semanticRelation = option.semanticRelation;
        if (!semanticRelation) return false;
        if (semanticRelation === "INDETERMINATE") {
          return expected === "INDETERMINATE";
        }
        return agreement.modelEvidence.possibleAtomicRelations.every((order) =>
          relationAcceptsAtomicOrder(semanticRelation, order),
        );
      });
      if (
        necessarilyTrueOptions.length !== 1 ||
        necessarilyTrueOptions[0]?.isCorrect !== true
      ) {
        errors.push(
          "Exam-standard relation options must contain exactly one necessarily true answer.",
        );
      }
      for (const option of question.options) {
        if (!option.semanticRelation) {
          errors.push(`Relation option “${option.value}” lacks semantics.`);
          continue;
        }
        if (
          option.value !==
          answerOptionLabel(option.semanticRelation, cp001Prompt)
        ) {
          errors.push(`Relation option “${option.value}” is rendered wrongly.`);
        }
      }
      const leftName = question.structuredPrompt.entityNames[query.leftId]!;
      const rightName = question.structuredPrompt.entityNames[query.rightId]!;
      if (
        !question.solutions.learning.conclusion.includes(leftName) ||
        !question.solutions.learning.conclusion.includes(rightName)
      ) {
        errors.push("The relation explanation must name the queried pair.");
      }
      if (
        question.authorityId === "DETERMINE_MULTI_ROUTE_RELATION" &&
        directlyCompared(question, query.leftId, query.rightId)
      ) {
        errors.push(
          "A medium or hard multi-route question cannot state the answer pair directly.",
        );
      }
    }
  } else {
    const pairs = question.structuredPrompt.candidatePairs;
    if (!pairs || pairs.length !== 4) {
      errors.push("A pair-selection question requires four candidate pairs.");
    } else {
      const canonicalPairKeys = pairs.map((pair) =>
        [pair.leftId, pair.rightId].sort().join("|"),
      );
      if (new Set(canonicalPairKeys).size !== pairs.length) {
        errors.push("Candidate pairs must be unique even when reversed.");
      }
      const targetDefinite =
        question.metadata.taskKind === "SELECT_DEFINITE_PAIR";
      const matchingOptions = question.options.filter((option) => {
        if (!option.pair) return false;
        const agreement = verifySolverAgreement(
          question.structuredPrompt.statements,
          option.pair.leftId,
          option.pair.rightId,
        );
        if (!agreement.agreed) {
          errors.push(`Solver disagreement for pair ${option.pair.pairId}.`);
        }
        const definite = Boolean(
          agreement.graphEvidence?.strongestDefiniteRelation,
        );
        if (option.pairIsDefinite !== definite) {
          errors.push(
            `Stored definiteness is wrong for ${option.pair.pairId}.`,
          );
        }
        if (
          option.value !==
          formatPairOption(option.pair, question.structuredPrompt.entityNames)
        ) {
          errors.push(`Pair option “${option.value}” is rendered wrongly.`);
        }
        return definite === targetDefinite;
      });
      if (matchingOptions.length !== 1 || !matchingOptions[0]!.isCorrect) {
        errors.push("The marked pair does not match the selection contract.");
      }
      const correctPair = question.options[question.correctIndex]?.pair;
      if (
        question.difficulty === "HARD" &&
        question.metadata.taskKind === "SELECT_DEFINITE_PAIR" &&
        correctPair
      ) {
        if (
          directlyCompared(question, correctPair.leftId, correctPair.rightId)
        ) {
          errors.push(
            "A hard pair audit cannot expose the correct pair in one statement.",
          );
        }
        const pathLength = shortestUndirectedPathLength(
          question,
          correctPair.leftId,
          correctPair.rightId,
        );
        if (pathLength === undefined || pathLength < 2) {
          errors.push(
            "A hard definite-pair answer requires a multi-step comparison path.",
          );
        }
      }
    }
  }

  const learnerText = JSON.stringify({
    stem: question.stem,
    statements: question.displayedStatements,
    options: question.options.map((option) => option.value),
    explanation: question.explanation,
  });
  if (/\bE\d+\b/.test(learnerText)) {
    errors.push("Learner text leaks internal entity identifiers.");
  }
  if (/\b(?:undefined|null|NaN)\b/.test(learnerText)) {
    errors.push("Learner text contains an invalid placeholder.");
  }
  return { valid: errors.length === 0, errors };
}
