import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "../pilot/approved-teaching-canonical";
import {
  localizeApprovedOpsQuestion,
  type ApprovedOpsLocale,
  type LocalizedApprovedOpsQuestion,
} from "../pilot/approved-localization-entry";

export const OPS_QL_FREEZE_VERSION = "OPS_001_QL_FREEZE_V1" as const;

export interface OpsQlManifestEntry {
  readonly qlId: `OPS-QL-${string}`;
  readonly checkpointId: `OPS-CP-${string}`;
  readonly candidateId: OpsApprovedCandidateId;
  readonly title: string;
  readonly solveMode: string;
  readonly answerSemantic: string;
  readonly sourceFamilyIds: readonly `OPS-SRC-FAM-${string}`[];
  readonly ambiguityPoolId: string;
  readonly explanationStrategyId: string;
  readonly localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  readonly presentationAliases: readonly string[];
}

export const OPS_QL_ENTRIES = [
  {
    qlId: "OPS-QL-001", checkpointId: "OPS-CP-001", candidateId: "OPS-CAND-001",
    title: "Evaluate after a supplied arithmetic-sign mapping",
    solveMode: "evaluateAfterGivenArithmeticSignMapping", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-01", "OPS-SRC-FAM-16"], ambiguityPoolId: "OPS-AMB-GIVEN-MAPPING-EVAL",
    explanationStrategyId: "OPS-EXP-MAP-THEN-EVALUATE", localeMode: "TRANSLATABLE",
    presentationAliases: ["OPS-CAND-002_RESULT_SLOT"],
  },
  {
    qlId: "OPS-QL-002", checkpointId: "OPS-CP-001", candidateId: "OPS-CAND-003",
    title: "Select an equation by truth after a supplied arithmetic-sign mapping",
    solveMode: "selectEquationByTruthAfterGivenArithmeticMapping", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-01", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-GIVEN-MAPPING-EQUATION",
    explanationStrategyId: "OPS-EXP-MAP-ALL-OPTIONS", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-003", checkpointId: "OPS-CP-002", candidateId: "OPS-CAND-004",
    title: "Evaluate after a supplied arbitrary-token mapping",
    solveMode: "evaluateAfterGivenArbitraryTokenMapping", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-02"], ambiguityPoolId: "OPS-AMB-ARBITRARY-TOKEN-EVAL",
    explanationStrategyId: "OPS-EXP-MAP-THEN-EVALUATE", localeMode: "TRANSLATABLE",
    presentationAliases: ["OPS-CAND-006_RESULT_SLOT"],
  },
  {
    qlId: "OPS-QL-004", checkpointId: "OPS-CP-002", candidateId: "OPS-CAND-005",
    title: "Evaluate language-adapted word-operation tokens",
    solveMode: "evaluateAfterGivenWordTokenMapping", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-02"], ambiguityPoolId: "OPS-AMB-ARBITRARY-TOKEN-EVAL",
    explanationStrategyId: "OPS-EXP-MAP-THEN-EVALUATE", localeMode: "LANGUAGE_ADAPTED", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-005", checkpointId: "OPS-CP-002", candidateId: "OPS-CAND-007",
    title: "Select an equation by truth after an arbitrary-token mapping",
    solveMode: "selectEquationByTruthAfterArbitraryTokenMapping", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-02", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-GIVEN-MAPPING-EQUATION",
    explanationStrategyId: "OPS-EXP-MAP-ALL-OPTIONS", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-006", checkpointId: "OPS-CP-003", candidateId: "OPS-CAND-008",
    title: "Select a true statement after a mixed arithmetic-relation mapping",
    solveMode: "selectStatementByTruthAfterMixedMapping", answerSemantic: "STATEMENT_OR_EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-03", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-MIXED-RELATION",
    explanationStrategyId: "OPS-EXP-MAP-ALL-OPTIONS", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-007", checkpointId: "OPS-CP-003", candidateId: "OPS-CAND-009",
    title: "Recover a missing coded relation token",
    solveMode: "recoverMissingRelationTokenAfterMixedMapping", answerSemantic: "RELATION_TOKEN",
    sourceFamilyIds: ["OPS-SRC-FAM-03"], ambiguityPoolId: "OPS-AMB-MIXED-RELATION",
    explanationStrategyId: "OPS-EXP-COMPARE-TRANSFORMED-SIDES", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-008", checkpointId: "OPS-CP-004", candidateId: "OPS-CAND-010",
    title: "Recover one missing arithmetic operator",
    solveMode: "recoverSingleMissingArithmeticOperator", answerSemantic: "ARITHMETIC_OPERATOR",
    sourceFamilyIds: ["OPS-SRC-FAM-04"], ambiguityPoolId: "OPS-AMB-FILL-SINGLE",
    explanationStrategyId: "OPS-EXP-INSERT-SEQUENCE-AND-VERIFY", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-009", checkpointId: "OPS-CP-004", candidateId: "OPS-CAND-011",
    title: "Recover one missing relation operator",
    solveMode: "recoverSingleMissingRelationOperator", answerSemantic: "RELATION_OPERATOR",
    sourceFamilyIds: ["OPS-SRC-FAM-04"], ambiguityPoolId: "OPS-AMB-FILL-SINGLE",
    explanationStrategyId: "OPS-EXP-COMPARE-TRANSFORMED-SIDES", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-010", checkpointId: "OPS-CP-004", candidateId: "OPS-CAND-012",
    title: "Fill an ordered operator sequence with the relation fixed",
    solveMode: "fillOrderedOperatorsWithFixedRelation", answerSemantic: "OPERATOR_SEQUENCE",
    sourceFamilyIds: ["OPS-SRC-FAM-04"], ambiguityPoolId: "OPS-AMB-FILL-SEQUENCE",
    explanationStrategyId: "OPS-EXP-INSERT-SEQUENCE-AND-VERIFY", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-011", checkpointId: "OPS-CP-004", candidateId: "OPS-CAND-013",
    title: "Fill an ordered sequence including the relation position",
    solveMode: "fillOrderedOperatorsIncludingRelationPosition", answerSemantic: "OPERATOR_AND_RELATION_SEQUENCE",
    sourceFamilyIds: ["OPS-SRC-FAM-05"], ambiguityPoolId: "OPS-AMB-FILL-SEQUENCE",
    explanationStrategyId: "OPS-EXP-INSERT-SEQUENCE-AND-VERIFY", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-012", checkpointId: "OPS-CP-005", candidateId: "OPS-CAND-014",
    title: "Evaluate after a prescribed single operator-pair interchange",
    solveMode: "evaluateAfterSpecifiedSingleOperatorPairSwap", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-06"], ambiguityPoolId: "OPS-AMB-OPERATOR-SWAP",
    explanationStrategyId: "OPS-EXP-SIMULTANEOUS-SWAP-AND-EVALUATE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-013", checkpointId: "OPS-CP-005", candidateId: "OPS-CAND-015",
    title: "Evaluate after a prescribed double operator-pair interchange",
    solveMode: "evaluateAfterSpecifiedDoubleOperatorPairSwap", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-15"], ambiguityPoolId: "OPS-AMB-OPERATOR-SWAP",
    explanationStrategyId: "OPS-EXP-SIMULTANEOUS-SWAP-AND-EVALUATE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-014", checkpointId: "OPS-CP-005", candidateId: "OPS-CAND-016",
    title: "Identify one operator pair that repairs an equation",
    solveMode: "identifySingleOperatorPairSwapForEquation", answerSemantic: "OPERATOR_PAIR",
    sourceFamilyIds: ["OPS-SRC-FAM-07", "OPS-SRC-FAM-17"], ambiguityPoolId: "OPS-AMB-OPERATOR-SWAP",
    explanationStrategyId: "OPS-EXP-ENUMERATE-SWAP-PAIR", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-015", checkpointId: "OPS-CP-005", candidateId: "OPS-CAND-017",
    title: "Identify two disjoint operator pairs that repair an equation",
    solveMode: "identifyTwoOperatorPairSwapsForEquation", answerSemantic: "TWO_OPERATOR_PAIRS",
    sourceFamilyIds: ["OPS-SRC-FAM-15"], ambiguityPoolId: "OPS-AMB-OPERATOR-SWAP",
    explanationStrategyId: "OPS-EXP-ENUMERATE-SWAP-PAIR", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-016", checkpointId: "OPS-CP-005", candidateId: "OPS-CAND-018",
    title: "Identify an arithmetic-relation pair interchange",
    solveMode: "identifyArithmeticRelationPairSwapForEquation", answerSemantic: "OPERATOR_OR_RELATION_PAIR",
    sourceFamilyIds: ["OPS-SRC-FAM-08"], ambiguityPoolId: "OPS-AMB-OPERATOR-RELATION-SWAP",
    explanationStrategyId: "OPS-EXP-ENUMERATE-SWAP-PAIR", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-017", checkpointId: "OPS-CP-005", candidateId: "OPS-CAND-019",
    title: "Select an equation by truth after a prescribed operator interchange",
    solveMode: "selectEquationByTruthAfterSpecifiedOperatorSwap", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-06", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-OPERATOR-SWAP",
    explanationStrategyId: "OPS-EXP-SIMULTANEOUS-SWAP-AND-EVALUATE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-018", checkpointId: "OPS-CP-006", candidateId: "OPS-CAND-020",
    title: "Identify a whole-number pair that repairs an equation",
    solveMode: "identifyWholeNumberPairSwapForEquation", answerSemantic: "WHOLE_NUMBER_PAIR",
    sourceFamilyIds: ["OPS-SRC-FAM-09"], ambiguityPoolId: "OPS-AMB-NUMBER-SWAP",
    explanationStrategyId: "OPS-EXP-ENUMERATE-SWAP-PAIR", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-019", checkpointId: "OPS-CP-006", candidateId: "OPS-CAND-021",
    title: "Evaluate after a prescribed whole-number interchange",
    solveMode: "evaluateAfterSpecifiedWholeNumberSwap", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-09"], ambiguityPoolId: "OPS-AMB-NUMBER-SWAP",
    explanationStrategyId: "OPS-EXP-SIMULTANEOUS-SWAP-AND-EVALUATE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-020", checkpointId: "OPS-CP-006", candidateId: "OPS-CAND-022",
    title: "Select an equation by truth after a prescribed whole-number interchange",
    solveMode: "selectEquationByTruthAfterSpecifiedWholeNumberSwap", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-09", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-NUMBER-SWAP",
    explanationStrategyId: "OPS-EXP-SIMULTANEOUS-SWAP-AND-EVALUATE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-021", checkpointId: "OPS-CP-007", candidateId: "OPS-CAND-023",
    title: "Identify a global digit pair that repairs an equation",
    solveMode: "identifyGlobalDigitPairSwapForEquation", answerSemantic: "DIGIT_PAIR",
    sourceFamilyIds: ["OPS-SRC-FAM-10"], ambiguityPoolId: "OPS-AMB-DIGIT-SWAP",
    explanationStrategyId: "OPS-EXP-DIGIT-SWAP-WITH-LITERAL-REBUILD", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-022", checkpointId: "OPS-CP-007", candidateId: "OPS-CAND-024",
    title: "Evaluate after a prescribed global digit interchange",
    solveMode: "evaluateAfterSpecifiedGlobalDigitSwap", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-10"], ambiguityPoolId: "OPS-AMB-DIGIT-SWAP",
    explanationStrategyId: "OPS-EXP-DIGIT-SWAP-WITH-LITERAL-REBUILD", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-023", checkpointId: "OPS-CP-007", candidateId: "OPS-CAND-025",
    title: "Select an equation by truth after a prescribed global digit interchange",
    solveMode: "selectEquationByTruthAfterSpecifiedGlobalDigitSwap", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-10", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-DIGIT-SWAP",
    explanationStrategyId: "OPS-EXP-DIGIT-SWAP-WITH-LITERAL-REBUILD", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-024", checkpointId: "OPS-CP-008", candidateId: "OPS-CAND-026",
    title: "Identify an operator pair and whole-number pair",
    solveMode: "identifyOperatorAndWholeNumberPairSwap", answerSemantic: "OPERATOR_AND_WHOLE_NUMBER_SWAP",
    sourceFamilyIds: ["OPS-SRC-FAM-11"], ambiguityPoolId: "OPS-AMB-COMPOUND-SWAP",
    explanationStrategyId: "OPS-EXP-COMPOUND-SWAP", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-025", checkpointId: "OPS-CP-008", candidateId: "OPS-CAND-027",
    title: "Identify an operator pair and digit pair",
    solveMode: "identifyOperatorAndDigitPairSwap", answerSemantic: "OPERATOR_AND_DIGIT_SWAP",
    sourceFamilyIds: ["OPS-SRC-FAM-12"], ambiguityPoolId: "OPS-AMB-COMPOUND-SWAP",
    explanationStrategyId: "OPS-EXP-COMPOUND-SWAP", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-026", checkpointId: "OPS-CP-008", candidateId: "OPS-CAND-028",
    title: "Evaluate after a prescribed compound operator and whole-number interchange",
    solveMode: "evaluateAfterSpecifiedCompoundSwap", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-11"], ambiguityPoolId: "OPS-AMB-COMPOUND-SWAP",
    explanationStrategyId: "OPS-EXP-COMPOUND-SWAP", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-027", checkpointId: "OPS-CP-008", candidateId: "OPS-CAND-029",
    title: "Select an equation by truth after a prescribed compound interchange",
    solveMode: "selectEquationByTruthAfterSpecifiedCompoundSwap", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-11", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-COMPOUND-SWAP",
    explanationStrategyId: "OPS-EXP-COMPOUND-SWAP", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-028", checkpointId: "OPS-CP-009", candidateId: "OPS-CAND-030",
    title: "Infer an arithmetic mapping and evaluate a target",
    solveMode: "inferArithmeticOperatorMappingThenEvaluateTarget", answerSemantic: "INTEGER_OR_RATIONAL",
    sourceFamilyIds: ["OPS-SRC-FAM-13"], ambiguityPoolId: "OPS-AMB-HIDDEN-MAPPING",
    explanationStrategyId: "OPS-EXP-INFER-MAPPING-FROM-EVIDENCE", localeMode: "TRANSLATABLE",
    presentationAliases: ["OPS-CAND-031_RESULT_SLOT"],
  },
  {
    qlId: "OPS-QL-029", checkpointId: "OPS-CP-009", candidateId: "OPS-CAND-032",
    title: "Infer an operator mapping and select an equation by truth",
    solveMode: "inferOperatorMappingThenSelectEquationByTruth", answerSemantic: "EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-13", "OPS-SRC-FAM-14"], ambiguityPoolId: "OPS-AMB-HIDDEN-MAPPING",
    explanationStrategyId: "OPS-EXP-INFER-MAPPING-FROM-EVIDENCE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-030", checkpointId: "OPS-CP-009", candidateId: "OPS-CAND-033",
    title: "Recover one unknown operator meaning",
    solveMode: "recoverOneUnknownOperatorMeaning", answerSemantic: "OPERATOR_OR_RELATION_MEANING",
    sourceFamilyIds: ["OPS-SRC-FAM-13"], ambiguityPoolId: "OPS-AMB-HIDDEN-MAPPING",
    explanationStrategyId: "OPS-EXP-RECOVER-MAPPING-COMPONENT", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
  {
    qlId: "OPS-QL-031", checkpointId: "OPS-CP-009", candidateId: "OPS-CAND-034",
    title: "Infer a mixed arithmetic-relation mapping and select the true statement",
    solveMode: "inferMixedArithmeticRelationMappingThenSelectStatement", answerSemantic: "STATEMENT_OR_EQUATION_OPTION",
    sourceFamilyIds: ["OPS-SRC-FAM-03", "OPS-SRC-FAM-13"], ambiguityPoolId: "OPS-AMB-HIDDEN-MAPPING",
    explanationStrategyId: "OPS-EXP-INFER-MAPPING-FROM-EVIDENCE", localeMode: "TRANSLATABLE", presentationAliases: [],
  },
] as const satisfies readonly OpsQlManifestEntry[];

