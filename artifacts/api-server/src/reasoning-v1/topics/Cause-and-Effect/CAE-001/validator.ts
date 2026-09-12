import { causalPath, nodeById, validateCaeCausalWorld } from "./causal-solver.ts";
import { CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES, materializeCae001World } from "./causal-world-authorities.ts";
import type { CaeProjectionAuthority, CaeQuestionProfile, CaeScenarioFamilyAuthority } from "./types.ts";

const CURRENT_DISCOVERY_MAP = {
  "CAE-QL-001": ["CAE-CP-001", "DIRECT_RELATIONSHIP"],
  "CAE-QL-002": ["CAE-CP-002", "COMMON_OR_INDEPENDENT"],
  "CAE-QL-003": ["CAE-CP-003", "PROBABLE_CAUSE"],
  "CAE-QL-004": ["CAE-CP-004", "PROBABLE_EFFECT"],
  "CAE-QL-005": ["CAE-CP-005", "COMPETING_EXPLANATION"],
  "CAE-QL-006": ["CAE-CP-006", "INDIRECT_CAUSAL_CHAIN"],
  "CAE-QL-007": ["CAE-CP-007", "CORRELATION_CHECK"],
  "CAE-QL-008": ["CAE-CP-008", "MULTI_EVENT_SEQUENCE"],
  "CAE-QL-009": ["CAE-CP-009", "MISSING_CAUSAL_LINK"],
} as const satisfies Readonly<Record<CaeProjectionAuthority["qlId"], readonly [CaeProjectionAuthority["checkpointId"], CaeProjectionAuthority["kind"]]>>;

function validateFamily(family: CaeScenarioFamilyAuthority, issues: string[]) {
  if (family.variants.length < 3) issues.push(`${family.id}: fewer than three composable scenario variants are available.`);
  for (const variant of family.variants) {
    const slots = new Set<string>();
    for (const node of variant.nodes) {
      if (slots.has(node.semanticSlot)) issues.push(`${family.id}/${variant.id}: duplicate semantic slot '${node.semanticSlot}'.`);
      slots.add(node.semanticSlot);
      if (!node.text["en-IN"].trim() || !node.text["hi-IN"].trim() || !node.text["pa-IN"].trim()) issues.push(`${family.id}/${variant.id}/${node.semanticSlot}: incomplete locale text.`);
      for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
        if (variant.backdrop[locale].includes(node.text[locale])) issues.push(`${family.id}/${variant.id}/${locale}: canonical event leaks into neutral backdrop.`);
      }
    }
    if (variant.competingCandidates.length < 3) issues.push(`${family.id}/${variant.id}: fewer than three scenario-local distractors.`);
    const candidateText = new Set<string>();
    for (const candidate of variant.competingCandidates) {
      for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
        const key = `${locale}:${candidate.text[locale]}`;
        if (candidateText.has(key)) issues.push(`${family.id}/${variant.id}: duplicate distractor text in ${locale}.`);
        candidateText.add(key);
        if (!candidate.text[locale].trim()) issues.push(`${family.id}/${variant.id}/${candidate.id}: incomplete candidate locale text.`);
      }
      if (candidate.timingFit === "ALIGNED" && candidate.scopeFit === "ALIGNED" && candidate.magnitudeFit === "ALIGNED" && candidate.causalDistance !== null) {
        issues.push(`${family.id}/${variant.id}/${candidate.id}: distractor is plausibly indistinguishable from the graph-supported answer.`);
      }
    }
    for (const edge of variant.edgeBindings) {
      if (!slots.has(edge.from) || !slots.has(edge.to)) issues.push(`${family.id}/${variant.id}: edge '${edge.from}->${edge.to}' has an unknown semantic slot.`);
    }
    issues.push(...validateCaeCausalWorld(materializeCae001World(family, variant)));
  }
}

function validatePlan(plan: CaeProjectionAuthority, issues: string[]) {
  const expected = CURRENT_DISCOVERY_MAP[plan.qlId];
  if (plan.checkpointId !== expected[0] || plan.kind !== expected[1]) issues.push(`${plan.id}: current discovery allocation does not match its checkpoint owner.`);
  if (plan.qlAllocationStatus !== "PROVISIONAL_PENDING_SOURCE_SATURATION") issues.push(`${plan.id}: QL allocation must remain provisional until source saturation.`);
  if (plan.compatibleFamilyIds.length < 2) issues.push(`${plan.id}: fewer than two scenario families makes the plan too narrow.`);
  for (const familyId of plan.compatibleFamilyIds) {
    const family = CAE_001_SCENARIO_FAMILIES.find((entry) => entry.id === familyId);
    if (!family) {
      issues.push(`${plan.id}: unknown compatible family '${familyId}'.`);
      continue;
    }
    const allowedKinds = family.allowedProjectionKinds as readonly CaeProjectionAuthority["kind"][];
    const allowedProfiles = family.allowedQuestionProfiles as readonly CaeQuestionProfile[];
    if (!allowedKinds.includes(plan.kind)) issues.push(`${plan.id}: ${family.id} does not allow ${plan.kind}.`);
    if (!plan.examProfiles.every((profile) => allowedProfiles.includes(profile))) issues.push(`${plan.id}: ${family.id} does not allow all declared exam profiles.`);
  }
}

/** Validates authority data without treating it as a frozen question corpus. */
export function validateCaeEngineAuthorities(
  families: readonly CaeScenarioFamilyAuthority[] = CAE_001_SCENARIO_FAMILIES,
  plans: readonly CaeProjectionAuthority[] = CAE_001_PROJECTION_AUTHORITIES,
): readonly string[] {
  const issues: string[] = [];
  const familyIds = new Set<string>();
  for (const family of families) {
    if (familyIds.has(family.id)) issues.push(`${family.id}: duplicate scenario-family id.`);
    familyIds.add(family.id);
    validateFamily(family, issues);
  }
  const planIds = new Set<string>();
  const qlIds = new Set<string>();
  for (const plan of plans) {
    if (planIds.has(plan.id)) issues.push(`${plan.id}: duplicate generation-plan id.`);
    if (qlIds.has(plan.qlId)) issues.push(`${plan.qlId}: duplicate current discovery plan.`);
    planIds.add(plan.id);
    qlIds.add(plan.qlId);
    validatePlan(plan, issues);
  }
  for (const qlId of Object.keys(CURRENT_DISCOVERY_MAP)) if (!qlIds.has(qlId)) issues.push(`${qlId}: no current discovery plan.`);
  return issues;
}

/** A second guard for any generated state used in review, including hidden-link and common-cause overlap. */
export function validateGeneratedCaeStructure(world: ReturnType<typeof materializeCae001World>, visibleNodeIds: readonly string[]): readonly string[] {
  const issues: string[] = [];
  for (const visibleNodeId of visibleNodeIds) {
    try { nodeById(world, visibleNodeId); } catch (error) { issues.push(error instanceof Error ? error.message : String(error)); }
  }
  if (visibleNodeIds.length === 2) {
    const [first, second] = visibleNodeIds;
    const forward = causalPath(world, first!, second!);
    const reverse = causalPath(world, second!, first!);
    if (forward && reverse) issues.push(`${world.id}: learner-visible pair participates in a causal cycle.`);
  }
  return issues;
}
