import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import type { AtomicOrder, ComparisonConstraint } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import { CP003_TRUTH_LABELS, formatAtomicRelationSet } from "./option-builder";
import type {
  GeneratedIneCp003Question,
  IneCp003ValidationResult,
} from "./types";

const ATOMIC_ORDER: readonly AtomicOrder[] = ["LT", "EQ", "GT"];

function atomicSetKey(relations: readonly AtomicOrder[]): string {
  return ATOMIC_ORDER.filter((relation) => relations.includes(relation)).join(
    "|",
  );
}

function sameConclusion(
  left: ComparisonConstraint | undefined,
  right: ComparisonConstraint,
): boolean {
  return (
    left?.leftId === right.leftId &&
    left.relation === right.relation &&
    left.rightId === right.rightId
  );
}

function checkLearnerText(
  question: GeneratedIneCp003Question,
  errors: string[],
): void {
  const learnerText = JSON.stringify({
    stem: question.stem,
    statements: question.displayedStatements,
    conclusion: question.displayedConclusion,
    options: question.options.map((option) => option.value),
    solutions: question.solutions,
  });
  if (/\bE\d+\b/.test(learnerText)) {
    errors.push("Learner-facing text exposes an internal entity ID.");
  }
  if (/\b(?:undefined|null|NaN)\b/i.test(learnerText)) {
    errors.push("Learner-facing text contains a missing-value placeholder.");
  }
  if (/â€”|â‰|ï¿½/.test(learnerText)) {
    errors.push("Learner-facing text contains damaged character encoding.");
  }
}

export function validateIneCp003Question(
  question: GeneratedIneCp003Question,
): IneCp003ValidationResult {
  const errors: string[] = [];
  const scenario = question.structuredScenario;

  if (question.options.length !== 4) {
    errors.push("Exactly four options are required.");
  }
  if (new Set(question.options.map((option) => option.value)).size !== 4) {
    errors.push("All four option texts must be unique.");
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    errors.push("Exactly one option must be marked correct.");
  }
  if (question.options[question.correctIndex]?.isCorrect !== true) {
    errors.push("correctIndex must point to the marked correct option.");
  }
  if (
    question.options
      .filter((option) => !option.isCorrect)
      .some((option) => !option.errorLabel)
  ) {
    errors.push("Every distractor requires a misconception label.");
  }
  if (question.explanation.distractorAnalysis.length !== 3) {
    errors.push("Every distractor requires a learner-facing explanation.");
  }
  if (scenario.statements.length === 0) {
    errors.push("At least one displayed statement is required.");
  }

  const pairs = [
    ...scenario.conclusions.map((conclusion) => ({
      leftId: conclusion.leftId,
      rightId: conclusion.rightId,
    })),
    ...(scenario.query ? [scenario.query] : []),
  ];
  for (const pair of pairs) {
    const agreement = verifySolverAgreement(
      scenario.statements,
      pair.leftId,
      pair.rightId,
    );
    if (!agreement.agreed) {
      errors.push(`Solvers disagree for ${pair.leftId}/${pair.rightId}.`);
    }
    if (!agreement.graphAnalysis.consistent) {
      errors.push("Displayed statements are contradictory.");
    }
  }

  const correct = question.options[question.correctIndex];
  if (scenario.taskKind === "CLASSIFY_CONCLUSION") {
    if (scenario.conclusions.length !== 1) {
      errors.push("Classification questions require exactly one conclusion.");
    } else {
      const evaluation = evaluateConclusion(
        scenario.statements,
        scenario.conclusions[0]!,
      );
      if (correct?.truth !== evaluation.truth) {
        errors.push("The marked truth label does not match solver evidence.");
      }
      if (correct?.value !== CP003_TRUTH_LABELS[evaluation.truth]) {
        errors.push("The marked truth label is rendered incorrectly.");
      }
      if (
        question.displayedConclusion !==
        formatStatement(scenario.conclusions[0]!, scenario.entityNames)
      ) {
        errors.push("The displayed conclusion does not match its structure.");
      }
      if (
        evaluation.truth === "POSSIBLY_TRUE" &&
        question.explanation.modelWitnesses.length < 2
      ) {
        errors.push(
          "A possible conclusion needs both supporting and rejecting witnesses.",
        );
      }
    }
  } else if (scenario.taskKind === "SELECT_CONCLUSION") {
    if (scenario.conclusions.length !== 4) {
      errors.push("Conclusion-selection questions require four conclusions.");
    }
    const evaluations = scenario.conclusions.map((conclusion) =>
      evaluateConclusion(scenario.statements, conclusion),
    );
    const targets = evaluations.filter(
      (evaluation) => evaluation.truth === scenario.targetTruth,
    );
    if (targets.length !== 1) {
      errors.push(
        `Exactly one conclusion must be ${scenario.targetTruth}; found ${targets.length}.`,
      );
    } else if (!sameConclusion(correct?.conclusion, targets[0]!.conclusion)) {
      errors.push("The marked option is not the unique target conclusion.");
    }
    for (const option of question.options) {
      const evaluation = evaluations.find((candidate) =>
        sameConclusion(option.conclusion, candidate.conclusion),
      );
      if (!evaluation) {
        errors.push(`Option “${option.value}” has no matching conclusion.`);
        continue;
      }
      if (option.truth !== evaluation.truth) {
        errors.push(`Option “${option.value}” has the wrong truth class.`);
      }
      if (
        option.value !==
        formatStatement(evaluation.conclusion, scenario.entityNames)
      ) {
        errors.push(`Option “${option.value}” is rendered incorrectly.`);
      }
    }
  } else {
    if (!scenario.query) {
      errors.push("Possible-relation questions require a query pair.");
    } else {
      const agreement = verifySolverAgreement(
        scenario.statements,
        scenario.query.leftId,
        scenario.query.rightId,
      );
      const expected = agreement.modelEvidence.possibleAtomicRelations;
      if (
        atomicSetKey(correct?.atomicRelations ?? []) !== atomicSetKey(expected)
      ) {
        errors.push(
          "The marked relation set does not match model enumeration.",
        );
      }
      const leftName =
        scenario.entityNames[scenario.query.leftId] ?? scenario.query.leftId;
      const rightName =
        scenario.entityNames[scenario.query.rightId] ?? scenario.query.rightId;
      for (const option of question.options) {
        if (!option.atomicRelations || option.atomicRelations.length === 0) {
          errors.push(`Option “${option.value}” has no relation-set meaning.`);
        } else if (
          option.value !==
          formatAtomicRelationSet(option.atomicRelations, leftName, rightName)
        ) {
          errors.push(`Option “${option.value}” is rendered incorrectly.`);
        }
      }
      if (question.explanation.modelWitnesses.length !== expected.length) {
        errors.push("Every possible atomic relation requires a witness.");
      }
    }
  }

  if (
    question.permanentQlId !== null ||
    !question.prototypeOnly ||
    question.publiclyPublishable ||
    question.questionStudioVisible
  ) {
    errors.push("CP-003 discovery records must remain unreleased prototypes.");
  }
  checkLearnerText(question, errors);

  return { valid: errors.length === 0, errors };
}
