import { ANA_CP006_QLS, anaCp006QlById } from "./question-language.en";
import { ANA_CP006_RULES, clusterRuleById } from "./rule-definitions";

export const ANA_CP006_TASK_REGISTRY = {
  checkpointId: "ANA-CP-006",
  qlRange: ["ANA-QL-161", "ANA-QL-208"] as const,
  qlCount: 48,
  ruleCount: 24,
  taskKind: "letterClusterTransform",
  solveMode: "CLUSTER_RULE",
  renderer: "STRUCTURED_TEXT",
  localeMode: "TRANSLATABLE",
  supportedLocales: ["en-IN", "hi-IN", "pa-IN"] as const,
  publiclyPublishable: false,
  maturity: "RUNTIME_PROOF",
  questionLogics: ANA_CP006_QLS,
  rules: ANA_CP006_RULES,
} as const;

export { anaCp006QlById, clusterRuleById };
