import type {
  MalCp003DiscoveryPrototypeId,
  MalCp003SourceClass,
} from "./cp003-types";

export type MalCp003LegacySourceVerdict =
  | "DIRECT_EXECUTABLE_EVIDENCE"
  | "LABEL_ONLY_SURFACE_MISMATCH"
  | "CROSS_CHECKPOINT_SURFACE_MISMATCH";

export interface MalCp003LegacyFamilyEvidence {
  familyId: string;
  declaredIntent: string;
  observedExportSurface: string;
  observedFormulaAuthority: string;
  sourceVerdict: MalCp003LegacySourceVerdict;
  normalizedContract:
    | "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES"
    | "NO_DISTINCT_CP003_CONTRACT_PROVED"
    | "CP004_SOLUTE_ADDITION_NOT_REPLACEMENT";
  evidenceNote: string;
}

/**
 * Direct observations from the checked-in Quant V2 factory and production
 * exports. A family label is not treated as proof when the generated question
 * and formula do not implement the label's claimed unknown or stage shape.
 */
export const MAL_CP003_LEGACY_FAMILY_EVIDENCE:
  readonly MalCp003LegacyFamilyEvidence[] = [
    {
      familyId: "replacement_repeated_operation",
      declaredIntent: "Repeated removal and refill; find original liquid left",
      observedExportSurface:
        "Given V, equal removal r and repeat count n, find original liquid left",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "DIRECT_EXECUTABLE_EVIDENCE",
      normalizedContract: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
      evidenceNote:
        "The label, learner stem, answer semantic and retained-fraction formula agree.",
    },
    {
      familyId: "replacement_find_original_quantity",
      declaredIntent: "Recover an original quantity from later evidence",
      observedExportSurface:
        "Same forward milk-left question as replacement_repeated_operation",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "LABEL_ONLY_SURFACE_MISMATCH",
      normalizedContract: "NO_DISTINCT_CP003_CONTRACT_PROVED",
      evidenceNote:
        "The export does not ask for an initial quantity; inverse execution must be justified as inverse closure, not direct recovery.",
    },
    {
      familyId: "replacement_find_replaced_quantity",
      declaredIntent: "Recover the quantity removed and replaced per stage",
      observedExportSurface:
        "Same forward milk-left question as replacement_repeated_operation",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "LABEL_ONLY_SURFACE_MISMATCH",
      normalizedContract: "NO_DISTINCT_CP003_CONTRACT_PROVED",
      evidenceNote:
        "The exported learner task does not make the removal quantity unknown.",
    },
    {
      familyId: "replacement_final_purity",
      declaredIntent: "Find final purity or original-component fraction",
      observedExportSurface:
        "Same forward absolute milk-left quantity question",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "LABEL_ONLY_SURFACE_MISMATCH",
      normalizedContract: "NO_DISTINCT_CP003_CONTRACT_PROVED",
      evidenceNote:
        "A fraction/percentage representation is a representation closure candidate, not direct evidence from this export.",
    },
    {
      familyId: "replacement_asymmetric_removal_fractions",
      declaredIntent: "Use different removal fractions in successive stages",
      observedExportSurface:
        "Same equal-removal repeated milk-left question",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "LABEL_ONLY_SURFACE_MISMATCH",
      normalizedContract: "NO_DISTINCT_CP003_CONTRACT_PROVED",
      evidenceNote:
        "The export contains no unequal stage quantities; the product-of-stage-retentions prototype remains a boundary construction.",
    },
    {
      familyId: "replacement_double_replacement_third_liquid",
      declaredIntent: "Use a different refill liquid at the second stage",
      observedExportSurface:
        "Same two-component equal-removal milk-left question",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "LABEL_ONLY_SURFACE_MISMATCH",
      normalizedContract: "NO_DISTINCT_CP003_CONTRACT_PROVED",
      evidenceNote:
        "The export does not contain a third liquid; the vector-state prototype is a source-prompted boundary construction.",
    },
    {
      familyId: "dilution_successive_replacement",
      declaredIntent: "Successive dilution through homogeneous replacement",
      observedExportSurface:
        "Same repeated milk-left quantity question under a dilution label",
      observedFormulaAuthority: "L = V(1 - r/V)^n",
      sourceVerdict: "LABEL_ONLY_SURFACE_MISMATCH",
      normalizedContract: "NO_DISTINCT_CP003_CONTRACT_PROVED",
      evidenceNote:
        "The label suggests concentration wording but the export does not prove a distinct concentration learner contract.",
    },
    {
      familyId: "dilution_find_number_of_operations",
      declaredIntent: "Recover a repeated-replacement operation count",
      observedExportSurface:
        "Add pure acid to a stated acid solution to reach a target concentration",
      observedFormulaAuthority: "C1V1 = C2V2",
      sourceVerdict: "CROSS_CHECKPOINT_SURFACE_MISMATCH",
      normalizedContract: "CP004_SOLUTE_ADDITION_NOT_REPLACEMENT",
      evidenceNote:
        "The checked-in export is a conserved-solute addition problem, not an operation-count replacement problem.",
    },
  ] as const;

