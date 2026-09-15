import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
} from "./quant-v4-whole-section-frequency-calibration-p2";
import {
  QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyStabilityProfile,
} from "./quant-v4-whole-section-frequency-stability-p2";

export const QUANT_V4_CGL_TIER1_SHADOW_FREQUENCY_GOVERNANCE_AUTHORITY =
  "QUANT-V4-CGL-TIER1-SHADOW-FREQUENCY-GOVERNANCE-P3" as const;

export type QuantV4CglTier1ShadowSlotKind =
  | "ARITHMETIC_CORE"
  | "DATA_INTERPRETATION"
  | "GEOMETRY_MENSURATION"
  | "TRIGONOMETRY"
  | "ALGEBRA"
  | "PROBABILITY";

export type QuantV4CglTier1ShadowStatus =
  | "SHADOW_HOLD"
  | "SHADOW_EMPIRICAL_CANDIDATE_LOCKED";

export interface QuantV4CglTier1ShadowSlotCount {
  readonly kind: QuantV4CglTier1ShadowSlotKind;
  readonly evidenceQuestionCount: number;
  readonly evidenceShare: number;
  readonly exactQuestionsPer25: number;
  readonly shadowQuestionCount: number;
}

export interface QuantV4CglTier1ShadowSlotDelta {
  readonly kind: QuantV4CglTier1ShadowSlotKind;
  readonly currentQuestionCount: number;
  readonly shadowQuestionCount: number;
  readonly delta: number;
}

export interface QuantV4CglTier1ShadowFrequencyGovernance {
  readonly authority: typeof QUANT_V4_CGL_TIER1_SHADOW_FREQUENCY_GOVERNANCE_AUTHORITY;
  readonly status: QuantV4CglTier1ShadowStatus;
  readonly stabilityStatus: string;
  readonly completeSectionCount: number;
  readonly completeQuestionCount: number;
  readonly packageCoverageCount: number;
  readonly unmappedPackageIds: readonly string[];
  readonly evidenceBlockers: readonly string[];
  readonly governanceLocks: readonly string[];
  readonly shadowSlotPlan: readonly QuantV4CglTier1ShadowSlotCount[];
  readonly currentVsShadow: readonly QuantV4CglTier1ShadowSlotDelta[];
  readonly maxAbsoluteSlotDelta: number;
  readonly productionPromotionAuthorized: false;
  readonly runtimeMutationAllowed: false;
  readonly runtimeProfileMutated: false;
}

const SLOT_ORDER: readonly QuantV4CglTier1ShadowSlotKind[] = Object.freeze([
  "ARITHMETIC_CORE",
  "DATA_INTERPRETATION",
  "GEOMETRY_MENSURATION",
  "TRIGONOMETRY",
  "ALGEBRA",
  "PROBABILITY",
]);

const PACKAGE_TO_SLOT: Readonly<Record<string, QuantV4CglTier1ShadowSlotKind>> = Object.freeze({
  "AVG-001": "ARITHMETIC_CORE",
  "INT-001": "ARITHMETIC_CORE",
  "MAL-001": "ARITHMETIC_CORE",
  "NUM-001": "ARITHMETIC_CORE",
  "PCT-001": "ARITHMETIC_CORE",
  "PCT-002": "ARITHMETIC_CORE",
  "PCT-005": "ARITHMETIC_CORE",
  "PCT-006": "ARITHMETIC_CORE",
  "PCT-007": "ARITHMETIC_CORE",
  "PNL-001": "ARITHMETIC_CORE",
  "RAP-001": "ARITHMETIC_CORE",
  "RAP-003": "ARITHMETIC_CORE",
  SAP: "ARITHMETIC_CORE",
  "SRI-002": "ARITHMETIC_CORE",
  "TMW-001": "ARITHMETIC_CORE",
  "TSD-001": "ARITHMETIC_CORE",
  "TSD-002": "ARITHMETIC_CORE",

  "DI-001": "DATA_INTERPRETATION",
  "DI-003": "DATA_INTERPRETATION",
  "DI-004": "DATA_INTERPRETATION",
  "DI-005": "DATA_INTERPRETATION",

  "GEO-001": "GEOMETRY_MENSURATION",
  "GEO-002": "GEOMETRY_MENSURATION",
  "MEN-001": "GEOMETRY_MENSURATION",
  "MEN-002": "GEOMETRY_MENSURATION",

  "TRG-001": "TRIGONOMETRY",

  "ALG-001": "ALGEBRA",
  "ALG-002": "ALGEBRA",
});

function normalizePackageId(observation: QuantV4PyqObservation): string {
  return String(observation.packageId ?? "").trim();
}

function currentCounts(
  currentSlotPlan: readonly Readonly<{ kind: string; count: number }>[],
): Readonly<Record<QuantV4CglTier1ShadowSlotKind, number>> {
  const counts = Object.fromEntries(SLOT_ORDER.map((kind) => [kind, 0])) as Record<QuantV4CglTier1ShadowSlotKind, number>;
  for (const slot of currentSlotPlan) {
    if ((SLOT_ORDER as readonly string[]).includes(slot.kind)) {
      counts[slot.kind as QuantV4CglTier1ShadowSlotKind] += slot.count;
    }
  }
  return Object.freeze(counts);
}

