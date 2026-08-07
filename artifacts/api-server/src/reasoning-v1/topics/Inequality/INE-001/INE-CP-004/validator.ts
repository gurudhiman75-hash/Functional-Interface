import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import { formatStatement } from "../INE-CP-001/presentation";
import { evaluateComplementaryPair } from "./complementary";
import {
  CP004_PAIR_STATUS_LABELS,
  CP004_THREE_MASK_LABELS,
  CP004_TWO_MASK_LABELS,
  formatConclusionPair,
} from "./option-builder";
import type {
  GeneratedIneCp004Question,
  IneCp004PairStatus,
  IneCp004ThreeConclusionMask,
  IneCp004TwoConclusionMask,
  IneCp004ValidationResult,
} from "./types";

function checkLearnerText(
  question: GeneratedIneCp004Question,
  errors: string[],
): void {
  const learnerText = JSON.stringify({
    stem: question.stem,
    statements: question.displayedStatements,
    conclusions: question.displayedConclusions,
    options: question.options.map((option) => option.value),
    solutions: question.solutions,
  });
  if (/\bE[1-9]\b/.test(learnerText)) {
    errors.push("Learner-facing text exposes an internal entity ID.");
  }
  if (/\b(?:undefined|null|NaN)\b/i.test(learnerText)) {
    errors.push("Learner-facing text contains a missing-value placeholder.");
  }
  if (/â€œ|â€|â‰|Ã|ï¿½|�/.test(learnerText)) {
    errors.push("Learner-facing text contains damaged character encoding.");
  }
}

