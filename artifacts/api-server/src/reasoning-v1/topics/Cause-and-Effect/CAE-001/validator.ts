import { causalPath, nodeById, validateCaeCausalWorld } from "./causal-solver.ts";
import { CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES, materializeCae001World } from "./causal-world-authorities.ts";
import type { CaeCandidateComparison, CaeMagnitude, CaeProjectionAuthority, CaeQuestionProfile, CaeScenarioFamilyAuthority, GeneratedCaeQuestion } from "./types.ts";

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

const GENERIC_DISTRACTOR_WORDING = /minor disturbance|one small part of the area|reported outcome|different local service|generic event|some unrelated event/i;
const MAGNITUDE_RANK: Readonly<Record<CaeMagnitude, number>> = { LOW: 0, MODERATE: 1, HIGH: 2 };

function validateDistractorRule(rule: CaeScenarioFamilyAuthority["distractorRules"][number], familyId: string, issues: string[]) {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    if (!rule.text[locale].trim()) issues.push(`${familyId}/${rule.id}/${locale}: incomplete scenario-local distractor text.`);
    if (GENERIC_DISTRACTOR_WORDING.test(rule.text[locale])) issues.push(`${familyId}/${rule.id}/${locale}: generic or meta distractor wording is not allowed.`);
  }
  if (rule.mechanism === "WEAK_CAUSE" && rule.magnitudeShift >= 0 && rule.severityShift >= 0) issues.push(`${familyId}/${rule.id}: weak cause does not reduce magnitude or severity.`);
  if (rule.mechanism === "WRONG_SCOPE" && rule.scopeShift === 0) issues.push(`${familyId}/${rule.id}: wrong-scope rule does not alter scope.`);
  if (rule.mechanism === "MAGNITUDE_MISMATCH" && rule.magnitudeShift === 0 && rule.severityShift === 0) issues.push(`${familyId}/${rule.id}: magnitude-mismatch rule does not alter magnitude or severity.`);
  if (rule.mechanism === "REVERSE_CAUSATION" && (rule.timingAnchor !== "TARGET" || rule.temporalOffset <= 0)) issues.push(`${familyId}/${rule.id}: reverse-causation rule must occur after the observed target.`);
  if (rule.mechanism === "TEMPORAL_VIOLATION" && (rule.timingAnchor !== "REFERENCE" || rule.temporalOffset >= 0)) issues.push(`${familyId}/${rule.id}: temporal-violation rule must occur before the graph-supported event.`);
  if (rule.mechanism === "INDIRECTNESS_CONFUSION" && (rule.causalDistance ?? 0) <= 1) issues.push(`${familyId}/${rule.id}: indirectness rule must be more than one causal step away.`);
}

