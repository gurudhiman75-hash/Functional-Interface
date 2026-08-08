import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import { formatStatement } from "../INE-CP-001/presentation";
import type { IneCp001Explanation } from "../INE-CP-001/types";
import { ordinaryRelationWords, renderCodedConstraint } from "./coded-renderer";
import { conclusionMaskLabel } from "./conclusion-masks";
import type { IneCp006Option, IneCp006Scenario } from "./types";

function naturalList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function decodedSummary(scenario: IneCp006Scenario): string {
  const ordinaryStatements = scenario.statements.map((entry) =>
    formatStatement(entry, scenario.entityNames),
  );
  return `Decode the statements: ${naturalList(ordinaryStatements)}.`;
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

export function buildIneCp006Explanation(
  scenario: IneCp006Scenario,
  _options: readonly IneCp006Option[],
  _correctIndex: number,
): IneCp001Explanation {
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
      ruleStatement: `${symbol} means ${ordinaryRelationWords(entry.relation)}.`,
      normalizedStatements: [],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `So ${coded} means ${ordinary}.`,
      distractorAnalysis: [],
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
      ruleStatement: `${symbol} means ${ordinaryRelationWords(ordinary.relation)}.`,
      normalizedStatements: [],
      proofSteps: [],
      modelWitnesses: [],
      conclusion: `So ${ordinaryText} is written as ${coded}.`,
      distractorAnalysis: [],
    };
  }

  const translation = decodedSummary(scenario);
  if (scenario.taskKind === "EVALUATE_CONCLUSIONS") {
    const evaluations = scenario.conclusions.map((entry) =>
      evaluateConclusion(scenario.statements, entry),
    );
    const resultSummary = naturalList(
      evaluations.map(
        (entry, index) =>
          `conclusion ${["I", "II", "III"][index]} ${entry.truth === "DEFINITELY_TRUE" ? "follows" : "does not follow"}`,
      ),
    );
    const maskLabel = conclusionMaskLabel(
      scenario.expectedMask!,
      scenario.conclusions.length as 2 | 3,
    );
    return {
      ruleStatement: translation,
      normalizedStatements: [],
      proofSteps: [`Therefore, ${resultSummary}.`],
      modelWitnesses: [],
      conclusion: `Answer: ${maskLabel}.`,
      distractorAnalysis: [],
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
  return {
    ruleStatement: translation,
    normalizedStatements: [],
    proofSteps: [],
    modelWitnesses: [],
    conclusion: strongest
      ? `So ${relationLabel(strongest, scenario)}.`
      : `There is no definite relation between ${left} and ${right}.`,
    distractorAnalysis: [],
  };
}
