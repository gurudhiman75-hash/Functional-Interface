import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { AtomicOrder, ComparisonRelation } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import {
  ordinaryRelationSymbol,
  ordinaryRelationWords,
  renderCodedConstraint,
} from "./coded-renderer";
import { conclusionMaskLabel } from "./conclusion-masks";
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

function naturalList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function decodedSummary(scenario: IneCp006Scenario): string {
  const ordinaryStatements = scenario.statements.map((entry) =>
    formatStatement(entry, scenario.entityNames),
  );
  return `Replacing the code symbols gives ${naturalList(ordinaryStatements)}.`;
}

function evidenceSentence(
  domain: readonly AtomicOrder[],
  domainText: string,
  follows: boolean,
): string {
  if (domain.length === 1)
    return `The statements force ${domainText}, so this conclusion ${follows ? "follows" : "does not follow"}.`;
  return `The statements still allow ${domainText}, so this conclusion is not certain.`;
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
  const count = scenario.conclusions.length as 2 | 3;
  const correctSummary = conclusionMaskLabel(scenario.expectedMask!, count);
  const offered = conclusionMaskLabel(option.conclusionMask!, count);
  return `${offered}, but checking each conclusion separately gives: ${correctSummary}.`;
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

  const translation = decodedSummary(scenario);
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
      return `Conclusion ${["I", "II", "III"][index]} (${coded}) says ${ordinary}. ${evidenceSentence(entry.pairEvidence.possibleAtomicRelations, domain, entry.truth === "DEFINITELY_TRUE")}`;
    });
    const maskLabel = conclusionMaskLabel(
      scenario.expectedMask!,
      scenario.conclusions.length as 2 | 3,
    );
    return {
      ruleStatement:
        "First translate the code key. Then check each conclusion on its own; one conclusion cannot borrow support from another.",
      normalizedStatements: [translation],
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
      "Translate the symbols first, and then follow the chain only in the direction asked.",
    normalizedStatements: [translation],
    proofSteps: [
      agreement.modelEvidence.possibleAtomicRelations.length === 1
        ? `For ${left} and ${right}, the chain forces ${domain}.`
        : `For ${left} and ${right}, the statements still allow ${domain}.`,
    ],
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
