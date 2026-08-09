import type { SylQlId } from "../runtime/types";

export type SylMockProfileV1 = "SSC" | "BANKING" | "PUNJAB_POLICE" | "CROSS_EXAM";

export type SylCanonicalArchetypeStatusV1 =
  | "ACTIVE_MOCK_ARCHETYPE"
  | "PRACTICE_ONLY"
  | "TRAINING_ONLY"
  | "FUTURE_REMODEL_REQUIRED";

export type SylLegacyQlDispositionV1 =
  | "CANONICAL_RETAIN"
  | "COMPATIBILITY_ALIAS"
  | "REMODEL_TO_CANONICAL"
  | "TRAINING_ONLY";

export interface SylCanonicalArchetypeV1 {
  archetypeId: string;
  status: SylCanonicalArchetypeStatusV1;
  taskShape: string;
  answerShell: string;
  premisePolicy: string;
  mockProfiles: readonly SylMockProfileV1[];
  sourceSnapshotIds: readonly string[];
  canonicalLegacyQlId: SylQlId | null;
}

export interface SylLegacyQlCompatibilityV1 {
  qlId: SylQlId;
  targetArchetypeId: string;
  disposition: SylLegacyQlDispositionV1;
  lessonEligible: boolean;
  adaptivePracticeEligible: boolean;
  legacyMockWeight: number;
  reason: string;
}

export const SYL_CANONICAL_ARCHETYPES_V1: readonly SylCanonicalArchetypeV1[] = Object.freeze([
  {
    archetypeId: "SYL-A-SSC-SINGLE-DEFINITE",
    status: "ACTIVE_MOCK_ARCHETYPE",
    taskShape: "select one definitely following conclusion",
    answerShell: "four conclusion options; one correct",
    premisePolicy: "classical SSC core forms",
    mockProfiles: ["SSC"],
    sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-SATHEE-2026"],
    canonicalLegacyQlId: "SYL-QL-001",
  },
  {
    archetypeId: "SYL-A-FOUR-OPTION-TWO-CONCLUSION",
    status: "ACTIVE_MOCK_ARCHETYPE",
    taskShape: "evaluate two conclusions",
    answerShell: "four follows-mask options",
    premisePolicy: "classical forms; target-profile scenario weighting",
    mockProfiles: ["SSC", "PUNJAB_POLICE"],
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-SSC-RPF-2026",
      "SYL-SNAPSHOT-PUNJAB-POLICE-2023-2025-V1",
    ],
    canonicalLegacyQlId: "SYL-QL-003",
  },
  {
    archetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    status: "ACTIVE_MOCK_ARCHETYPE",
    taskShape: "evaluate two conclusions including complementary either-or cases",
    answerShell: "five Banking conclusion-combination options",
    premisePolicy: "classical, ONLY and ONLY_A_FEW as weighted scenario variants",
    mockProfiles: ["BANKING"],
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
      "SYL-SNAPSHOT-BANK-NABARD-2026",
    ],
    canonicalLegacyQlId: "SYL-QL-008",
  },
  {
    archetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    status: "ACTIVE_MOCK_ARCHETYPE",
    taskShape: "evaluate three conclusions",
    answerShell: "four conclusion-combination options",
    premisePolicy: "classical or mixed scenario variants according to profile",
    mockProfiles: ["CROSS_EXAM", "PUNJAB_POLICE"],
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-CROSS-JIPMAT-2026",
      "SYL-SNAPSHOT-PUNJAB-POLICE-2023-2025-V1",
    ],
    canonicalLegacyQlId: "SYL-QL-004",
  },
  {
    archetypeId: "SYL-A-BANK-POSSIBILITY-IN-CONCLUSION-SET",
    status: "FUTURE_REMODEL_REQUIRED",
    taskShape: "evaluate a normal conclusion set containing a possibility proposition",
    answerShell: "ordinary Banking conclusion-combination options",
    premisePolicy: "Banking core or special-form scenarios",
    mockProfiles: ["BANKING"],
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
      "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
    ],
    canonicalLegacyQlId: null,
  },
  {
    archetypeId: "SYL-A-PRACTICE-NON-FOLLOWING",
    status: "PRACTICE_ONLY",
    taskShape: "select one conclusion that does not follow",
    answerShell: "four conclusion options; one selected counterexample target",
    premisePolicy: "classical core forms",
    mockProfiles: [],
    sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-RPF-2026"],
    canonicalLegacyQlId: null,
  },
  {
    archetypeId: "SYL-A-PRACTICE-MIXED-TWO-CONCLUSION",
    status: "PRACTICE_ONLY",
    taskShape: "evaluate two conclusions over mixed premise vocabulary",
    answerShell: "four follows-mask options",
    premisePolicy: "mixed and advanced forms",
    mockProfiles: [],
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
      "SYL-SNAPSHOT-BANK-NABARD-2026",
    ],
    canonicalLegacyQlId: null,
  },
  {
    archetypeId: "SYL-A-TRAINING-IMPOSSIBILITY",
    status: "TRAINING_ONLY",
    taskShape: "select an explicitly impossible conclusion",
    answerShell: "diagnostic selection",
    premisePolicy: "solver-training scenarios",
    mockProfiles: [],
    sourceSnapshotIds: [],
    canonicalLegacyQlId: null,
  },
  {
    archetypeId: "SYL-A-TRAINING-MODALITY",
    status: "TRAINING_ONLY",
    taskShape: "classify as definite, possible-not-definite or impossible",
    answerShell: "three-label diagnostic",
    premisePolicy: "core, ONLY, ONLY_A_FEW and mixed lesson variants",
    mockProfiles: [],
    sourceSnapshotIds: [],
    canonicalLegacyQlId: null,
  },
  {
    archetypeId: "SYL-A-TRAINING-PAIR-CLASSIFICATION",
    status: "TRAINING_ONLY",
    taskShape: "classify the semantic relationship between two conclusions",
    answerShell: "pair-status diagnostic",
    premisePolicy: "core training scenarios",
    mockProfiles: [],
    sourceSnapshotIds: [],
    canonicalLegacyQlId: null,
  },
]);

