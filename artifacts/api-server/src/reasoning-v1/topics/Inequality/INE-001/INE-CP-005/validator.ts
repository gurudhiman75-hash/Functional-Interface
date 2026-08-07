import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import {
  normalizePhraseKey,
  strongestDefiniteRelation,
} from "../foundation/relations";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import { formatStatement } from "../INE-CP-001/presentation";
import { renderLinguisticConstraint } from "./linguistic-renderer";
import { CP005_MASK_LABELS, relationOptionText } from "./option-builder";
import type {
  GeneratedIneCp005Question,
  IneCp005ConclusionMask,
  IneCp005ValidationResult,
} from "./types";

function expectedMask(truths: readonly string[]): IneCp005ConclusionMask {
  const first = truths[0] === "DEFINITELY_TRUE";
  const second = truths[1] === "DEFINITELY_TRUE";
  if (first && second) return "BOTH";
  if (first) return "ONLY_I";
  if (second) return "ONLY_II";
  return "NEITHER";
}

export function validateIneCp005Question(
  question: GeneratedIneCp005Question,
): IneCp005ValidationResult {
  const errors: string[] = [];
  const scenario = question.structuredScenario;
  if (
    question.options.length !== 4 ||
    new Set(question.options.map((entry) => entry.value)).size !== 4
  )
    errors.push("Exactly four unique options are required.");
  if (question.options.filter((entry) => entry.isCorrect).length !== 1)
    errors.push("Exactly one option must be correct.");
  if (!question.options[question.correctIndex]?.isCorrect)
    errors.push("correctIndex does not point to the correct option.");
  if (
    question.options
      .filter((entry) => !entry.isCorrect)
      .some((entry) => !entry.errorLabel)
  )
    errors.push("Every distractor needs a misconception label.");
  if (question.explanation.distractorAnalysis.length !== 3)
    errors.push("Every distractor needs learner-facing feedback.");

  scenario.renderedStatements.forEach((entry, index) => {
    if (question.displayedStatements[index] !== entry.text)
      errors.push("Displayed statement does not match structured rendering.");
    if (entry.surfaceKind === "LINGUISTIC") {
      if (
        !entry.phraseKey ||
        normalizePhraseKey(entry.phraseKey) !== entry.constraint.relation
      )
        errors.push("Linguistic phrase normalization is incorrect.");
      else if (
        entry.text !==
        renderLinguisticConstraint(
          entry.constraint,
          entry.phraseKey,
          scenario.entityNames,
          scenario.context,
        )
      )
        errors.push("Linguistic text is not reproducible from its phrase key.");
    } else if (
      entry.text !== formatStatement(entry.constraint, scenario.entityNames)
    )
      errors.push("Symbolic text does not match its constraint.");
  });

  const checkedPairs = [
    ...(scenario.query ? [scenario.query] : []),
    ...scenario.conclusions.map((entry) => ({
      leftId: entry.leftId,
      rightId: entry.rightId,
    })),
  ];
  for (const pair of checkedPairs) {
    const agreement = verifySolverAgreement(
      scenario.statements,
      pair.leftId,
      pair.rightId,
    );
    if (!agreement.agreed) errors.push("Independent solvers disagree.");
    if (!agreement.graphAnalysis.consistent)
      errors.push("Statements are contradictory.");
  }

  const correct = question.options[question.correctIndex];
  if (scenario.taskKind === "EVALUATE_CONCLUSIONS") {
    const truths = scenario.conclusions.map(
      (entry) => evaluateConclusion(scenario.statements, entry).truth,
    );
    const mask = expectedMask(truths);
    if (
      scenario.conclusions.length !== 2 ||
      mask !== scenario.expectedMask ||
      correct?.conclusionMask !== mask
    )
      errors.push("Conclusion mask does not match formal truth values.");
    if (
      new Set(question.options.map((entry) => entry.conclusionMask)).size !==
      Object.keys(CP005_MASK_LABELS).length
    )
      errors.push("All four conclusion masks must appear once.");
  } else {
    const semantic =
      scenario.taskKind === "INTERPRET_RELATION"
        ? scenario.statements[0]!.relation
        : (strongestDefiniteRelation(
            verifySolverAgreement(
              scenario.statements,
              scenario.query!.leftId,
              scenario.query!.rightId,
            ).modelEvidence.possibleAtomicRelations,
          ) ?? "INDETERMINATE");
    if (correct?.semanticValue !== semantic)
      errors.push("Marked relation does not match solver evidence.");
    for (const option of question.options) {
      if (
        !option.semanticValue ||
        option.value !== relationOptionText(option.semanticValue, scenario)
      )
        errors.push("Displayed relation option does not match its semantics.");
    }
    if (
      scenario.taskKind === "INTERPRET_RELATION" &&
      (scenario.query?.leftId !== scenario.statements[0]?.leftId ||
        scenario.query?.rightId !== scenario.statements[0]?.rightId)
    )
      errors.push(
        "Interpretation query orientation does not match the displayed statement.",
      );
  }
  if (scenario.taskKind === "SOLVE_MIXED_RELATION") {
    if (
      question.metadata.linguisticStatementCount < 1 ||
      question.metadata.symbolicStatementCount < 1
    )
      errors.push(
        "Mixed questions require both linguistic and symbolic statements.",
      );
  } else if (question.metadata.symbolicStatementCount !== 0)
    errors.push("This authority must use linguistic statements only.");

  if (
    question.permanentQlId !== null ||
    !question.prototypeOnly ||
    question.publiclyPublishable ||
    question.questionStudioVisible
  )
    errors.push("CP-005 discovery records must remain unreleased prototypes.");
  const learnerText = JSON.stringify({
    stem: question.stem,
    statements: question.displayedStatements,
    conclusions: question.displayedConclusions,
    options: question.options.map((entry) => entry.value),
    solutions: question.solutions,
  });
  if (/\bE[1-9]\b/.test(learnerText))
    errors.push("Learner text exposes an internal entity ID.");
  if (/\b(?:undefined|null|NaN)\b/i.test(learnerText))
    errors.push("Learner text contains a missing-value placeholder.");
  if (/Ã¢â‚¬Å“|Ã¢â‚¬Â|Ã¢â€°|Ãƒ|Ã¯Â¿Â½|ï¿½/.test(learnerText))
    errors.push("Learner text contains damaged character encoding.");
  return { valid: errors.length === 0, errors };
}