export function validateIneCp004Question(
  question: GeneratedIneCp004Question,
): IneCp004ValidationResult {
  const errors: string[] = [];
  const scenario = question.structuredScenario;
  const expectedOptionCount = 4;

  if (question.options.length !== expectedOptionCount) {
    errors.push(`Exactly ${expectedOptionCount} options are required.`);
  }
  if (
    new Set(question.options.map((option) => option.value)).size !==
    expectedOptionCount
  ) {
    errors.push("All option texts must be unique.");
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
  if (
    question.explanation.distractorAnalysis.length !==
    expectedOptionCount - 1
  ) {
    errors.push("Every distractor requires a learner-facing explanation.");
  }

  for (const conclusion of scenario.conclusions) {
    const agreement = verifySolverAgreement(
      scenario.statements,
      conclusion.leftId,
      conclusion.rightId,
    );
    if (!agreement.agreed) errors.push("The independent solvers disagree.");
    if (!agreement.graphAnalysis.consistent)
      errors.push("Displayed statements are contradictory.");
  }

  const correct = question.options[question.correctIndex];
  if (scenario.taskKind === "CLASSIFY_PAIR") {
    if (scenario.conclusions.length !== 2) {
      errors.push("Pair classification requires two conclusions.");
    }
    const evidence = evaluateComplementaryPair(scenario.statements, {
      first: scenario.conclusions[0]!,
      second: scenario.conclusions[1]!,
    });
    if (
      !evidence.status ||
      evidence.status !== scenario.expectedPairStatus ||
      correct?.pairStatus !== evidence.status
    ) {
      errors.push("The marked pair status does not match formal evidence.");
    }
    const statuses = question.options.map((option) => option.pairStatus);
    if (
      statuses.some((status) => !status) ||
      new Set(statuses).size !== Object.keys(CP004_PAIR_STATUS_LABELS).length
    ) {
      errors.push("All four pair-status responses must appear exactly once.");
    }
    for (const option of question.options) {
      if (
        !option.pairStatus ||
        option.value !== CP004_PAIR_STATUS_LABELS[option.pairStatus]
      ) {
        errors.push(`Option “${option.value}” has an invalid pair status.`);
      }
    }
  } else if (scenario.taskKind === "SELECT_PAIR") {
    if (scenario.candidatePairs?.length !== 4) {
      errors.push("Pair-selection questions require four candidate pairs.");
    } else {
      const evidence = scenario.candidatePairs.map((pair) =>
        evaluateComplementaryPair(scenario.statements, pair),
      );
      const validIndices = evidence.flatMap((entry, index) =>
        entry.validEitherOr ? [index] : [],
      );
      if (validIndices.length !== 1) {
        errors.push("Exactly one candidate pair must be valid either-or.");
      } else if (correct?.candidatePairIndex !== validIndices[0]) {
        errors.push("The marked option is not the valid complementary pair.");
      }
      for (const option of question.options) {
        const pair = scenario.candidatePairs[option.candidatePairIndex ?? -1];
        if (
          !pair ||
          option.value !== formatConclusionPair(pair, scenario.entityNames)
        ) {
          errors.push(
            `Option “${option.value}” has no matching candidate pair.`,
          );
        }
      }
    }
  } else if (scenario.taskKind === "EVALUATE_TWO_CONCLUSIONS") {
    if (scenario.conclusions.length !== 2) {
      errors.push("Two-conclusion questions require exactly two conclusions.");
    }
    const evidence = evaluateComplementaryPair(scenario.statements, {
      first: scenario.conclusions[0]!,
      second: scenario.conclusions[1]!,
    });
    if (!evidence.validEitherOr) {
      errors.push("The displayed conclusions are not a valid either-or pair.");
    }
    if (correct?.twoConclusionMask !== "EITHER_I_OR_II") {
      errors.push("The marked response must be the either-or mask.");
    }
    const masks = question.options.map((option) => option.twoConclusionMask);
    if (masks.some((mask) => !mask) || new Set(masks).size !== 4) {
      errors.push(
        "Exactly four distinct two-conclusion responses are required.",
      );
    }
    for (const option of question.options) {
      if (
        !option.twoConclusionMask ||
        option.value !== CP004_TWO_MASK_LABELS[option.twoConclusionMask]
      ) {
        errors.push(`Option “${option.value}” has an invalid response mask.`);
      }
    }
  } else {
    if (scenario.conclusions.length !== 3) {
      errors.push(
        "Three-conclusion questions require exactly three conclusions.",
      );
    }
    const firstTruth = evaluateConclusion(
      scenario.statements,
      scenario.conclusions[0]!,
    ).truth;
    const evidence = evaluateComplementaryPair(scenario.statements, {
      first: scenario.conclusions[1]!,
      second: scenario.conclusions[2]!,
    });
    if (firstTruth !== "DEFINITELY_TRUE" || !evidence.validEitherOr) {
      errors.push("The definite-plus-either-or structure is invalid.");
    }
    if (correct?.threeConclusionMask !== "I_AND_EITHER_II_OR_III") {
      errors.push("The marked three-conclusion mask is incorrect.");
    }
    const masks = question.options.map((option) => option.threeConclusionMask);
    if (
      masks.some((mask) => !mask) ||
      new Set(masks).size !== Object.keys(CP004_THREE_MASK_LABELS).length
    ) {
      errors.push("All four three-conclusion masks must appear exactly once.");
    }
    for (const option of question.options) {
      if (
        !option.threeConclusionMask ||
        option.value !== CP004_THREE_MASK_LABELS[option.threeConclusionMask]
      ) {
        errors.push(`Option “${option.value}” has an invalid response mask.`);
      }
    }
  }

  if (scenario.taskKind !== "SELECT_PAIR") {
    if (
      question.displayedConclusions?.length !== scenario.conclusions.length ||
      question.displayedConclusions.some(
        (displayed, index) =>
          displayed !==
          formatStatement(scenario.conclusions[index]!, scenario.entityNames),
      )
    ) {
      errors.push("Displayed conclusions do not match their structures.");
    }
  }
  if (
    question.permanentQlId !== null ||
    !question.prototypeOnly ||
    question.publiclyPublishable ||
    question.questionStudioVisible
  ) {
    errors.push("CP-004 discovery records must remain unreleased prototypes.");
  }
  checkLearnerText(question, errors);
  return { valid: errors.length === 0, errors };
}
