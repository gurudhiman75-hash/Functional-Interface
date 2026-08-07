import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  AtomicOrder,
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import {
  ordinaryRelationSymbol,
  ordinaryRelationWords,
  renderCodedConstraint,
} from "./coded-renderer";
import { CP006_MASK_LABELS } from "./option-builder";
import type { IneCp006Option, IneCp006Scenario } from "./types";

function atomicDomainText(
  domain: readonly AtomicOrder[],
  left: string,
  right: string,
): string {
  const values = domain.map(
    (entry) =>
      `${left} ${entry === "GT" ? ">" : entry === "LT" ? "<" : "="} ${right}`,
  );
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  return `${values[0]}, ${values[1]}, or ${values[2]}`;
}

function decodedStep(
  entry: ComparisonConstraint,
  scenario: IneCp006Scenario,
): string {
  const symbol = scenario.codeMap.symbolByRelation[entry.relation];
  const coded = renderCodedConstraint(
    entry,
    scenario.codeMap,
    scenario.entityNames,
  );
  const ordinary = formatStatement(entry, scenario.entityNames);
  return `The key says ${symbol} means ${ordinaryRelationWords(entry.relation)}, so ${coded} becomes ${ordinary}.`;
}

function relationLabel(
  relation: ComparisonRelation | undefined,
  scenario: IneCp006Scenario,
): string {
  if (!relation) return "the relation cannot be determined";
  return formatStatement(
    {
      leftId: scenario.query!.leftId,
      relation,
      rightId: scenario.query!.rightId,
      sourceStatementId: "Q",
    },
    scenario.entityNames,
  );
}

function relationDistractorWarning(
  option: IneCp006Option,
  correct: IneCp006Option,
): string {
  const offered = option.semanticValue;
  const answer = correct.semanticValue;
  if (answer === "INDETERMINATE")
    return "After decoding, the statements still allow more than one relation, so this option is too definite.";
  if (offered === "INDETERMINATE")
    return "The decoded chain gives a definite relation, so the answer is not indeterminate.";
  if (answer === "GREATER_THAN" && offered === "GREATER_THAN_OR_EQUAL")
    return "This is weaker than the strict greater-than relation proved by the decoded chain.";
  if (answer === "LESS_THAN" && offered === "LESS_THAN_OR_EQUAL")
    return "This is weaker than the strict less-than relation proved by the decoded chain.";
  if (
    answer === "GREATER_THAN_OR_EQUAL" &&
    (offered === "GREATER_THAN" || offered === "EQUAL_TO")
  )
    return "The decoded relation allows both greater than and equal to, so this option is too specific.";
  if (
    answer === "LESS_THAN_OR_EQUAL" &&
    (offered === "LESS_THAN" || offered === "EQUAL_TO")
  )
    return "The decoded relation allows both less than and equal to, so this option is too specific.";
  if (offered === "EQUAL_TO")
    return "The decoded statements do not force the two values to be equal.";
  return "This option uses the wrong direction or the wrong degree of certainty after decoding.";
}

function conclusionWarning(
  option: IneCp006Option,
  scenario: IneCp006Scenario,
): string {
  const correctSummary =
    scenario.expectedMask === "ONLY_I"
      ? "Only conclusion I is guaranteed."
      : scenario.expectedMask === "ONLY_II"
        ? "Only conclusion II is guaranteed."
        : scenario.expectedMask === "BOTH"
          ? "Both conclusions are guaranteed."
          : "Neither conclusion is guaranteed.";
  if (option.conclusionMask === "BOTH")
    return `This choice accepts both conclusions. ${correctSummary}`;
  if (option.conclusionMask === "NEITHER")
    return `This choice rejects both conclusions. ${correctSummary}`;
  return `This choice keeps the wrong conclusion. ${correctSummary}`;
}

