export { ANA_CP007_QLS, anaCp007QlById } from "./question-language.en";
export { ANA_CP007_RULES, wordRuleById } from "./rule-definitions";
export { generateWordAnalogy } from "./generator";
export { generateLocalizedWordAnalogy } from "./localized-runtime";
export { solveWordRule, matchingWordRules } from "./independent-solver";
export { checkWordAmbiguity } from "./ambiguity-checker";

export const ANA_CP007_RUNTIME = {
  checkpointId: "ANA-CP-007",
  qlRange: ["ANA-QL-209", "ANA-QL-222"],
  qlCount: 14,
  ruleFamilyCount: 7,
  locales: ["en-IN", "hi-IN", "pa-IN"],
  runtimeVersion: "ana-cp-007-v1",
  maturity: "RUNTIME_PROOF",
  publiclyPublishable: false,
} as const;
