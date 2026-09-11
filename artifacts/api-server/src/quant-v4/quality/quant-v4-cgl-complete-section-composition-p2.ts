import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_REAL_EXAM_PROFILES,
} from "./quant-v4-real-exam-simulation-p2";

export const QUANT_V4_CGL_COMPLETE_SECTION_COMPOSITION_AUTHORITY =
  "QUANT-V4-CGL-COMPLETE-SECTION-COMPOSITION-P2" as const;

export const QUANT_V4_CGL_COMPLETE_SECTION_PAPER_IDS = Object.freeze([
  "SSC-CGL-2024-TIER-I-2024-09-09-S1",
  "SSC-CGL-2023-TIER-I-2023-07-27-S2",
  "SSC-CGL-2022-TIER-I-2022-12-01-S1",
] as const);

export type CglCompositionSlot =
  | "ARITHMETIC_CORE"
  | "GEOMETRY_MENSURATION"
  | "TRIGONOMETRY"
  | "ALGEBRA"
  | "DATA_INTERPRETATION"
  | "PROBABILITY";

const SLOT_ORDER = Object.freeze([
  "ARITHMETIC_CORE",
  "GEOMETRY_MENSURATION",
  "TRIGONOMETRY",
  "ALGEBRA",
  "DATA_INTERPRETATION",
  "PROBABILITY",
] as const satisfies readonly CglCompositionSlot[]);

const ARITHMETIC_PACKAGES = new Set([
  "AVG-001",
  "INT-001",
  "NUM-001",
  "PCT-002",
  "PNL-001",
  "RAP-001",
  "RAP-003",
  "SAP",
  "TMW-001",
  "TSD-001",
]);
const GEOMETRY_MENSURATION_PACKAGES = new Set(["GEO-001", "GEO-002", "MEN-001", "MEN-002"]);
const TRIGONOMETRY_PACKAGES = new Set(["TRG-001"]);
const ALGEBRA_PACKAGES = new Set(["ALG-001", "ALG-002"]);
const DATA_INTERPRETATION_PACKAGES = new Set(["DI-001", "DI-003", "DI-005"]);
const PROBABILITY_PACKAGES = new Set(["PRB-001", "PRB-002"]);

function blankSlotCounts(): Record<CglCompositionSlot, number> {
  return {
    ARITHMETIC_CORE: 0,
    GEOMETRY_MENSURATION: 0,
    TRIGONOMETRY: 0,
    ALGEBRA: 0,
    DATA_INTERPRETATION: 0,
    PROBABILITY: 0,
  };
}

export function cglCompositionSlotForPackage(packageId: string): CglCompositionSlot | null {
  if (ARITHMETIC_PACKAGES.has(packageId)) return "ARITHMETIC_CORE";
  if (GEOMETRY_MENSURATION_PACKAGES.has(packageId)) return "GEOMETRY_MENSURATION";
  if (TRIGONOMETRY_PACKAGES.has(packageId)) return "TRIGONOMETRY";
  if (ALGEBRA_PACKAGES.has(packageId)) return "ALGEBRA";
  if (DATA_INTERPRETATION_PACKAGES.has(packageId)) return "DATA_INTERPRETATION";
  if (PROBABILITY_PACKAGES.has(packageId)) return "PROBABILITY";
  return null;
}

