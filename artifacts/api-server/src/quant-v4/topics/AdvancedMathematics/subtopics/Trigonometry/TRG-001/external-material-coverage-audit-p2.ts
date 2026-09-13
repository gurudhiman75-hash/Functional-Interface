export type TrgExternalMaterialCoverageStatus =
  | "DIRECTLY_COVERED"
  | "COVERED_WITH_VARIATION"
  | "MISSING_EXAM_RELEVANT"
  | "TRG_002_APPLICATION"
  | "OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE"
  | "NEEDS_RUNTIME_PROOF";

export type TrgExternalMaterialSourceClass =
  | "SSC_GUIDE"
  | "SSC_SOLVED_PAPER"
  | "BOUNDARY_STRETCH";

export type TrgExternalMaterialObservation = Readonly<{
  id: string;
  sourceClass: TrgExternalMaterialSourceClass;
  sourceName: string;
  sourceLocator: string;
  archetype: string;
  targetPackage: "TRG-001" | "TRG-002";
  coverageStatus: TrgExternalMaterialCoverageStatus;
  runtimeHome: string | null;
  remediationDecision: string;
  copiedSourceText: false;
}>;

export const TRG_001_EXTERNAL_MATERIAL_AUDIT_P2 = Object.freeze({
  version: "TRG001_EXTERNAL_MATERIAL_COVERAGE_AUDIT_P2" as const,
  productionAuthority: false as const,
  sourceTextReusable: false as const,
  freezeGate: Object.freeze({
    unresolvedMissingExamRelevantAllowed: false as const,
    variationRequiresRuntimeProofOrExplicitAcceptance: true as const,
    trg002MustRemainSeparate: true as const,
    proofAndOffProfileExcludedFromCompletenessDenominator: true as const,
  }),
});

