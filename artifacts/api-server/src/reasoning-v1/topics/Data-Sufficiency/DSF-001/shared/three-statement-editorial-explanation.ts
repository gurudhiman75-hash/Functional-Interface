import type { ThreeStatementSufficiencyEvaluation } from "../DSF-CP-015/three-statement-foundation.ts";
import { renderThreeStatementSemanticLabel, type DsfCp015ThreeStatementSemanticKey } from "../DSF-CP-015/three-statement-answer-profile.ts";

const ORDER = [
  ["I"],
  ["II"],
  ["III"],
  ["I","II"],
  ["I","III"],
  ["II","III"],
  ["I","II","III"],
] as const;

function subsetLabel(ids: readonly string[]): string {
  if (ids.length === 1) return `Statement ${ids[0]} alone`;
  if (ids.length === 2) return `Statements ${ids[0]} and ${ids[1]} together`;
  return "Statements I, II and III together";
}

export function renderThreeStatementEditorialExplanation<Answer>(
  evaluation: ThreeStatementSufficiencyEvaluation<Answer>,
  targetLabel: string,
  semanticKey: DsfCp015ThreeStatementSemanticKey,
): string {
  const lines = [`We need to determine ${targetLabel}.`];

  for (const ids of ORDER) {
    const entry = evaluation.subsetEvaluations.find(
      (candidate) =>
        candidate.statementIds.length === ids.length &&
        ids.every((id) => candidate.statementIds.includes(id as "I" | "II" | "III")),
    );
    if (!entry) continue;

    const label = subsetLabel(ids);
    if (entry.result.sufficient) {
      lines.push(`${label}: sufficient; it fixes ${targetLabel} as ${entry.result.normalizedTargetAnswers[0]}.`);
    } else {
      const examples = entry.result.normalizedTargetAnswers.slice(0, 3);
      lines.push(
        examples.length > 1
          ? `${label}: insufficient; possible values include ${examples.join(", ")}.`
          : `${label}: insufficient; it does not fix one unique value.`,
      );
    }
  }

  lines.push(`Hence, ${renderThreeStatementSemanticLabel(semanticKey)}`);
  return lines.join(" ");
}
