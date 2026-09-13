import { causalPath, nodeById, validateCaeCausalWorld } from "./causal-solver.ts";
import { CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES, materializeCae001World } from "./causal-world-authorities.ts";
import type { CaeCandidateComparison, CaeMagnitude, CaeProjectionAuthority, CaeQuestionProfile, CaeScenarioFamilyAuthority, CaeScope, GeneratedCaeQuestion } from "./types.ts";

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

// This is a regression tripwire for the retired template corpus, not the
// mechanism used to establish editorial quality.  Candidate construction and
// the semantic authority checks below are the primary safeguards.
const RETIRED_TEMPLATE_ARTIFACT = /attendance count at another|separate condition at the|follow-up notice was issued|short queue formed at one/i;
const MAGNITUDE_RANK: Readonly<Record<CaeMagnitude, number>> = { LOW: 0, MODERATE: 1, HIGH: 2 };
const SCOPE_RANK: Readonly<Record<CaeScope, number>> = { PERSON: 0, SITE: 1, LOCAL: 2, CITY: 3, REGIONAL: 4 };

function validateSemanticCandidate(candidate: CaeScenarioFamilyAuthority["variants"][number]["semanticCandidateEvents"][number], familyId: string, variantId: string, issues: string[]) {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const value = candidate.text[locale].trim();
    if (!value) issues.push(`${familyId}/${variantId}/${candidate.id}/${locale}: incomplete authored event.`);
    if (/\{[^}]+\}/u.test(value)) issues.push(`${familyId}/${variantId}/${candidate.id}/${locale}: candidate must be a standalone event, not a substitution template.`);
    if (RETIRED_TEMPLATE_ARTIFACT.test(value)) issues.push(`${familyId}/${variantId}/${candidate.id}/${locale}: retired template wording reached a semantic authority.`);
  }
  if (candidate.editorialRationale.trim().length < 24) issues.push(`${familyId}/${variantId}/${candidate.id}: missing editorial rationale for this real-world event.`);
  if (candidate.applicability.length === 0) issues.push(`${familyId}/${variantId}/${candidate.id}: candidate has no target/reference applicability.`);
  const applicabilityIds = new Set<string>();
  for (const rule of candidate.applicability) {
    if (applicabilityIds.has(rule.id)) issues.push(`${familyId}/${variantId}/${candidate.id}: duplicate applicability '${rule.id}'.`);
    applicabilityIds.add(rule.id);
    if (rule.applicableProjectionKinds.length === 0 || rule.eligibleTargetSemanticSlots.length === 0 || rule.eligibleReferenceSemanticSlots.length === 0 || rule.eligibleRelations.length === 0) issues.push(`${familyId}/${variantId}/${candidate.id}/${rule.id}: applicability must explicitly name projection, target, reference, and relation.`);
    if (rule.eligibleTargetSemanticSlots.some((slot) => slot === "*" || slot === "ANY") || rule.eligibleReferenceSemanticSlots.some((slot) => slot === "*" || slot === "ANY")) issues.push(`${familyId}/${variantId}/${candidate.id}/${rule.id}: generic slot membership cannot establish candidate credibility.`);
  }
  if (candidate.mechanism === "INDIRECTNESS_CONFUSION" && (candidate.causalDistance ?? 0) <= 1) issues.push(`${familyId}/${variantId}/${candidate.id}: indirect event must be more than one causal step away.`);
}

