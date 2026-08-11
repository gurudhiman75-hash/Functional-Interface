export const INT_CP001_RELEASE_ID = "INT-CP-001-EN-v1" as const;

export const INT_CP001_FINAL_QL_IDS = [
  "INT-QL-001", "INT-QL-002", "INT-QL-003", "INT-QL-004", "INT-QL-005",
  "INT-QL-006", "INT-QL-007", "INT-QL-008", "INT-QL-009", "INT-QL-010",
  "INT-QL-011", "INT-QL-012", "INT-QL-013", "INT-QL-014", "INT-QL-015",
  "INT-QL-016", "INT-QL-017", "INT-QL-018", "INT-QL-019", "INT-QL-020",
  "INT-QL-021",
] as const;

export type IntCp001FinalQlId = (typeof INT_CP001_FINAL_QL_IDS)[number];
export type IntCp001SourceKind = "FOUNDATION" | "WAVE2" | "CLOSURE";

export interface IntCp001SourceAdapter {
  kind: IntCp001SourceKind;
  prototypeId: string;
  representation?: "YEARS" | "MONTHS" | "DAYS" | "ANNUAL_SPECIAL" | "DEFAULT";
  answerUnit?: "DEFAULT" | "MONTHS";
}

export interface IntCp001FinalRegistryEntry {
  qlId: IntCp001FinalQlId;
  cpId: "INT-CP-001";
  solveContract: string;
  taskDirection: "FORWARD" | "INVERSE" | "RECONSTRUCTION";
  answerSemantic:
    | "SIMPLE_INTEREST"
    | "TOTAL_AMOUNT"
    | "PRINCIPAL"
    | "ANNUAL_RATE_PERCENT"
    | "TIME"
    | "ANNUAL_INTEREST"
    | "AMOUNT_MULTIPLE"
    | "INTEREST_TO_PRINCIPAL_RATIO";
  topology: string;
  baselineDifficulty: "Easy" | "Medium" | "Hard";
  sourceAdapters: readonly IntCp001SourceAdapter[];
  active: true;
  releaseId: typeof INT_CP001_RELEASE_ID;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

const foundation = (prototypeId: string, representation: IntCp001SourceAdapter["representation"] = "DEFAULT"): IntCp001SourceAdapter => ({
  kind: "FOUNDATION",
  prototypeId,
  representation,
});
const wave2 = (prototypeId: string, representation: IntCp001SourceAdapter["representation"] = "DEFAULT", answerUnit: IntCp001SourceAdapter["answerUnit"] = "DEFAULT"): IntCp001SourceAdapter => ({
  kind: "WAVE2",
  prototypeId,
  representation,
  answerUnit,
});
const closure = (prototypeId: string): IntCp001SourceAdapter => ({ kind: "CLOSURE", prototypeId, representation: "DEFAULT" });

export const INT_CP001_FINAL_REGISTRY: readonly IntCp001FinalRegistryEntry[] = [
  {
    qlId: "INT-QL-001", cpId: "INT-CP-001", solveContract: "FIND_SIMPLE_INTEREST_FROM_PRT", taskDirection: "FORWARD",
    answerSemantic: "SIMPLE_INTEREST", topology: "DIRECT_INTEREST", baselineDifficulty: "Easy",
    sourceAdapters: [
      foundation("INT-CP001-PROT-SI-FROM-PRT", "YEARS"),
      foundation("INT-CP001-PROT-INTEREST-FOR-MONTHS", "MONTHS"),
      foundation("INT-CP001-PROT-INTEREST-FOR-DAYS", "DAYS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-002", cpId: "INT-CP-001", solveContract: "FIND_AMOUNT_FROM_PRT", taskDirection: "FORWARD",
    answerSemantic: "TOTAL_AMOUNT", topology: "DIRECT_AMOUNT", baselineDifficulty: "Easy",
    sourceAdapters: [
      foundation("INT-CP001-PROT-AMOUNT-FROM-PRT", "YEARS"),
      wave2("INT-CP001-W2-PROT-AMOUNT-FOR-MONTHS", "MONTHS"),
      wave2("INT-CP001-W2-PROT-AMOUNT-FOR-DAYS", "DAYS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-003", cpId: "INT-CP-001", solveContract: "FIND_PRINCIPAL_FROM_INTEREST", taskDirection: "INVERSE",
    answerSemantic: "PRINCIPAL", topology: "PRINCIPAL_INVERSE_FROM_INTEREST", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-PRINCIPAL-FROM-INTEREST", "YEARS"),
      wave2("INT-CP001-W2-PROT-PRINCIPAL-FROM-INTEREST-MONTHS", "MONTHS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-004", cpId: "INT-CP-001", solveContract: "FIND_PRINCIPAL_FROM_AMOUNT", taskDirection: "INVERSE",
    answerSemantic: "PRINCIPAL", topology: "PRINCIPAL_INVERSE_FROM_AMOUNT", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-PRINCIPAL-FROM-AMOUNT", "YEARS"),
      wave2("INT-CP001-W2-PROT-PRINCIPAL-FROM-AMOUNT-MONTHS", "MONTHS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-005", cpId: "INT-CP-001", solveContract: "FIND_RATE_FROM_INTEREST", taskDirection: "INVERSE",
    answerSemantic: "ANNUAL_RATE_PERCENT", topology: "RATE_INVERSE_FROM_INTEREST", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-RATE-FROM-INTEREST", "YEARS"),
      wave2("INT-CP001-W2-PROT-RATE-FROM-INTEREST-MONTHS", "MONTHS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-006", cpId: "INT-CP-001", solveContract: "FIND_RATE_FROM_AMOUNT", taskDirection: "INVERSE",
    answerSemantic: "ANNUAL_RATE_PERCENT", topology: "RATE_INVERSE_FROM_AMOUNT", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-RATE-FROM-AMOUNT", "YEARS"),
      wave2("INT-CP001-W2-PROT-RATE-FROM-AMOUNT-MONTHS", "MONTHS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-007", cpId: "INT-CP-001", solveContract: "FIND_TIME_FROM_INTEREST", taskDirection: "INVERSE",
    answerSemantic: "TIME", topology: "TIME_INVERSE_FROM_INTEREST", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-TIME-FROM-INTEREST", "YEARS"),
      wave2("INT-CP001-W2-PROT-TIME-MONTHS-FROM-INTEREST", "MONTHS", "MONTHS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-008", cpId: "INT-CP-001", solveContract: "FIND_TIME_FROM_AMOUNT", taskDirection: "INVERSE",
    answerSemantic: "TIME", topology: "TIME_INVERSE_FROM_AMOUNT", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-TIME-FROM-AMOUNT", "YEARS"),
      wave2("INT-CP001-W2-PROT-TIME-MONTHS-FROM-AMOUNT", "MONTHS", "MONTHS"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-009", cpId: "INT-CP-001", solveContract: "FIND_INTEREST_FOR_TARGET_DURATION", taskDirection: "RECONSTRUCTION",
    answerSemantic: "SIMPLE_INTEREST", topology: "SUBDURATION_PROPORTION", baselineDifficulty: "Medium",
    sourceAdapters: [
      foundation("INT-CP001-PROT-INTEREST-FOR-SUBDURATION", "DEFAULT"),
      foundation("INT-CP001-PROT-ANNUAL-INTEREST-FROM-TOTAL", "ANNUAL_SPECIAL"),
    ], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-010", cpId: "INT-CP-001", solveContract: "FIND_RATE_FROM_AMOUNT_MULTIPLE", taskDirection: "INVERSE",
    answerSemantic: "ANNUAL_RATE_PERCENT", topology: "AMOUNT_MULTIPLE_RATE_INVERSE", baselineDifficulty: "Hard",
    sourceAdapters: [foundation("INT-CP001-PROT-RATE-FROM-AMOUNT-MULTIPLE")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-011", cpId: "INT-CP-001", solveContract: "FIND_TIME_FROM_AMOUNT_MULTIPLE", taskDirection: "INVERSE",
    answerSemantic: "TIME", topology: "AMOUNT_MULTIPLE_TIME_INVERSE", baselineDifficulty: "Hard",
    sourceAdapters: [foundation("INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-012", cpId: "INT-CP-001", solveContract: "FIND_TIME_FROM_INTEREST_RATIO", taskDirection: "INVERSE",
    answerSemantic: "TIME", topology: "INTEREST_RATIO_TIME_INVERSE", baselineDifficulty: "Hard",
    sourceAdapters: [foundation("INT-CP001-PROT-TIME-FROM-INTEREST-MULTIPLE")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-013", cpId: "INT-CP-001", solveContract: "FIND_RATE_FROM_INTEREST_RATIO", taskDirection: "INVERSE",
    answerSemantic: "ANNUAL_RATE_PERCENT", topology: "INTEREST_RATIO_RATE_INVERSE", baselineDifficulty: "Hard",
    sourceAdapters: [foundation("INT-CP001-PROT-RATE-FROM-INTEREST-PRINCIPAL-RATIO")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-014", cpId: "INT-CP-001", solveContract: "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS", taskDirection: "RECONSTRUCTION",
    answerSemantic: "ANNUAL_INTEREST", topology: "TWO_TIME_AMOUNT_DIFFERENCE", baselineDifficulty: "Medium",
    sourceAdapters: [wave2("INT-CP001-W2-PROT-ANNUAL-INTEREST-FROM-TWO-AMOUNTS")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-015", cpId: "INT-CP-001", solveContract: "FIND_PRINCIPAL_FROM_TWO_AMOUNTS", taskDirection: "INVERSE",
    answerSemantic: "PRINCIPAL", topology: "TWO_TIME_AMOUNT_RECONSTRUCTION", baselineDifficulty: "Hard",
    sourceAdapters: [wave2("INT-CP001-W2-PROT-PRINCIPAL-FROM-TWO-AMOUNTS")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-016", cpId: "INT-CP-001", solveContract: "FIND_RATE_FROM_TWO_AMOUNTS", taskDirection: "INVERSE",
    answerSemantic: "ANNUAL_RATE_PERCENT", topology: "TWO_TIME_AMOUNT_RECONSTRUCTION", baselineDifficulty: "Hard",
    sourceAdapters: [wave2("INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNTS")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-017", cpId: "INT-CP-001", solveContract: "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO", taskDirection: "INVERSE",
    answerSemantic: "ANNUAL_RATE_PERCENT", topology: "TWO_TIME_AMOUNT_RATIO", baselineDifficulty: "Hard",
    sourceAdapters: [wave2("INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNT-RATIO")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-018", cpId: "INT-CP-001", solveContract: "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME", taskDirection: "FORWARD",
    answerSemantic: "AMOUNT_MULTIPLE", topology: "DIRECT_AMOUNT_RATIO", baselineDifficulty: "Medium",
    sourceAdapters: [wave2("INT-CP001-W2-PROT-AMOUNT-MULTIPLE-FROM-RATE-TIME")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-019", cpId: "INT-CP-001", solveContract: "FIND_INTEREST_RATIO_FROM_RATE_TIME", taskDirection: "FORWARD",
    answerSemantic: "INTEREST_TO_PRINCIPAL_RATIO", topology: "DIRECT_INTEREST_RATIO", baselineDifficulty: "Medium",
    sourceAdapters: [wave2("INT-CP001-W2-PROT-INTEREST-RATIO-FROM-RATE-TIME")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-020", cpId: "INT-CP-001", solveContract: "FIND_AMOUNT_AT_ANOTHER_TIME", taskDirection: "RECONSTRUCTION",
    answerSemantic: "TOTAL_AMOUNT", topology: "TEMPORAL_AMOUNT_TRANSFER", baselineDifficulty: "Medium",
    sourceAdapters: [closure("INT-CP001-CLOSE-PROT-AMOUNT-AT-OTHER-TIME")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
  {
    qlId: "INT-QL-021", cpId: "INT-CP-001", solveContract: "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO", taskDirection: "INVERSE",
    answerSemantic: "TIME", topology: "TWO_TIME_AMOUNT_RATIO_TIME_INVERSE", baselineDifficulty: "Hard",
    sourceAdapters: [closure("INT-CP001-CLOSE-PROT-TIME-FROM-TWO-AMOUNT-RATIO")], active: true, releaseId: INT_CP001_RELEASE_ID, publiclyPublishable: false, questionStudioDiscoverable: false,
  },
] as const;

const byQl = new Map<IntCp001FinalQlId, IntCp001FinalRegistryEntry>(
  INT_CP001_FINAL_REGISTRY.map((entry) => [entry.qlId, entry]),
);

export function getIntCp001FinalRegistryEntry(qlId: IntCp001FinalQlId): IntCp001FinalRegistryEntry {
  const entry = byQl.get(qlId);
  if (!entry) throw new Error(`Unknown INT-CP-001 QL: ${qlId}.`);
  return entry;
}
