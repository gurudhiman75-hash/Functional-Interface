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
  };
};

function normalizedIds(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function sameIds(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
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

  const censusNotBlocked = input.censusStatus !== "blocked" && input.censusBlockerCount === 0;
  if (!censusNotBlocked) blockers.push("The target-date discovery census has a hard blocker");
  if (censusNotBlocked && input.censusStatus && input.censusStatus !== "complete") {
    warnings.push(`Discovery census remains ${input.censusStatus}; editorial approval may proceed only as an explicit manual decision.`);
  }

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
    },
  };
}