export const SYL_LEGACY_QL_COMPATIBILITY_V1: readonly SylLegacyQlCompatibilityV1[] = Object.freeze([
  {
    qlId: "SYL-QL-001",
    targetArchetypeId: "SYL-A-SSC-SINGLE-DEFINITE",
    disposition: "CANONICAL_RETAIN",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 1,
    reason: "Canonical SSC single-definite archetype.",
  },
  {
    qlId: "SYL-QL-002",
    targetArchetypeId: "SYL-A-PRACTICE-NON-FOLLOWING",
    disposition: "REMODEL_TO_CANONICAL",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Retain as inverse practice; do not place in mock mixes without direct source support.",
  },
  {
    qlId: "SYL-QL-003",
    targetArchetypeId: "SYL-A-FOUR-OPTION-TWO-CONCLUSION",
    disposition: "CANONICAL_RETAIN",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 1,
    reason: "Canonical four-option two-conclusion shell for SSC and provisional Punjab Police profiles.",
  },
  {
    qlId: "SYL-QL-004",
    targetArchetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    disposition: "CANONICAL_RETAIN",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 1,
    reason: "Canonical three-conclusion combination shell.",
  },
  {
    qlId: "SYL-QL-005",
    targetArchetypeId: "SYL-A-BANK-POSSIBILITY-IN-CONCLUSION-SET",
    disposition: "REMODEL_TO_CANONICAL",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Possibility semantics are authentic; the standalone selection shell must be remodeled into an ordinary Banking conclusion set.",
  },
  {
    qlId: "SYL-QL-006",
    targetArchetypeId: "SYL-A-TRAINING-IMPOSSIBILITY",
    disposition: "TRAINING_ONLY",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Useful solver diagnostic with no reviewed target-exam shell.",
  },
  {
    qlId: "SYL-QL-007",
    targetArchetypeId: "SYL-A-TRAINING-MODALITY",
    disposition: "TRAINING_ONLY",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Core modality classification is a lesson diagnostic, not a mock shell.",
  },
  {
    qlId: "SYL-QL-008",
    targetArchetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    disposition: "CANONICAL_RETAIN",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 1,
    reason: "Canonical Banking five-option and either-or shell.",
  },
  {
    qlId: "SYL-QL-009",
    targetArchetypeId: "SYL-A-TRAINING-PAIR-CLASSIFICATION",
    disposition: "TRAINING_ONLY",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Pair classification remains a training diagnostic.",
  },
  {
    qlId: "SYL-QL-010",
    targetArchetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    disposition: "COMPATIBILITY_ALIAS",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "ONLY definite-selection content remains accessible; ONLY should become a scenario variant under the canonical Banking shell.",
  },
  {
    qlId: "SYL-QL-011",
    targetArchetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    disposition: "COMPATIBILITY_ALIAS",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Duplicate task archetype separated only by the ONLY premise group.",
  },
  {
    qlId: "SYL-QL-012",
    targetArchetypeId: "SYL-A-TRAINING-MODALITY",
    disposition: "TRAINING_ONLY",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "ONLY modality classification remains training-only.",
  },
  {
    qlId: "SYL-QL-013",
    targetArchetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    disposition: "COMPATIBILITY_ALIAS",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "ONLY_A_FEW definite-selection content remains accessible; the premise form should become a Banking scenario variant.",
  },
  {
    qlId: "SYL-QL-014",
    targetArchetypeId: "SYL-A-TRAINING-MODALITY",
    disposition: "TRAINING_ONLY",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "ONLY_A_FEW modality classification remains training-only.",
  },
  {
    qlId: "SYL-QL-015",
    targetArchetypeId: "SYL-A-BANK-FIVE-OPTION-TWO-CONCLUSION",
    disposition: "COMPATIBILITY_ALIAS",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Duplicate Banking task archetype separated only by the FEW premise group.",
  },
  {
    qlId: "SYL-QL-016",
    targetArchetypeId: "SYL-A-PRACTICE-MIXED-TWO-CONCLUSION",
    disposition: "COMPATIBILITY_ALIAS",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Retain as labelled mixed practice while target-exam weighting remains unresolved.",
  },
  {
    qlId: "SYL-QL-017",
    targetArchetypeId: "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
    disposition: "COMPATIBILITY_ALIAS",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Mixed premises should be scenario variants under the canonical three-conclusion archetype, avoiding duplicate mock weight.",
  },
  {
    qlId: "SYL-QL-018",
    targetArchetypeId: "SYL-A-TRAINING-MODALITY",
    disposition: "TRAINING_ONLY",
    lessonEligible: true,
    adaptivePracticeEligible: true,
    legacyMockWeight: 0,
    reason: "Mixed modality classification remains training-only.",
  },
]);

export const SYL_QL_ARCHETYPE_CONSOLIDATION_V1 = Object.freeze({
  authorityId: "SYL_001_QL_ARCHETYPE_CONSOLIDATION_V1",
  status: "COMPATIBILITY_OVERLAY_NOT_ACTIVE",
  canonicalArchetypeCount: SYL_CANONICAL_ARCHETYPES_V1.length,
  legacyQlCount: SYL_LEGACY_QL_COMPATIBILITY_V1.length,
  migrationPrinciples: [
    "Do not delete or renumber an existing QL during closeout.",
    "A premise vocabulary family is normally a scenario variant, not a separate permanent task archetype.",
    "Compatibility aliases receive zero mock weight to avoid duplicate authority.",
    "Training diagnostics remain lesson- and practice-eligible but mock-ineligible.",
    "No overlay becomes active until deterministic profile-level generation and regressions exist.",
  ],
  activationPermitted: false,
});
