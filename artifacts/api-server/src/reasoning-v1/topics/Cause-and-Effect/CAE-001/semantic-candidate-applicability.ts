import type { CaeCandidateApplicability, CaeDistractorRole } from "./types.ts";

const applicability = (
  id: string,
  projection: CaeCandidateApplicability["applicableProjectionKinds"][number],
  target: string,
  reference: string,
  relation: CaeCandidateApplicability["eligibleRelations"][number],
  editorialPlausibility: CaeCandidateApplicability["editorialPlausibility"],
): CaeCandidateApplicability => ({
  id,
  applicableProjectionKinds: [projection],
  eligibleTargetSemanticSlots: [target],
  eligibleReferenceSemanticSlots: [reference],
  eligibleRelations: [relation],
  editorialPlausibility,
});

const lateResponse = (id: string): readonly CaeCandidateApplicability[] => [
  applicability(`${id}-pc-bridge`, "PROBABLE_CAUSE", "bridge", "cause", "CAUSE_OF_TARGET", "CLEAR_REJECT"),
  applicability(`${id}-pc-effect`, "PROBABLE_CAUSE", "effect", "bridge", "CAUSE_OF_TARGET", "CLEAR_REJECT"),
  applicability(`${id}-pc-terminal`, "PROBABLE_CAUSE", "terminal", "effect", "CAUSE_OF_TARGET", "CLEAR_REJECT"),
  applicability(`${id}-competing`, "COMPETING_EXPLANATION", "terminal", "cause", "CAUSE_OF_TARGET", "CLEAR_REJECT"),
  applicability(`${id}-missing-effect`, "MISSING_CAUSAL_LINK", "effect", "bridge", "BRIDGE_TO_TARGET", "CLEAR_REJECT"),
  applicability(`${id}-missing-terminal`, "MISSING_CAUSAL_LINK", "terminal", "effect", "BRIDGE_TO_TARGET", "CLEAR_REJECT"),
];

const EARLY_CONDITION_IDS = new Set([
  "fog-taxiway-mist", "signal-platform-display", "bridge-service-lane-collision",
  "waterlogged-rail-signal-check", "server-maintenance-window", "pump-valve-test",
  "metro-signal-fault", "vegetables-late-van", "exam-centre-security-check",
  "landslide-loose-stones", "drainage-leaves", "cold-storage-power-fluctuation",
  "roadwork-delivery-truck", "drill-projector", "cleaning-supplier-van",
  "supply-pallet-check", "ferry-ticket-check", "printer-form-check",
]);

const OUTCOME_COMPETITOR_IDS = new Set([
  "fog-baggage-vehicle", "signal-branch-points", "bridge-feeder-roadwork",
  "waterlogged-rail-bus", "server-payment-gateway", "pump-other-zone",
  "metro-concert", "vegetables-stall-cleaning", "exam-centre-parking",
  "landslide-tractor", "drainage-stalled-van", "cold-storage-forklift",
  "roadwork-school-bus-stop", "drill-sports-practice", "cleaning-bakery-power-cut",
  "supply-shelf-rearrangement", "ferry-other-crossing", "printer-visitor-register",
]);

/** Explicit applicability profiles for authored cause and bridge alternatives. */
export function causeCandidateApplicability(id: string, mechanism: CaeDistractorRole): readonly CaeCandidateApplicability[] {
  if (mechanism === "REVERSE_CAUSATION") return lateResponse(id);
  if (EARLY_CONDITION_IDS.has(id)) return [
    applicability(`${id}-pc-bridge`, "PROBABLE_CAUSE", "bridge", "cause", "CAUSE_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-pc-effect`, "PROBABLE_CAUSE", "effect", "bridge", "CAUSE_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-pc-terminal`, "PROBABLE_CAUSE", "terminal", "effect", "CAUSE_OF_TARGET", "CLEAR_REJECT"),
    applicability(`${id}-competing`, "COMPETING_EXPLANATION", "terminal", "cause", "CAUSE_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-missing-effect`, "MISSING_CAUSAL_LINK", "effect", "bridge", "BRIDGE_TO_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-missing-terminal`, "MISSING_CAUSAL_LINK", "terminal", "effect", "BRIDGE_TO_TARGET", "CLEAR_REJECT"),
  ];
  if (OUTCOME_COMPETITOR_IDS.has(id)) return [
    applicability(`${id}-pc-bridge`, "PROBABLE_CAUSE", "bridge", "cause", "CAUSE_OF_TARGET", "CLEAR_REJECT"),
    applicability(`${id}-pc-effect`, "PROBABLE_CAUSE", "effect", "bridge", "CAUSE_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-pc-terminal`, "PROBABLE_CAUSE", "terminal", "effect", "CAUSE_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-competing`, "COMPETING_EXPLANATION", "terminal", "cause", "CAUSE_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-missing-effect`, "MISSING_CAUSAL_LINK", "effect", "bridge", "BRIDGE_TO_TARGET", "CLEAR_REJECT"),
    applicability(`${id}-missing-terminal`, "MISSING_CAUSAL_LINK", "terminal", "effect", "BRIDGE_TO_TARGET", "CREDIBLE_ALTERNATIVE"),
  ];
  throw new Error(`CAE-001: no target applicability profile for candidate '${id}'.`);
}

/** Explicit effect-option applicability; all three direct-edge targets are distinguished. */
export function effectCandidateApplicability(id: string): readonly CaeCandidateApplicability[] {
  return [
    applicability(`${id}-effect-cause`, "PROBABLE_EFFECT", "cause", "bridge", "EFFECT_OF_TARGET", "CLEAR_REJECT"),
    applicability(`${id}-effect-bridge`, "PROBABLE_EFFECT", "bridge", "effect", "EFFECT_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-effect-terminal`, "PROBABLE_EFFECT", "effect", "terminal", "EFFECT_OF_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-missing-effect`, "MISSING_CAUSAL_LINK", "effect", "bridge", "BRIDGE_TO_TARGET", "CREDIBLE_ALTERNATIVE"),
    applicability(`${id}-missing-terminal`, "MISSING_CAUSAL_LINK", "terminal", "effect", "BRIDGE_TO_TARGET", "CREDIBLE_ALTERNATIVE"),
  ];
}

/** Explicit probable-effect applicability for a branching common-cause world. */
export function branchingEffectCandidateApplicability(id: string, editorialPlausibility: CaeCandidateApplicability["editorialPlausibility"]): readonly CaeCandidateApplicability[] {
  return [
    applicability(`${id}-first-effect`, "PROBABLE_EFFECT", "cause", "first-effect", "EFFECT_OF_TARGET", editorialPlausibility),
    applicability(`${id}-second-effect`, "PROBABLE_EFFECT", "cause", "second-effect", "EFFECT_OF_TARGET", editorialPlausibility),
  ];
}