export type OpsQlId = (typeof OPS_QL_ENTRIES)[number]["qlId"];
export type OpsCheckpointId = (typeof OPS_QL_ENTRIES)[number]["checkpointId"];
export type FrozenOpsQuestion = ApprovedOpsQuestion & {
  readonly qlId: OpsQlId;
  readonly qlFreezeVersion: typeof OPS_QL_FREEZE_VERSION;
};
export type LocalizedFrozenOpsQuestion = LocalizedApprovedOpsQuestion & {
  readonly qlId: OpsQlId;
  readonly qlFreezeVersion: typeof OPS_QL_FREEZE_VERSION;
};

export const OPS_CHECKPOINT_RANGES = {
  "OPS-CP-001": { first: "OPS-QL-001", last: "OPS-QL-002", count: 2 },
  "OPS-CP-002": { first: "OPS-QL-003", last: "OPS-QL-005", count: 3 },
  "OPS-CP-003": { first: "OPS-QL-006", last: "OPS-QL-007", count: 2 },
  "OPS-CP-004": { first: "OPS-QL-008", last: "OPS-QL-011", count: 4 },
  "OPS-CP-005": { first: "OPS-QL-012", last: "OPS-QL-017", count: 6 },
  "OPS-CP-006": { first: "OPS-QL-018", last: "OPS-QL-020", count: 3 },
  "OPS-CP-007": { first: "OPS-QL-021", last: "OPS-QL-023", count: 3 },
  "OPS-CP-008": { first: "OPS-QL-024", last: "OPS-QL-027", count: 4 },
  "OPS-CP-009": { first: "OPS-QL-028", last: "OPS-QL-031", count: 4 },
} as const;