export type MalCp003MergeSplitVerdict =
  | "PROVISIONALLY_DISTINCT"
  | "REPRESENTATION_MERGE_CANDIDATE"
  | "BOUNDARY_PENDING"
  | "DIRECT_CORE";

export interface MalCp003PrototypeEvidenceDisposition {
  prototypeId: MalCp003DiscoveryPrototypeId;
  requiredSourceClasses: readonly MalCp003SourceClass[];
  mergeSplitVerdict: MalCp003MergeSplitVerdict;
  directSourceReady: boolean;
  freezeBlocker: string | null;
}

export const MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION:
  readonly MalCp003PrototypeEvidenceDisposition[] = [
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      requiredSourceClasses: ["LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY"],
      mergeSplitVerdict: "DIRECT_CORE",
      directSourceReady: true,
      freezeBlocker: null,
    },
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
      requiredSourceClasses: [
        "LEGACY_FAMILY_LABEL_ONLY",
        "REPRESENTATION_CLOSURE",
      ],
      mergeSplitVerdict: "REPRESENTATION_MERGE_CANDIDATE",
      directSourceReady: false,
      freezeBlocker:
        "Need direct exam evidence and a merge/split decision against absolute original quantity.",
    },
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
      requiredSourceClasses: ["REPRESENTATION_CLOSURE"],
      mergeSplitVerdict: "REPRESENTATION_MERGE_CANDIDATE",
      directSourceReady: false,
      freezeBlocker:
        "Need evidence that complement-answer wording creates a distinct learner contract.",
    },
    {
      prototypeId:
        "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      requiredSourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "INVERSE_CLOSURE"],
      mergeSplitVerdict: "PROVISIONALLY_DISTINCT",
      directSourceReady: false,
      freezeBlocker:
        "The legacy label does not execute the inverse; direct exam evidence is still required.",
    },
    {
      prototypeId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      requiredSourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "INVERSE_CLOSURE"],
      mergeSplitVerdict: "PROVISIONALLY_DISTINCT",
      directSourceReady: false,
      freezeBlocker:
        "Need direct evidence for exact-root and rounding/approximation conventions.",
    },
    {
      prototypeId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      requiredSourceClasses: ["LEGACY_FAMILY_LABEL_ONLY", "INVERSE_CLOSURE"],
      mergeSplitVerdict: "PROVISIONALLY_DISTINCT",
      directSourceReady: false,
      freezeBlocker:
        "The observed legacy export belongs to solute addition; replacement-count evidence is still missing.",
    },
    {
      prototypeId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      requiredSourceClasses: [
        "LEGACY_FAMILY_LABEL_ONLY",
        "BOUNDARY_CONSTRUCTION",
      ],
      mergeSplitVerdict: "PROVISIONALLY_DISTINCT",
      directSourceReady: false,
      freezeBlocker:
        "Need direct unequal-stage questions and a decision on equal-stage specialisation versus one product contract.",
    },
    {
      prototypeId: "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      requiredSourceClasses: [
        "LEGACY_FAMILY_LABEL_ONLY",
        "BOUNDARY_CONSTRUCTION",
      ],
      mergeSplitVerdict: "PROVISIONALLY_DISTINCT",
      directSourceReady: false,
      freezeBlocker:
        "Need direct three-liquid evidence and answer-semantic coverage for one component versus the full state.",
    },
    {
      prototypeId:
        "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY",
      requiredSourceClasses: [
        "LEGACY_FAMILY_LABEL_ONLY",
        "BOUNDARY_CONSTRUCTION",
      ],
      mergeSplitVerdict: "BOUNDARY_PENDING",
      directSourceReady: false,
      freezeBlocker:
        "Resolve repeated-sampling retention ownership against CP-004 conserved-solute concentration tasks.",
    },
  ] as const;
