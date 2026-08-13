import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  AtomicOrder,
  ComparisonRelation,
  RelationPhraseKey,
} from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import { CP005_MASK_LABELS } from "./option-builder";
import type { IneCp005Option, IneCp005Scenario } from "./types";

function phraseMeaning(phraseKey: RelationPhraseKey): string {
  if (phraseKey === "NOT_LESS_THAN") return "allows greater than or equal to";
  if (phraseKey === "NOT_GREATER_THAN") return "allows less than or equal to";
  if (phraseKey === "NEITHER_LESS_NOR_GREATER") return "means equal to";
  if (phraseKey === "NEITHER_LESS_NOR_EQUAL")
    return "rules out less than and equal to, so it means greater than";
  if (phraseKey === "NEITHER_GREATER_NOR_EQUAL")
    return "rules out greater than and equal to, so it means less than";
  if (phraseKey === "GREATER_THAN") return "means greater than";
  if (phraseKey === "LESS_THAN") return "means less than";
  return "means equal to";
}

function withoutFinalPeriod(text: string): string {
  return text.endsWith(".") ? text.slice(0, -1) : text;
}

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

function relationLabel(
  relation: ComparisonRelation | undefined,
  scenario: IneCp005Scenario,
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
  option: IneCp005Option,
  correct: IneCp005Option,
): string {
  const offered = option.semanticValue;
  const answer = correct.semanticValue;
  if (answer === "INDETERMINATE")
    return "The statements do not fix one definite relation, so this option claims more than the information proves.";
  if (offered === "INDETERMINATE")
    return "A definite relation can be derived from the statements, so the answer is not indeterminate.";
  if (answer === "GREATER_THAN" && offered === "GREATER_THAN_OR_EQUAL")
    return "This is weaker than the strict greater-than relation proved by the chain.";
  if (answer === "LESS_THAN" && offered === "LESS_THAN_OR_EQUAL")
    return "This is weaker than the strict less-than relation proved by the chain.";
  if (
    answer === "GREATER_THAN_OR_EQUAL" &&
    (offered === "GREATER_THAN" || offered === "EQUAL_TO")
  )
    return "The wording allows both greater than and equal to, so this option is too specific.";
  if (
    answer === "LESS_THAN_OR_EQUAL" &&
    (offered === "LESS_THAN" || offered === "EQUAL_TO")
  )
    return "The wording allows both less than and equal to, so this option is too specific.";
  if (offered === "EQUAL_TO")
    return "Nothing in the statement or chain forces the two values to be equal.";
  return "This comparison points in the wrong direction or uses the wrong degree of certainty.";
}

function conclusionDistractorWarning(
  option: IneCp005Option,
  expectedMask: IneCp005Scenario["expectedMask"],
): string {
  const correctSummary =
    expectedMask === "ONLY_I"
      ? "Only conclusion I is guaranteed."
      : expectedMask === "ONLY_II"
        ? "Only conclusion II is guaranteed."
        : expectedMask === "BOTH"
          ? "Both conclusions are guaranteed."
          : "Neither conclusion is guaranteed.";
  if (option.conclusionMask === "BOTH")
    return `This option treats both conclusions as certain. ${correctSummary}`;
  if (option.conclusionMask === "NEITHER")
    return `This option rejects both conclusions. ${correctSummary}`;
  return `This option keeps the wrong conclusion. ${correctSummary}`;
}

export function buildIneCp005Explanation(
  scenario: IneCp005Scenario,
  options: readonly IneCp005Option[],
  correctIndex: number,
): IneCp001Explanation {
  const translations = [
    `In symbols: ${scenario.statements
      .map((statement) => formatStatement(statement, scenario.entityNames))
      .join(", ")}.`,
  ];
  const correctOption = options[correctIndex]!;
  if (scenario.taskKind === "INTERPRET_RELATION") {
    const statement = scenario.renderedStatements[0]!;
    const normalized = formatStatement(
      statement.constraint,
      scenario.entityNames,
    );
    return {
      ruleStatement: `“${withoutFinalPeriod(statement.text)}” ${phraseMeaning(statement.phraseKey!)}.`,
      normalizedStatements: [],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `So the sentence is written symbolically as ${normalized}.`,
      distractorAnalysis: options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => ({
          optionValue: entry.value,
          errorLabel: entry.errorLabel!,
          studentWarning: relationDistractorWarning(entry, correctOption),
        })),
    };
  }
  if (scenario.taskKind === "EVALUATE_CONCLUSIONS") {
    const evaluations = scenario.conclusions.map((entry) =>
      evaluateConclusion(scenario.statements, entry),
    );
    const audit = evaluations.map((entry, index) => {
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
      return `Conclusion ${index === 0 ? "I" : "II"} ${entry.truth === "DEFINITELY_TRUE" ? "follows" : "is not certain"} because the possible relation is ${domain}.`;
    });
    return {
      ruleStatement:
        "Translate the statements first, then check the conclusions.",
      normalizedStatements: translations,
      proofSteps: audit,
      modelWitnesses: [],
      conclusion: `Therefore, ${CP005_MASK_LABELS[scenario.expectedMask!][0]!.toLowerCase()}${CP005_MASK_LABELS[scenario.expectedMask!].slice(1)}.`,
      distractorAnalysis: options
        .filter((entry) => !entry.isCorrect)
        .map((entry) => ({
          optionValue: entry.value,
          errorLabel: entry.errorLabel!,
          studentWarning: conclusionDistractorWarning(
            entry,
            scenario.expectedMask,
          ),
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
      "Translate the verbal comparisons first, then connect only the statements that link the two required terms.",
    normalizedStatements: translations,
    proofSteps: [`The translated statements allow ${domain}.`],
    modelWitnesses: [],
    conclusion: strongest
      ? `Therefore, ${relationLabel(strongest, scenario)}.`
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
