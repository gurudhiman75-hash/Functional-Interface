import { ANA_CP005_QLS } from "./question-language.en";
import { ANA_CP005_RULES } from "./rule-definitions";

export const ANA_CP005_TASK_REGISTRY = {
  checkpointId: "ANA-CP-005",
  qlRange: ["ANA-QL-141", "ANA-QL-160"] as const,
  qlCount: 20,
  renderer: "STRUCTURED_TEXT",
  localeMode: "TRANSLATABLE",
  questionLogics: ANA_CP005_QLS,
  rules: ANA_CP005_RULES,
} as const;

export function anaCp005QlById(qlId: string) {
  const ql = ANA_CP005_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-005 QL: ${qlId}`);
  return ql;
}