export const OPS_MERGED_PRESENTATION_ALIASES = {
  "OPS-CAND-002": "OPS-QL-001",
  "OPS-CAND-006": "OPS-QL-003",
  "OPS-CAND-031": "OPS-QL-028",
} as const;

const ENTRY_BY_QL = new Map<OpsQlId, (typeof OPS_QL_ENTRIES)[number]>(
  OPS_QL_ENTRIES.map((entry) => [entry.qlId, entry]),
);

export function getOpsQlEntry(qlId: OpsQlId): (typeof OPS_QL_ENTRIES)[number] {
  const entry = ENTRY_BY_QL.get(qlId);
  if (!entry) throw new Error(`Unknown frozen OPS-001 QL ID: ${qlId}`);
  return entry;
}

export function generateFrozenOpsQuestion(qlId: OpsQlId, seed: number): FrozenOpsQuestion {
  const entry = getOpsQlEntry(qlId);
  const question = generateApprovedOpsQuestion(entry.candidateId, seed);
  if (question.checkpointId !== entry.checkpointId) {
    throw new Error(`${qlId} checkpoint mismatch: manifest ${entry.checkpointId}, runtime ${question.checkpointId}.`);
  }
  if (question.solveMode !== entry.solveMode) {
    throw new Error(`${qlId} solve-mode mismatch: manifest ${entry.solveMode}, runtime ${question.solveMode}.`);
  }
  return { ...question, qlId, qlFreezeVersion: OPS_QL_FREEZE_VERSION };
}

export function generateLocalizedFrozenOpsQuestion(
  qlId: OpsQlId,
  seed: number,
  locale: ApprovedOpsLocale,
): LocalizedFrozenOpsQuestion {
  const english = generateFrozenOpsQuestion(qlId, seed);
  const localized = localizeApprovedOpsQuestion(english, locale);
  return { ...localized, qlId, qlFreezeVersion: OPS_QL_FREEZE_VERSION };
}

export function assertApprovedCandidateCoverage(): void {
  const manifestCandidates = OPS_QL_ENTRIES.map((entry) => entry.candidateId);
  if (manifestCandidates.length !== OPS_APPROVED_CANDIDATE_IDS.length) {
    throw new Error(`Frozen manifest has ${manifestCandidates.length} candidates; approved runtime has ${OPS_APPROVED_CANDIDATE_IDS.length}.`);
  }
  for (let index = 0; index < OPS_APPROVED_CANDIDATE_IDS.length; index += 1) {
    if (manifestCandidates[index] !== OPS_APPROVED_CANDIDATE_IDS[index]) {
      throw new Error(`Frozen candidate order differs at index ${index}: ${manifestCandidates[index]} vs ${OPS_APPROVED_CANDIDATE_IDS[index]}.`);
    }
  }
}