function validateFamily(family: CaeScenarioFamilyAuthority, issues: string[]) {
  if (family.variants.length < 3) issues.push(`${family.id}: fewer than three composable scenario variants are available.`);
  const needsCandidateAuthorities = family.allowedProjectionKinds.some((kind) => ["PROBABLE_CAUSE", "COMPETING_EXPLANATION", "MISSING_CAUSAL_LINK"].includes(kind));
  for (const variant of family.variants) {
    const candidateIds = new Set<string>();
    const credibleCandidates = variant.semanticCandidateEvents.filter((candidate) => candidate.applicability.some((rule) => rule.editorialPlausibility === "CREDIBLE_ALTERNATIVE"));
    if (needsCandidateAuthorities && variant.semanticCandidateEvents.length < 2) issues.push(`${family.id}/${variant.id}: needs two scenario-authored, initially credible alternatives.`);
    if (family.allowedProjectionKinds.includes("MISSING_CAUSAL_LINK") && variant.semanticBridgeCandidateEvents.length < 1) issues.push(`${family.id}/${variant.id}: missing-link generation needs a target-specific bridge alternative.`);
    if (family.allowedProjectionKinds.includes("PROBABLE_EFFECT") && variant.semanticEffectCandidateEvents.length < 2) issues.push(`${family.id}/${variant.id}: probable-effect generation needs two authored effect alternatives.`);
    if (family.allowedProjectionKinds.includes("COMPETING_EXPLANATION") && (variant.semanticCandidateEvents.length < 3 || credibleCandidates.length < 2)) issues.push(`${family.id}/${variant.id}: competing-explanation generation needs two credible alternatives and one additional ruled-out event.`);
    for (const candidate of variant.semanticCandidateEvents) {
      if (candidateIds.has(candidate.id)) issues.push(`${family.id}/${variant.id}: duplicate semantic candidate id '${candidate.id}'.`);
      candidateIds.add(candidate.id);
      validateSemanticCandidate(candidate, family.id, variant.id, issues);
    }
    for (const candidate of variant.semanticEffectCandidateEvents) {
      if (candidateIds.has(candidate.id)) issues.push(`${family.id}/${variant.id}: duplicate semantic candidate id '${candidate.id}'.`);
      candidateIds.add(candidate.id);
      validateSemanticCandidate(candidate, family.id, variant.id, issues);
    }
    for (const candidate of variant.semanticBridgeCandidateEvents) {
      if (candidateIds.has(candidate.id)) issues.push(`${family.id}/${variant.id}: duplicate semantic candidate id '${candidate.id}'.`);
      candidateIds.add(candidate.id);
      validateSemanticCandidate(candidate, family.id, variant.id, issues);
    }
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
  if (candidate.source !== "CANONICAL_WORLD" && candidate.source !== "VARIANT_AUTHORED") return `${candidate.candidateId}: unknown semantic candidate source.`;
  if (candidate.editorialPlausibility !== "CREDIBLE_ALTERNATIVE" && candidate.editorialPlausibility !== "CLEAR_REJECT") return `${candidate.candidateId}: editorial plausibility was not classified.`;
  if (candidate.applicability.id !== candidate.applicabilityId || candidate.applicability.editorialPlausibility !== candidate.editorialPlausibility) return `${candidate.candidateId}: applicability status does not match the selected candidate.`;
  if (!candidate.applicability.applicableProjectionKinds.includes(candidate.projectionKind) || !candidate.applicability.eligibleTargetSemanticSlots.includes(candidate.targetSemanticSlot) || !candidate.applicability.eligibleReferenceSemanticSlots.includes(candidate.referenceSemanticSlot) || !candidate.applicability.eligibleRelations.includes(candidate.expectedRelation)) return `${candidate.candidateId}: selected outside its explicit target/reference applicability.`;
  const scopeGap = Math.abs(SCOPE_RANK[candidate.candidateScope] - SCOPE_RANK[candidate.targetScope]);
  const referenceScopeGap = Math.abs(SCOPE_RANK[candidate.candidateScope] - SCOPE_RANK[candidate.referenceScope]);
  const magnitudeGap = Math.abs(MAGNITUDE_RANK[candidate.candidateMagnitude] - MAGNITUDE_RANK[candidate.targetMagnitude]);
  const referenceMagnitudeGap = Math.abs(MAGNITUDE_RANK[candidate.candidateMagnitude] - MAGNITUDE_RANK[candidate.referenceMagnitude]);
  const severityGap = Math.abs(MAGNITUDE_RANK[candidate.candidateSeverity] - MAGNITUDE_RANK[candidate.targetSeverity]);
  const referenceSeverityGap = Math.abs(MAGNITUDE_RANK[candidate.candidateSeverity] - MAGNITUDE_RANK[candidate.referenceSeverity]);
  if (candidate.scopeGap !== scopeGap || candidate.referenceScopeGap !== referenceScopeGap || candidate.magnitudeGap !== magnitudeGap || candidate.referenceMagnitudeGap !== referenceMagnitudeGap || candidate.severityGap !== severityGap || candidate.referenceSeverityGap !== referenceSeverityGap) return `${candidate.candidateId}: target/reference-relative scope or scale metadata is inconsistent.`;
  const expectsEffect = candidate.expectedRelation === "EFFECT_OF_TARGET";
  if (candidate.mechanism === "REVERSE_CAUSATION" && (expectsEffect ? candidate.candidateTemporalOrder >= candidate.targetTemporalOrder : candidate.candidateTemporalOrder <= candidate.targetTemporalOrder)) return `${candidate.candidateId}: reverse-causation candidate has the wrong temporal direction.`;
  if (candidate.mechanism === "TEMPORAL_VIOLATION" && (expectsEffect ? candidate.candidateTemporalOrder <= candidate.referenceTemporalOrder : candidate.candidateTemporalOrder >= candidate.referenceTemporalOrder)) return `${candidate.candidateId}: temporal-violation candidate has the wrong distance from the graph-supported event.`;
  if (candidate.mechanism === "WEAK_CAUSE" && MAGNITUDE_RANK[candidate.candidateMagnitude] >= MAGNITUDE_RANK[candidate.targetMagnitude] && MAGNITUDE_RANK[candidate.candidateSeverity] >= MAGNITUDE_RANK[candidate.targetSeverity] && MAGNITUDE_RANK[candidate.candidateMagnitude] >= MAGNITUDE_RANK[candidate.referenceMagnitude] && MAGNITUDE_RANK[candidate.candidateSeverity] >= MAGNITUDE_RANK[candidate.referenceSeverity]) return `${candidate.candidateId}: weak candidate can still explain the target and graph-supported cause/effect scale.`;
  if (candidate.mechanism === "WRONG_SCOPE" && candidate.scopeGap === 0 && candidate.referenceScopeGap === 0 && candidate.magnitudeGap === 0 && candidate.referenceMagnitudeGap === 0 && candidate.severityGap === 0 && candidate.referenceSeverityGap === 0) return `${candidate.candidateId}: wrong-scope candidate has no supporting scope or scale distinction.`;
  if (candidate.mechanism === "MAGNITUDE_MISMATCH" && candidate.magnitudeGap === 0 && candidate.severityGap === 0) return `${candidate.candidateId}: magnitude-mismatch candidate matches the target.`;
  if (candidate.mechanism === "INDIRECTNESS_CONFUSION" && (candidate.causalDistance ?? 0) <= 1) return `${candidate.candidateId}: indirectness candidate is not distant.`;
  if (!candidate.rejectionReason.trim()) return `${candidate.candidateId}: missing target-relative rejection reason.`;
  return null;
}

/** Verifies rendered review items, including target-relative distractor evidence. */
export function validateGeneratedCaeQuestion(question: GeneratedCaeQuestion): readonly string[] {
  const issues: string[] = [];
  if (question.causalStateId.includes("distractors:") || question.causalStateId.includes("presentation:")) issues.push(`${question.causalStateId}: causal state must exclude options and their presentation.`);
  if (!question.itemVariantId.startsWith(question.causalStateId) || !question.itemVariantId.includes("distractors:") || !question.itemVariantId.includes("presentation:")) issues.push(`${question.causalStateId}: item variant must extend the causal state with candidates and presentation.`);
  if (question.options.length !== 4 && question.options.length !== 5) issues.push(`${question.semanticInstanceId}: invalid option count.`);
  if (question.options.filter((_, index) => index === question.correctIndex).length !== 1) issues.push(`${question.semanticInstanceId}: exactly one answer must be marked.`);
  for (const option of question.options) if (RETIRED_TEMPLATE_ARTIFACT.test(option)) issues.push(`${question.semanticInstanceId}: retired template wording reached a rendered item.`);
  for (const option of question.options) if (/\{(?:target|anchor|relativeTime|reverseRelation|temporalRelation|indirectDistance)\}/u.test(option)) issues.push(`${question.semanticInstanceId}: an unresolved distractor rendering token reached a rendered item.`);
  for (const candidate of question.candidateComparisons) {
    const issue = validateCandidateComparison(candidate);
    if (issue) issues.push(`${question.semanticInstanceId}: ${issue}`);
  }
  if (question.candidateComparisons.length > 0) {
    const distractorTexts = question.optionMetadata.filter((option) => !option.isCorrect).map((option) => option.text.trim().toLowerCase());
    const openings = distractorTexts.map((text) => text.split(/\s+/u).slice(0, 3).join(" "));
    if (new Set(openings).size !== openings.length) issues.push(`${question.semanticInstanceId}: candidate options repeat a template-like opening.`);
    if (question.difficulty !== "EASY" && question.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length < 2) issues.push(`${question.semanticInstanceId}: medium/hard item lacks two initially credible alternatives.`);
  }
  if (question.checkpointId === "CAE-CP-005" && question.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length < 2) issues.push(`${question.semanticInstanceId}: CP-005 must present at least two credible competing explanations.`);
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