function questionNumber(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

export interface CglCompleteSectionCompositionPaper {
  readonly paperId: string;
  readonly questionCount: number;
  readonly packageCount: number;
  readonly slotCounts: Readonly<Record<CglCompositionSlot, number>>;
  readonly unclassifiedPackageIds: readonly string[];
}

export interface CglCompleteSectionCompositionAudit {
  readonly authority: typeof QUANT_V4_CGL_COMPLETE_SECTION_COMPOSITION_AUTHORITY;
  readonly examId: "SSC_CGL_TIER_I";
  readonly completeSectionCount: number;
  readonly completeSectionQuestionCount: number;
  readonly papers: readonly CglCompleteSectionCompositionPaper[];
  readonly aggregateSlotCounts: Readonly<Record<CglCompositionSlot, number>>;
  readonly empiricalMeanPerSection: Readonly<Record<CglCompositionSlot, number>>;
  readonly empiricalShare: Readonly<Record<CglCompositionSlot, number>>;
  readonly provisionalPlan: Readonly<Record<CglCompositionSlot, number>>;
  readonly meanDeltaVsProvisional: Readonly<Record<CglCompositionSlot, number>>;
  readonly structuralFindings: readonly string[];
  readonly status: "PROVISIONAL_PLAN_REVIEW_REQUIRED" | "NO_STRUCTURAL_MISMATCH_DETECTED";
  readonly productionWeightPromotionAllowed: false;
  readonly blockers: readonly string[];
}

export function buildCglCompleteSectionCompositionAudit(): CglCompleteSectionCompositionAudit {
  const papers: CglCompleteSectionCompositionPaper[] = QUANT_V4_CGL_COMPLETE_SECTION_PAPER_IDS.map((paperId) => {
    const observations = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
      .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === paperId)
      .sort((left, right) => questionNumber(left.questionRef) - questionNumber(right.questionRef));
    const slotCounts = blankSlotCounts();
    const packageIds = new Set<string>();
    const unclassifiedPackageIds = new Set<string>();

    for (const observation of observations) {
      const packageId = String(observation.packageId ?? "").trim();
      packageIds.add(packageId);
      const slot = cglCompositionSlotForPackage(packageId);
      if (slot) slotCounts[slot] += 1;
      else unclassifiedPackageIds.add(packageId || "<missing>");
    }

    return Object.freeze({
      paperId,
      questionCount: observations.length,
      packageCount: packageIds.size,
      slotCounts: Object.freeze(slotCounts),
      unclassifiedPackageIds: Object.freeze([...unclassifiedPackageIds].sort()),
    });
  });

  const aggregateSlotCounts = blankSlotCounts();
  for (const paper of papers) {
    for (const slot of SLOT_ORDER) aggregateSlotCounts[slot] += paper.slotCounts[slot];
  }

  const completeSectionQuestionCount = papers.reduce((sum, paper) => sum + paper.questionCount, 0);
  const empiricalMeanPerSection = blankSlotCounts();
  const empiricalShare = blankSlotCounts();
  for (const slot of SLOT_ORDER) {
    empiricalMeanPerSection[slot] = aggregateSlotCounts[slot] / papers.length;
    empiricalShare[slot] = aggregateSlotCounts[slot] / completeSectionQuestionCount;
  }

  const provisionalPlan = blankSlotCounts();
  const cglProfile = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === "SSC_CGL_TIER_I");
  if (!cglProfile) throw new Error("SSC_CGL_TIER_I simulator profile is missing.");
  for (const slot of cglProfile.slotPlan) {
    if (slot.kind in provisionalPlan) provisionalPlan[slot.kind as CglCompositionSlot] = slot.count;
  }

  const meanDeltaVsProvisional = blankSlotCounts();
  for (const slot of SLOT_ORDER) {
    meanDeltaVsProvisional[slot] = empiricalMeanPerSection[slot] - provisionalPlan[slot];
  }

  const structuralFindings: string[] = [];
  if (papers.every((paper) => paper.slotCounts.DATA_INTERPRETATION > 0) && provisionalPlan.DATA_INTERPRETATION === 0) {
    structuralFindings.push("DATA_INTERPRETATION_PRESENT_IN_EVERY_COMPLETE_SECTION_BUT_ABSENT_FROM_PROVISIONAL_PLAN");
  }
  if (aggregateSlotCounts.PROBABILITY === 0 && provisionalPlan.PROBABILITY > 0) {
    structuralFindings.push("PROBABILITY_FORCED_BY_PROVISIONAL_PLAN_WITH_ZERO_OBSERVATIONS_IN_COMPLETE_SECTION_SAMPLE");
  }

  return Object.freeze({
    authority: QUANT_V4_CGL_COMPLETE_SECTION_COMPOSITION_AUTHORITY,
    examId: "SSC_CGL_TIER_I",
    completeSectionCount: papers.length,
    completeSectionQuestionCount,
    papers: Object.freeze(papers),
    aggregateSlotCounts: Object.freeze(aggregateSlotCounts),
    empiricalMeanPerSection: Object.freeze(empiricalMeanPerSection),
    empiricalShare: Object.freeze(empiricalShare),
    provisionalPlan: Object.freeze(provisionalPlan),
    meanDeltaVsProvisional: Object.freeze(meanDeltaVsProvisional),
    structuralFindings: Object.freeze(structuralFindings),
    status: structuralFindings.length ? "PROVISIONAL_PLAN_REVIEW_REQUIRED" : "NO_STRUCTURAL_MISMATCH_DETECTED",
    productionWeightPromotionAllowed: false,
    blockers: Object.freeze([
      "COMPLETE_SECTION_SAMPLE_POLICY_NOT_RATIFIED",
      "EMPIRICAL_COMPOSITION_REVIEW_REQUIRED",
    ]),
  });
}