function apportionTo25(
  counts: Readonly<Record<QuantV4CglTier1ShadowSlotKind, number>>,
  total: number,
): Readonly<Record<QuantV4CglTier1ShadowSlotKind, number>> {
  if (total <= 0) {
    return Object.freeze(Object.fromEntries(SLOT_ORDER.map((kind) => [kind, 0])) as Record<QuantV4CglTier1ShadowSlotKind, number>);
  }

  const raw = SLOT_ORDER.map((kind) => {
    const exact = counts[kind] * 25 / total;
    return { kind, exact, floor: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  const apportioned = Object.fromEntries(raw.map((entry) => [entry.kind, entry.floor])) as Record<QuantV4CglTier1ShadowSlotKind, number>;
  let remaining = 25 - raw.reduce((sum, entry) => sum + entry.floor, 0);
  const ranked = [...raw].sort((left, right) =>
    right.remainder - left.remainder || SLOT_ORDER.indexOf(left.kind) - SLOT_ORDER.indexOf(right.kind),
  );
  for (const entry of ranked) {
    if (remaining <= 0) break;
    apportioned[entry.kind] += 1;
    remaining -= 1;
  }
  return Object.freeze(apportioned);
}

export function buildQuantV4CglTier1ShadowFrequencyGovernance(input: {
  readonly currentSlotPlan: readonly Readonly<{ kind: string; count: number }>[];
  readonly observations?: readonly QuantV4PyqObservation[];
}): QuantV4CglTier1ShadowFrequencyGovernance {
  const observations = input.observations ?? QUANT_V4_REGISTERED_PYQ_OBSERVATIONS;
  const stability = buildQuantV4WholeSectionFrequencyStabilityProfile({
    examId: "SSC_CGL_TIER_I",
    observations,
    sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
    wholeSectionPolicy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
    stabilityPolicy: QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
  });

  const completeObservations = stability.wholeSectionProfile.completeSectionObservations;
  const unmappedPackageIds = [...new Set(
    completeObservations
      .map(normalizePackageId)
      .filter((packageId) => !PACKAGE_TO_SLOT[packageId]),
  )].sort();

  const evidenceCounts = Object.fromEntries(SLOT_ORDER.map((kind) => [kind, 0])) as Record<QuantV4CglTier1ShadowSlotKind, number>;
  for (const observation of completeObservations) {
    const packageId = normalizePackageId(observation);
    const slotKind = PACKAGE_TO_SLOT[packageId];
    if (slotKind) evidenceCounts[slotKind] += 1;
  }

  const apportioned = apportionTo25(evidenceCounts, completeObservations.length);
  const shadowSlotPlan = Object.freeze(SLOT_ORDER
    .filter((kind) => apportioned[kind] > 0)
    .map((kind) => Object.freeze({
      kind,
      evidenceQuestionCount: evidenceCounts[kind],
      evidenceShare: completeObservations.length ? evidenceCounts[kind] / completeObservations.length : 0,
      exactQuestionsPer25: completeObservations.length ? evidenceCounts[kind] * 25 / completeObservations.length : 0,
      shadowQuestionCount: apportioned[kind],
    })));

  const liveCounts = currentCounts(input.currentSlotPlan);
  const currentVsShadow = Object.freeze(SLOT_ORDER.map((kind) => Object.freeze({
    kind,
    currentQuestionCount: liveCounts[kind],
    shadowQuestionCount: apportioned[kind],
    delta: apportioned[kind] - liveCounts[kind],
  })));
  const maxAbsoluteSlotDelta = Math.max(...currentVsShadow.map((entry) => Math.abs(entry.delta)));

  const evidenceBlockers: string[] = [];
  if (stability.status !== "STABILITY_CANDIDATE") evidenceBlockers.push("STABILITY_CANDIDATE_REQUIRED");
  if (unmappedPackageIds.length) evidenceBlockers.push("UNMAPPED_WHOLE_SECTION_PACKAGE_PRESENT");
  if (shadowSlotPlan.reduce((sum, entry) => sum + entry.shadowQuestionCount, 0) !== 25) {
    evidenceBlockers.push("SHADOW_SLOT_PLAN_NOT_25_QUESTIONS");
  }

  const status: QuantV4CglTier1ShadowStatus = evidenceBlockers.length
    ? "SHADOW_HOLD"
    : "SHADOW_EMPIRICAL_CANDIDATE_LOCKED";

  return Object.freeze({
    authority: QUANT_V4_CGL_TIER1_SHADOW_FREQUENCY_GOVERNANCE_AUTHORITY,
    status,
    stabilityStatus: stability.status,
    completeSectionCount: stability.completeSectionCount,
    completeQuestionCount: stability.completeQuestionCount,
    packageCoverageCount: stability.wholeSectionProfile.packageCoverageCount,
    unmappedPackageIds: Object.freeze(unmappedPackageIds),
    evidenceBlockers: Object.freeze(evidenceBlockers),
    governanceLocks: Object.freeze([
      "PRODUCTION_PROMOTION_NOT_AUTHORIZED",
      "RUNTIME_BLUEPRINT_MUTATION_NOT_AUTHORIZED",
      "SHADOW_REVIEW_REQUIRED_BEFORE_INTEGRATION",
    ]),
    shadowSlotPlan,
    currentVsShadow,
    maxAbsoluteSlotDelta,
    productionPromotionAuthorized: false,
    runtimeMutationAllowed: false,
    runtimeProfileMutated: false,
  });
}
