import { evaluateCurrentAffairsEditorialPriority } from "./editorial-priority";

export type DailyMasterPackApprovalLanguage = "en" | "hi" | "pa";

export type DailyMasterPackApprovalManifest = {
  language: DailyMasterPackApprovalLanguage;
  payloadLanguage: string;
  status: string;
  resourceStatus: string;
  declaredEventCount: number;
  declaredCategoryCount: number;
  payloadEventIds: string[];
  payloadCategoryCount: number;
  renderTargets: string[];
};

export type DailyMasterPackEditorialEvent = {
  id: string;
  title: string;
  summary: string;
  oneLiner: string;
  category: string;
  facts: Array<{ key: string; value: string }>;
};

export type DailyMasterPackEditorialQualityIssue = {
  eventId: string;
  kind: "routine_event" | "malformed_planned_action" | "malformed_entity" | "truncated_copy" | "internal_authoring_artifact" | "generic_placeholder_title";
  detail: string;
};

export type DailyMasterPackEditorialQuality = {
  ready: boolean;
  blockers: string[];
  warnings: string[];
  issues: DailyMasterPackEditorialQualityIssue[];
};

export type DailyMasterPackApprovalReadinessInput = {
  packs: DailyMasterPackApprovalManifest[];
  currentEligibleEventIds: string[];
  verifiedEventCount: number;
  currentAuthoringCount: number;
  currentHindiLocalizationCount: number;
  currentPunjabiLocalizationCount: number;
  openConflictCount: number;
  censusStatus: string | null;
  censusBlockerCount: number;
  editorialQuality: DailyMasterPackEditorialQuality;
};

export type DailyMasterPackApprovalReadiness = {
  ready: boolean;
  blockers: string[];
  warnings: string[];
  checks: {
    hasAllLanguages: boolean;
    editablePackState: boolean;
    resourcesRemainDraft: boolean;
    payloadIntegrity: boolean;
    eventParity: boolean;
    currentEligibilityParity: boolean;
    allRenderTargetsAvailable: boolean;
    eventVerification: boolean;
    authoringParity: boolean;
    noteLocalizationParity: boolean;
    conflictFree: boolean;
    censusNotBlocked: boolean;
    editorialQuality: boolean;
  };
};

const MALFORMED_SCHEDULED_ACTION = /\bscheduled\s+(?:launch|conduct|inaugurat(?:e|ion)|hold|held|open|unveil|release)\b/i;
const INTERNAL_AUTHORING_ARTIFACT = /\b(?:verified official facts|acting body|reconciled atomic facts|verified fact graph|source-independent learner wording|extraction metadata)\b/i;
const GENERIC_PLACEHOLDER_TITLE = /^(?:government of india|reserve bank of india|sebi|isro|official source|punjab government):\s+(?:key\s+)?(?:national affairs|economy and banking|international affairs|appointment|award|report and index|sports|science and technology|space|defence|environment|punjab affairs|current affairs)\s+(?:development|announcement|initiative|update)$/i;

