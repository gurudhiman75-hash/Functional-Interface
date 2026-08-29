export type ReleaseLanguageCode = "en" | "hi" | "pa";

export type ReleaseCompilationManifest = {
  languageCode: ReleaseLanguageCode;
  status: string;
  resourceStatus?: string;
  declaredEventCount?: number;
  eventIds: string[];
};

export type ReleaseQuestionManifest = {
  required: boolean;
  runPresent: boolean;
  totalItems: number;
  approvedItems: number;
  hindiReadyItems: number;
  punjabiReadyItems: number;
};

export type CurrentAffairsReleaseReadinessInput = {
  compilations: ReleaseCompilationManifest[];
  verifiedEventCount: number;
  expectedEventCount: number;
  currentAuthoringCount: number;
  currentHindiLocalizationCount: number;
  currentPunjabiLocalizationCount: number;
  openConflictCount: number;
  duplicateStoryThreadCount: number;
  questions: ReleaseQuestionManifest;
};

export type CurrentAffairsReleaseReadiness = {
  ready: boolean;
  blockers: string[];
  checks: {
    hasAllLanguages: boolean;
    allCompilationsDraft: boolean;
    manifestIntegrity: boolean;
    eventParity: boolean;
    eventVerification: boolean;
    authoringParity: boolean;
    noteLocalizationParity: boolean;
    conflictFree: boolean;
    storyConsolidated: boolean;
    quizReady: boolean;
    questionLocalizationParity: boolean;
  };
};

function normalizedEventIds(ids: string[]): string[] {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

function sameIds(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

export function evaluateCurrentAffairsReleaseReadiness(
  input: CurrentAffairsReleaseReadinessInput,
): CurrentAffairsReleaseReadiness {
  const blockers: string[] = [];
  const byLanguage = new Map(input.compilations.map((item) => [item.languageCode, item]));
  const english = byLanguage.get("en");
  const hindi = byLanguage.get("hi");
  const punjabi = byLanguage.get("pa");
  const hasAllLanguages = Boolean(english && hindi && punjabi && input.compilations.length === 3);
  if (!hasAllLanguages) blockers.push("English, Hindi and Punjabi compilation drafts are all required");

  const allCompilationsDraft = hasAllLanguages
    && [english!, hindi!, punjabi!].every((item) =>
      item.status === "draft" && (item.resourceStatus ?? "draft") === "draft");
  if (hasAllLanguages && !allCompilationsDraft) {
    blockers.push("All three compilation manifests and learning resources must still be draft before release approval");
  }

  const normalizedByLanguage = new Map(
    input.compilations.map((item) => [item.languageCode, normalizedEventIds(item.eventIds)]),
  );
  const manifestIntegrity = hasAllLanguages
    && [english!, hindi!, punjabi!].every((item) => {
      const actual = normalizedByLanguage.get(item.languageCode)?.length ?? 0;
      return (item.declaredEventCount ?? actual) === actual;
    });
  if (hasAllLanguages && !manifestIntegrity) {
    blockers.push("Compilation event_count must match the frozen event manifest in every language");
  }

  const englishIds = normalizedByLanguage.get("en") ?? [];
  const hindiIds = normalizedByLanguage.get("hi") ?? [];
  const punjabiIds = normalizedByLanguage.get("pa") ?? [];
  const eventParity = hasAllLanguages
    && englishIds.length > 0
    && sameIds(englishIds, hindiIds)
    && sameIds(englishIds, punjabiIds);
  if (hasAllLanguages && !eventParity) {
    blockers.push("English, Hindi and Punjabi compilations must contain the exact same event manifest");
  }

  const eventVerification = input.expectedEventCount > 0
    && input.verifiedEventCount === input.expectedEventCount;
  if (!eventVerification) blockers.push("Every release event must still be verified");

  const authoringParity = input.currentAuthoringCount === input.expectedEventCount;
  if (!authoringParity) blockers.push("Every event must still reference current accepted English learner authoring");

  const noteLocalizationParity = input.currentHindiLocalizationCount === input.expectedEventCount
    && input.currentPunjabiLocalizationCount === input.expectedEventCount;
  if (!noteLocalizationParity) blockers.push("Every event requires current parity-ready Hindi and Punjabi notes");

  const conflictFree = input.openConflictCount === 0;
  if (!conflictFree) blockers.push("Open factual conflicts block Current Affairs release");

  const storyConsolidated = input.duplicateStoryThreadCount === 0;
  if (!storyConsolidated) blockers.push("Duplicate updates from the same story thread must be consolidated before release");

  const q = input.questions;
  const quizReady = !q.required
    ? (!q.runPresent || q.totalItems === q.approvedItems)
    : q.runPresent && q.totalItems > 0 && q.approvedItems === q.totalItems;
  if (!quizReady) {
    blockers.push(q.runPresent
      ? "Every English Current Affairs quiz item must be editorially approved"
      : "This compilation requires an English Current Affairs quiz run before release");
  }

  const questionLocalizationParity = !q.runPresent || q.totalItems === 0
    ? !q.required
    : q.hindiReadyItems === q.totalItems && q.punjabiReadyItems === q.totalItems;
  if (!questionLocalizationParity) {
    blockers.push("Every English quiz item requires current parity-ready Hindi and Punjabi question drafts");
  }

  return {
    ready: blockers.length === 0,
    blockers,
    checks: {
      hasAllLanguages,
      allCompilationsDraft,
      manifestIntegrity,
      eventParity,
      eventVerification,
      authoringParity,
      noteLocalizationParity,
      conflictFree,
      storyConsolidated,
      quizReady,
      questionLocalizationParity,
    },
  };
}
