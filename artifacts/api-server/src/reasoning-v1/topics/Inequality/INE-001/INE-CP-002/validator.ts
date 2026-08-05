import { verifySolverAgreement } from "../foundation/solver-agreement";
import { answerOptionLabel } from "../INE-CP-001/presentation";
import type { IneCp001StructuredPrompt } from "../INE-CP-001/types";
import { formatPairOption } from "./option-builder";
import type {
  GeneratedIneCp002Question,
  IneCp002ValidationResult,
} from "./types";

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