function normalizedIds(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function sameIds(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

function normalizedFactKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function issueLabel(issue: DailyMasterPackEditorialQualityIssue) {
  switch (issue.kind) {
    case "routine_event": return `Routine/recurring item remains in canonical pack (${issue.eventId}): ${issue.detail}`;
    case "malformed_planned_action": return `Malformed planned-event wording remains in canonical pack (${issue.eventId}): ${issue.detail}`;
    case "malformed_entity": return `Malformed event entity remains in canonical pack (${issue.eventId}): ${issue.detail}`;
    case "truncated_copy": return `Mechanically truncated learner copy remains in canonical pack (${issue.eventId}): ${issue.detail}`;
    case "internal_authoring_artifact": return `Internal extraction/authoring wording leaked into learner copy (${issue.eventId}): ${issue.detail}`;
    case "generic_placeholder_title": return `Generic placeholder title remains in canonical pack (${issue.eventId}): ${issue.detail}`;
  }
}

export function evaluateDailyMasterPackEditorialQuality(
  events: DailyMasterPackEditorialEvent[],
): DailyMasterPackEditorialQuality {
  const issues: DailyMasterPackEditorialQualityIssue[] = [];
  const seen = new Set<string>();

  const add = (issue: DailyMasterPackEditorialQualityIssue) => {
    const key = `${issue.eventId}:${issue.kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push(issue);
  };

  for (const event of events) {
    const priority = evaluateCurrentAffairsEditorialPriority({
      title: event.title,
      summary: event.summary,
      category: event.category,
      facts: event.facts,
    });
    if (priority.tier === "routine") {
      add({
        eventId: event.id,
        kind: "routine_event",
        detail: priority.reasons.join(", ") || event.title,
      });
    }

    const learnerCopy = `${event.title} ${event.summary} ${event.oneLiner}`.replace(/\s+/g, " ").trim();
    const actionFact = event.facts.find((fact) => normalizedFactKey(fact.key) === "official_action");
    if (MALFORMED_SCHEDULED_ACTION.test(learnerCopy) || (actionFact && MALFORMED_SCHEDULED_ACTION.test(actionFact.value))) {
      add({
        eventId: event.id,
        kind: "malformed_planned_action",
        detail: actionFact?.value || event.summary,
      });
    }

    const entityArtifact = event.facts.find((fact) => {
      const key = normalizedFactKey(fact.key);
      return (key === "acting_entity" || key === "launching_entity") && /\bto be\s*$/i.test(fact.value.trim());
    });
    if (entityArtifact) {
      add({
        eventId: event.id,
        kind: "malformed_entity",
        detail: `${entityArtifact.key}: ${entityArtifact.value}`,
      });
    }

    if (/(?:…|\.\.\.)\s*$/.test(event.title.trim()) || /(?:…|\.\.\.)\s*(?:[—-].*)?$/.test(event.oneLiner.trim())) {
      add({
        eventId: event.id,
        kind: "truncated_copy",
        detail: /(?:…|\.\.\.)\s*$/.test(event.title.trim()) ? event.title : event.oneLiner,
      });
    }

    if (INTERNAL_AUTHORING_ARTIFACT.test(learnerCopy)) {
      add({
        eventId: event.id,
        kind: "internal_authoring_artifact",
        detail: event.summary,
      });
    }

    if (GENERIC_PLACEHOLDER_TITLE.test(event.title.trim())) {
      add({
        eventId: event.id,
        kind: "generic_placeholder_title",
        detail: event.title,
      });
    }
  }

  const blockers = issues.map(issueLabel);
  return {
    ready: blockers.length === 0,
    blockers,
    warnings: [],
    issues,
  };
}

export function evaluateDailyMasterPackApprovalReadiness(
  input: DailyMasterPackApprovalReadinessInput,
): DailyMasterPackApprovalReadiness {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const byLanguage = new Map(input.packs.map((pack) => [pack.language, pack]));
  const english = byLanguage.get("en");
  const hindi = byLanguage.get("hi");
  const punjabi = byLanguage.get("pa");

  const hasAllLanguages = input.packs.length === 3 && Boolean(english && hindi && punjabi);
  if (!hasAllLanguages) blockers.push("English, Hindi and Punjabi canonical master packs are all required for editorial approval");

  const editablePackState = hasAllLanguages
    && [english!, hindi!, punjabi!].every((pack) => pack.status === "draft" || pack.status === "review");
  if (hasAllLanguages && !editablePackState) {
    blockers.push("All canonical master packs must still be draft or review before approval");
  }

  const resourcesRemainDraft = hasAllLanguages
    && [english!, hindi!, punjabi!].every((pack) => pack.resourceStatus === "draft");
  if (hasAllLanguages && !resourcesRemainDraft) {
    blockers.push("Canonical master-pack learning resources must remain draft during editorial approval");
  }

  const normalizedByLanguage = new Map(
    input.packs.map((pack) => [pack.language, normalizedIds(pack.payloadEventIds)]),
  );
  const payloadIntegrity = hasAllLanguages
    && [english!, hindi!, punjabi!].every((pack) => {
      const ids = normalizedByLanguage.get(pack.language) ?? [];
      return pack.payloadLanguage === pack.language
        && ids.length > 0
        && pack.payloadEventIds.length === ids.length
        && pack.declaredEventCount === ids.length
        && pack.declaredCategoryCount === pack.payloadCategoryCount
        && pack.payloadCategoryCount > 0;
    });
  if (hasAllLanguages && !payloadIntegrity) {
    blockers.push("Each canonical master-pack payload must match its language, contain unique events, and match declared event/category counts");
  }

  const englishIds = normalizedByLanguage.get("en") ?? [];
  const hindiIds = normalizedByLanguage.get("hi") ?? [];
  const punjabiIds = normalizedByLanguage.get("pa") ?? [];
  const eventParity = hasAllLanguages
    && englishIds.length > 0
    && sameIds(englishIds, hindiIds)
    && sameIds(englishIds, punjabiIds);
  if (hasAllLanguages && !eventParity) {
    blockers.push("English, Hindi and Punjabi canonical master packs must contain the exact same event IDs");
  }

  const currentEligible = normalizedIds(input.currentEligibleEventIds);
  const currentEligibilityParity = englishIds.length > 0
    && sameIds(englishIds, currentEligible);
  if (!currentEligibilityParity) {
    blockers.push("The stored canonical master pack is stale or incomplete relative to the current verified exam-relevant event set");
  }

  const requiredTargets = ["web", "text", "pdf"];
  const allRenderTargetsAvailable = hasAllLanguages
    && [english!, hindi!, punjabi!].every((pack) => requiredTargets.every((target) => pack.renderTargets.includes(target)));
  if (hasAllLanguages && !allRenderTargetsAvailable) {
    warnings.push("One or more stored render-target manifests predate multilingual PDF support; runtime PDF capability is validated separately and the mutable rows will be upgraded by CP-042 schema bootstrap.");
  }

  const expectedEventCount = englishIds.length;
  const eventVerification = expectedEventCount > 0 && input.verifiedEventCount === expectedEventCount;
  if (!eventVerification) blockers.push("Every canonical master-pack event must still be verified");

  const authoringParity = expectedEventCount > 0 && input.currentAuthoringCount === expectedEventCount;
  if (!authoringParity) blockers.push("Every canonical master-pack event must still reference current accepted English learner authoring");

  const noteLocalizationParity = expectedEventCount > 0
    && input.currentHindiLocalizationCount === expectedEventCount
    && input.currentPunjabiLocalizationCount === expectedEventCount;
  if (!noteLocalizationParity) blockers.push("Every canonical master-pack event requires current parity-ready Hindi and Punjabi localization");

  const conflictFree = input.openConflictCount === 0;
  if (!conflictFree) blockers.push("Open factual conflicts block canonical master-pack approval");

  // CP-043: a canonical day cannot be locked while discovery is still only in review.
  // Manual approval remains powerful, but it does not override an incomplete census.
  const censusNotBlocked = input.censusStatus === "complete" && input.censusBlockerCount === 0;
  if (!censusNotBlocked) {
    blockers.push(
      input.censusStatus === "review"
        ? "The target-date discovery census is still in review and must reach complete before canonical approval"
        : input.censusStatus
          ? `The target-date discovery census is ${input.censusStatus} and must reach complete before canonical approval`
          : "The target-date discovery census is missing and must be materialized as complete before canonical approval",
    );
  }

  const editorialQuality = input.editorialQuality.ready;
  if (!editorialQuality) blockers.push(...input.editorialQuality.blockers);
  warnings.push(...input.editorialQuality.warnings);

  return {
    ready: blockers.length === 0,
    blockers,
    warnings,
    checks: {
      hasAllLanguages,
      editablePackState,
      resourcesRemainDraft,
      payloadIntegrity,
      eventParity,
      currentEligibilityParity,
      allRenderTargetsAvailable,
      eventVerification,
      authoringParity,
      noteLocalizationParity,
      conflictFree,
      censusNotBlocked,
      editorialQuality,
    },
  };
}