function validateFamily(family: CaeScenarioFamilyAuthority, issues: string[]) {
  if (family.variants.length < 3) issues.push(`${family.id}: fewer than three composable scenario variants are available.`);
  if (family.distractorRules.length < 6) issues.push(`${family.id}: richer scenario-local distractor pool requires at least six rules.`);
  const mechanisms = new Set(family.distractorRules.map((rule) => rule.mechanism));
  for (const required of ["WEAK_CAUSE", "WRONG_SCOPE", "MAGNITUDE_MISMATCH", "REVERSE_CAUSATION", "TEMPORAL_VIOLATION", "INDIRECTNESS_CONFUSION"] as const) {
    if (!mechanisms.has(required)) issues.push(`${family.id}: missing ${required} distractor mechanism.`);
  }
  for (const rule of family.distractorRules) validateDistractorRule(rule, family.id, issues);
  for (const variant of family.variants) {
    const slots = new Set<string>();
    for (const node of variant.nodes) {
      if (slots.has(node.semanticSlot)) issues.push(`${family.id}/${variant.id}: duplicate semantic slot '${node.semanticSlot}'.`);
      slots.add(node.semanticSlot);
      if (!node.text["en-IN"].trim() || !node.text["hi-IN"].trim() || !node.text["pa-IN"].trim()) issues.push(`${family.id}/${variant.id}/${node.semanticSlot}: incomplete locale text.`);
      if ((node.temporalOrder === 1 && node.timeBand !== "TRIGGER") || (node.temporalOrder === 2 && node.timeBand !== "IMMEDIATE_RESPONSE") || (node.temporalOrder === 3 && node.timeBand !== "SAME_SHIFT") || (node.temporalOrder >= 4 && node.timeBand !== "LATER_OUTCOME")) issues.push(`${family.id}/${variant.id}/${node.semanticSlot}: time band does not agree with its temporal order.`);
      for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
        if (variant.backdrop[locale].includes(node.text[locale])) issues.push(`${family.id}/${variant.id}/${locale}: canonical event leaks into neutral backdrop.`);
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
  const canonicalNodes = families.flatMap((family) => family.variants.flatMap((variant) => variant.nodes));
  if (new Set(canonicalNodes.map((node) => node.scope)).size < 4) issues.push("CAE-001: canonical scope values are too uniform to support target-relative validation.");
  if (new Set(canonicalNodes.map((node) => node.magnitude)).size < 3) issues.push("CAE-001: canonical magnitude values are too uniform to support target-relative validation.");
  if (new Set(canonicalNodes.map((node) => node.severity)).size < 3) issues.push("CAE-001: canonical severity values are too uniform to support target-relative validation.");
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

function validateCandidateComparison(candidate: CaeCandidateComparison): string | null {
  const magnitudeGap = Math.abs(MAGNITUDE_RANK[candidate.candidateMagnitude] - MAGNITUDE_RANK[candidate.targetMagnitude]);
  const severityGap = Math.abs(MAGNITUDE_RANK[candidate.candidateSeverity] - MAGNITUDE_RANK[candidate.targetSeverity]);
  if (candidate.magnitudeGap !== magnitudeGap || candidate.severityGap !== severityGap) return `${candidate.candidateId}: target-relative magnitude metadata is inconsistent.`;
  const expectsEffect = candidate.expectedRelation === "EFFECT_OF_TARGET";
  if (candidate.mechanism === "REVERSE_CAUSATION" && (expectsEffect ? candidate.candidateTemporalOrder >= candidate.targetTemporalOrder : candidate.candidateTemporalOrder <= candidate.targetTemporalOrder)) return `${candidate.candidateId}: reverse-causation candidate has the wrong temporal direction.`;
  if (candidate.mechanism === "TEMPORAL_VIOLATION" && (expectsEffect ? candidate.candidateTemporalOrder <= candidate.referenceTemporalOrder : candidate.candidateTemporalOrder >= candidate.referenceTemporalOrder)) return `${candidate.candidateId}: temporal-violation candidate has the wrong distance from the graph-supported event.`;
  if (candidate.mechanism === "WEAK_CAUSE" && MAGNITUDE_RANK[candidate.candidateMagnitude] >= MAGNITUDE_RANK[candidate.targetMagnitude] && MAGNITUDE_RANK[candidate.candidateSeverity] >= MAGNITUDE_RANK[candidate.targetSeverity]) return `${candidate.candidateId}: weak candidate can still explain the target magnitude and severity.`;
  if (candidate.mechanism === "WRONG_SCOPE" && candidate.scopeGap === 0) return `${candidate.candidateId}: wrong-scope candidate matches the target scope.`;
  if (candidate.mechanism === "MAGNITUDE_MISMATCH" && candidate.magnitudeGap === 0 && candidate.severityGap === 0) return `${candidate.candidateId}: magnitude-mismatch candidate matches the target.`;
  if (candidate.mechanism === "INDIRECTNESS_CONFUSION" && (candidate.causalDistance ?? 0) <= 1) return `${candidate.candidateId}: indirectness candidate is not distant.`;
  if (!candidate.rejectionReason.trim()) return `${candidate.candidateId}: missing target-relative rejection reason.`;
  return null;
}

/** Verifies rendered review items, including target-relative distractor evidence. */
export function validateGeneratedCaeQuestion(question: GeneratedCaeQuestion): readonly string[] {
  const issues: string[] = [];
  if (question.options.length !== 4 && question.options.length !== 5) issues.push(`${question.semanticInstanceId}: invalid option count.`);
  if (question.options.filter((_, index) => index === question.correctIndex).length !== 1) issues.push(`${question.semanticInstanceId}: exactly one answer must be marked.`);
  for (const option of question.options) if (GENERIC_DISTRACTOR_WORDING.test(option)) issues.push(`${question.semanticInstanceId}: generic/meta distractor wording reached a rendered item.`);
  for (const option of question.options) if (/\{(?:target|anchor|relativeTime|reverseRelation|temporalRelation|indirectDistance)\}/u.test(option)) issues.push(`${question.semanticInstanceId}: an unresolved distractor rendering token reached a rendered item.`);
  for (const candidate of question.candidateComparisons) {
    const issue = validateCandidateComparison(candidate);
    if (issue) issues.push(`${question.semanticInstanceId}: ${issue}`);
  }
  if (question.visibleContext.backdrop && question.stem.includes(question.visibleContext.backdrop) && question.stem.includes(question.options[question.correctIndex]!)) issues.push(`${question.semanticInstanceId}: answer/context leakage.`);
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