export const TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2: readonly TrgExternalMaterialObservation[] = Object.freeze([
  {
    id: "TRG-EXT-P2-001",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Trigonometry and Its Applications, pp. 400+",
    archetype: "Basic side-ratio definitions and direct sin/cos/tan/cot/sec/cosec evaluation",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP1",
    remediationDecision: "Retain as foundational external regression family.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-002",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Trigonometry pp. 400-401",
    archetype: "Standard-angle tables, reciprocal/Pythagorean identities and complementary-angle transforms",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP2/CP3/CP4",
    remediationDecision: "Use as recurring coverage sanity check.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-003",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Illustrations after complementary-angle section",
    archetype: "Given standard trig values for two acute angles, evaluate a compound-angle expression",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP6",
    remediationDecision: "No new QL required.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-004",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Illustration: acute sin/cos equality",
    archetype: "Acute-angle equation reducing sin theta = cos theta to theta = 45 degrees",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP3/controlled angle equation",
    remediationDecision: "No new QL required.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-005",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Illustration: cubic trig simplification",
    archetype: "Factor a sum/difference of trig cubes and reduce with sin^2+cos^2=1",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 QL-143 P2 remediation",
    remediationDecision: "Keep QL-143 remediation; regression-anchor this family.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-006",
    sourceClass: "SSC_SOLVED_PAPER",
    sourceName: "30 Yearwise SSC CGL Solved Paper (English) 2023.pdf",
    sourceLocator: "Solved-paper item using sec A + tan A = constant",
    archetype: "Conjugate reconstruction from sec+tan to sec-tan, then recover a target trig value",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP5 conjugate family",
    remediationDecision: "Use as exact SSC regression anchor.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-007",
    sourceClass: "SSC_SOLVED_PAPER",
    sourceName: "30 Yearwise SSC CGL Solved Paper (English) 2022.pdf",
    sourceLocator: "Solved-paper trigonometry item near Q72",
    archetype: "Composite identity tan^2+cot^2-sec^2*cosec^2",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP4/CP6 identity composite",
    remediationDecision: "Use as regression anchor.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-008",
    sourceClass: "SSC_SOLVED_PAPER",
    sourceName: "30 Yearwise SSC CGL Solved Paper (English) 2024.pdf",
    sourceLocator: "Solved-paper item near Q72",
    archetype: "Given cosec ratio, evaluate a product combining sec^2-1, cot^2 and 1+cot^2",
    targetPackage: "TRG-001",
    coverageStatus: "DIRECTLY_COVERED",
    runtimeHome: "TRG-001 CP5/CP6 reciprocal identity composite",
    remediationDecision: "Use as regression anchor for derived-ratio composition.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-009",
    sourceClass: "SSC_SOLVED_PAPER",
    sourceName: "30 Yearwise SSC CGL Solved Paper (English) 2024.pdf",
    sourceLocator: "Solved-paper item near Q68",
    archetype: "Long complementary-angle square expression simplified through cofunction and Pythagorean identities",
    targetPackage: "TRG-001",
    coverageStatus: "COVERED_WITH_VARIATION",
    runtimeHome: "TRG-001 CP3/CP6",
    remediationDecision: "Generate a parity sample before refreeze; add no new QL unless runtime cannot express the construction.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-010",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Practice solution: tan x + cot x relation",
    archetype: "Given tan x+cot x, derive a sec^2/cosec^2 expression",
    targetPackage: "TRG-001",
    coverageStatus: "NEEDS_RUNTIME_PROOF",
    runtimeHome: "TRG-001 CP5/CP6 candidate home",
    remediationDecision: "Require generated runtime proof before calling directly covered.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-011",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Level-II/high-power solutions",
    archetype: "Higher even-power trig identities such as sin^6/cos^6 composite simplification",
    targetPackage: "TRG-001",
    coverageStatus: "COVERED_WITH_VARIATION",
    runtimeHome: "TRG-001 CP6",
    remediationDecision: "Sample existing high-power roles; only remediate if construction depth is not representable.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-012",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Angle of elevation/depression and inaccessible tower section",
    archetype: "Height/distance application using one or more observation points",
    targetPackage: "TRG-002",
    coverageStatus: "TRG_002_APPLICATION",
    runtimeHome: "TRG-002 Heights & Distances",
    remediationDecision: "Exclude from TRG-001 completeness denominator; audit under TRG-002.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-013",
    sourceClass: "SSC_GUIDE",
    sourceName: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
    sourceLocator: "Textbook-style show-that illustrations",
    archetype: "Proof/show-that identity rather than objective exam question",
    targetPackage: "TRG-001",
    coverageStatus: "OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE",
    runtimeHome: null,
    remediationDecision: "Do not count as a missing MCQ family.",
    copiedSourceText: false,
  },
  {
    id: "TRG-EXT-P2-014",
    sourceClass: "BOUNDARY_STRETCH",
    sourceName: "Arun Sharma - How to Prepare for Quantitative Aptitude for the CAT-McGraw Hill Education (2018).pdf",
    sourceLocator: "Trigonometry-adjacent stretch corpus",
    archetype: "CAT-level or multi-concept constructions beyond recurring SSC profile",
    targetPackage: "TRG-001",
    coverageStatus: "OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE",
    runtimeHome: null,
    remediationDecision: "Use only as boundary evidence unless an SSC/Punjab/Banking recurrence is independently demonstrated.",
    copiedSourceText: false,
  },
]);

export function unresolvedTrg001ExternalMaterialObservationsP2() {
  return TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2.filter((observation) =>
    observation.targetPackage === "TRG-001" &&
    (observation.coverageStatus === "MISSING_EXAM_RELEVANT" || observation.coverageStatus === "NEEDS_RUNTIME_PROOF")
  );
}

export function trg001ExternalMaterialCoverageSummaryP2() {
  const counts: Record<TrgExternalMaterialCoverageStatus, number> = {
    DIRECTLY_COVERED: 0,
    COVERED_WITH_VARIATION: 0,
    MISSING_EXAM_RELEVANT: 0,
    TRG_002_APPLICATION: 0,
    OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE: 0,
    NEEDS_RUNTIME_PROOF: 0,
  };

  for (const observation of TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2) {
    counts[observation.coverageStatus] += 1;
  }

  return Object.freeze({
    total: TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2.length,
    counts: Object.freeze(counts),
    unresolvedTrg001: unresolvedTrg001ExternalMaterialObservationsP2().length,
  });
}
