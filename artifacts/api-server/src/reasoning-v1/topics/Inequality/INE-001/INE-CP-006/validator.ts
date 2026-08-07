import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { strongestDefiniteRelation } from "../foundation/relations";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import { formatStatement } from "../INE-CP-001/presentation";
import {
  renderCodeKey,
  renderCodedConstraint,
  renderCodedExpressions,
} from "./coded-renderer";
import { CP006_MASK_LABELS, relationOptionText } from "./option-builder";
import type {
  GeneratedIneCp006Question,
  IneCp006ConclusionMask,
  IneCp006ValidationResult,
} from "./types";

function expectedMask(truths: readonly string[]): IneCp006ConclusionMask {
  const first = truths[0] === "DEFINITELY_TRUE";
  const second = truths[1] === "DEFINITELY_TRUE";
  if (first && second) return "BOTH";
  if (first) return "ONLY_I";
  if (second) return "ONLY_II";
  return "NEITHER";
}

export function validateIneCp006Question(
  question: GeneratedIneCp006Question,
): IneCp006ValidationResult {
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

  const relations = Object.keys(scenario.codeMap.symbolByRelation);
  const symbols = Object.values(scenario.codeMap.symbolByRelation);
  if (
    relations.length !== 5 ||
    symbols.length !== 5 ||
    new Set(symbols).size !== 5 ||
    scenario.keyEntries.length !== 5 ||
    question.displayedCodeKey.length !== 5 ||
    question.metadata.codeKeySize !== 5
  )
    errors.push("CP-006 requires a complete bijective five-symbol code key.");
  const expectedKey = renderCodeKey(scenario.codeMap);
  if (
    JSON.stringify(expectedKey) !== JSON.stringify(scenario.keyEntries) ||
    JSON.stringify(question.displayedCodeKey) !==
      JSON.stringify(expectedKey.map((entry) => entry.text))
  )
    errors.push(
      "Displayed code key is not reproducible from the structured map.",
    );

  const expectedStatements =
    scenario.taskKind === "ENCODE_RELATION"
      ? [formatStatement(scenario.ordinaryRelation!, scenario.entityNames)]
      : renderCodedExpressions(
          scenario.statements,
          scenario.codeMap,
          scenario.entityNames,
        );
  if (
    JSON.stringify(question.displayedStatements) !==
    JSON.stringify(expectedStatements)
  )
    errors.push("Displayed statements do not match the structured scenario.");
  const expectedConclusions = scenario.conclusions.map((entry) =>
    renderCodedConstraint(entry, scenario.codeMap, scenario.entityNames),
  );
  if (
    JSON.stringify(question.displayedConclusions ?? []) !==
    JSON.stringify(expectedConclusions)
  )
    errors.push("Displayed conclusions do not match the coded constraints.");

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
      scenario.conclusions.length === 2 &&
      new Set(
        scenario.conclusions.map((entry) =>
          [entry.leftId, entry.rightId].sort().join(":"),
        ),
      ).size !== 2
    )
      errors.push(
        "CP-006 four-mask conclusions must not create an either-or pair.",
      );
    if (
      new Set(question.options.map((entry) => entry.conclusionMask)).size !==
      Object.keys(CP006_MASK_LABELS).length
    )
      errors.push("All four conclusion masks must appear once.");
  } else if (scenario.taskKind === "ENCODE_RELATION") {
    if (correct?.encodedRelation !== scenario.ordinaryRelation?.relation)
      errors.push("Marked code does not encode the required relation.");
    for (const option of question.options) {
      if (
        !option.encodedRelation ||
        option.value !==
          renderCodedConstraint(
            { ...scenario.ordinaryRelation!, relation: option.encodedRelation },
            scenario.codeMap,
            scenario.entityNames,
          )
      )
        errors.push(
          "Displayed coded option does not match its stored relation.",
        );
    }
  } else {
    const semantic =
      scenario.taskKind === "DECODE_RELATION"
        ? scenario.statements[0]!.relation
        : (strongestDefiniteRelation(
            verifySolverAgreement(
              scenario.statements,
              scenario.query!.leftId,
              scenario.query!.rightId,
            ).modelEvidence.possibleAtomicRelations,
          ) ?? "INDETERMINATE");
    if (correct?.semanticValue !== semantic)
      errors.push("Marked relation does not match decoded solver evidence.");
    for (const option of question.options) {
      if (
        !option.semanticValue ||
        option.value !== relationOptionText(option.semanticValue, scenario)
      )
        errors.push("Displayed relation option does not match its semantics.");
    }
    if (
      scenario.taskKind === "DECODE_RELATION" &&
      (scenario.query?.leftId !== scenario.statements[0]?.leftId ||
        scenario.query?.rightId !== scenario.statements[0]?.rightId)
    )
      errors.push(
        "Decode query orientation does not match the coded statement.",
      );
  }

  if (
    question.permanentQlId !== null ||
    !question.prototypeOnly ||
    question.publiclyPublishable ||
    question.questionStudioVisible
  )
    errors.push("CP-006 discovery records must remain unreleased prototypes.");
  const learnerText = JSON.stringify({
    stem: question.stem,
    key: question.displayedCodeKey,
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