export function buildIneCp006Explanation(
  scenario: IneCp006Scenario,
  options: readonly IneCp006Option[],
  correctIndex: number,
): IneCp001Explanation {
  const correctOption = options[correctIndex]!;

  if (scenario.taskKind === "DECODE_RELATION") {
    const entry = scenario.statements[0]!;
    const symbol = scenario.codeMap.symbolByRelation[entry.relation];
    const coded = renderCodedConstraint(
      entry,
      scenario.codeMap,
      scenario.entityNames,
    );
    const ordinary = formatStatement(entry, scenario.entityNames);
    return {
      ruleStatement: `From the supplied key, ${symbol} means ${ordinaryRelationWords(entry.relation)} (${ordinaryRelationSymbol(entry.relation)}).`,
      normalizedStatements: [`Therefore, ${coded} decodes to ${ordinary}.`],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `So the matching ordinary relation is ${ordinary}.`,
      distractorAnalysis: options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => ({
          optionValue: entry.value,
          errorLabel: entry.errorLabel!,
          studentWarning: relationDistractorWarning(entry, correctOption),
        })),
    };
  }

  if (scenario.taskKind === "ENCODE_RELATION") {
    const ordinary = scenario.ordinaryRelation!;
    const symbol = scenario.codeMap.symbolByRelation[ordinary.relation];
    const ordinaryText = formatStatement(ordinary, scenario.entityNames);
    const coded = renderCodedConstraint(
      ordinary,
      scenario.codeMap,
      scenario.entityNames,
    );
    return {
      ruleStatement: `The required relation is ${ordinaryText}.`,
      normalizedStatements: [
        `In the supplied key, ${symbol} represents ${ordinaryRelationWords(ordinary.relation)} (${ordinaryRelationSymbol(ordinary.relation)}).`,
      ],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `Therefore, the correct coded form is ${coded}.`,
      distractorAnalysis: options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => ({
          optionValue: entry.value,
          errorLabel: entry.errorLabel!,
          studentWarning: `Its code symbol represents ${ordinaryRelationWords(entry.encodedRelation!)}, not ${ordinaryRelationWords(ordinary.relation)}.`,
        })),
    };
  }

  const translations = scenario.statements.map((entry) =>
    decodedStep(entry, scenario),
  );
  if (scenario.taskKind === "EVALUATE_CONCLUSIONS") {
    const evaluations = scenario.conclusions.map((entry) =>
      evaluateConclusion(scenario.statements, entry),
    );
    const audit = evaluations.map((entry, index) => {
      const coded = scenario.displayedCodedConclusions[index]!;
      const ordinary = formatStatement(entry.conclusion, scenario.entityNames);
      const left =
        scenario.entityNames[entry.conclusion.leftId] ??
        entry.conclusion.leftId;
      const right =
        scenario.entityNames[entry.conclusion.rightId] ??
        entry.conclusion.rightId;
      const domain = atomicDomainText(
        entry.pairEvidence.possibleAtomicRelations,
        left,
        right,
      );
      return `Conclusion ${index === 0 ? "I" : "II"}, ${coded}, means ${ordinary}. The decoded statements allow ${domain}, so it ${entry.truth === "DEFINITELY_TRUE" ? "definitely follows" : "is not guaranteed"}.`;
    });
    const maskLabel = CP006_MASK_LABELS[scenario.expectedMask!];
    return {
      ruleStatement:
        "Decode the statements first, then decode and test each conclusion separately.",
      normalizedStatements: translations,
      proofSteps: audit,
      modelWitnesses: [],
      conclusion: `Therefore, ${maskLabel[0]!.toLowerCase()}${maskLabel.slice(1)}.`,
      distractorAnalysis: options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => ({
          optionValue: entry.value,
          errorLabel: entry.errorLabel!,
          studentWarning: conclusionWarning(entry, scenario),
        })),
    };
  }

  const agreement = assertSolverAgreement(
    scenario.statements,
    scenario.query!.leftId,
    scenario.query!.rightId,
  );
  const strongest = strongestDefiniteRelation(
    agreement.modelEvidence.possibleAtomicRelations,
  );
  const left =
    scenario.entityNames[scenario.query!.leftId] ?? scenario.query!.leftId;
  const right =
    scenario.entityNames[scenario.query!.rightId] ?? scenario.query!.rightId;
  const domain = atomicDomainText(
    agreement.modelEvidence.possibleAtomicRelations,
    left,
    right,
  );
  return {
    ruleStatement:
      "Replace every code symbol with its meaning before combining the chain.",
    normalizedStatements: translations,
    proofSteps: [`The decoded statements allow ${domain}.`],
    modelWitnesses: [],
    conclusion: strongest
      ? `Therefore, ${relationLabel(strongest, scenario)} is the strongest definite relation.`
      : `Therefore, the relation between ${left} and ${right} cannot be determined.`,
    distractorAnalysis: options
      .filter((entry) => !entry.isCorrect)
      .map((entry) => ({
        optionValue: entry.value,
        errorLabel: entry.errorLabel!,
        studentWarning: relationDistractorWarning(entry, correctOption),
      })),
  };
}
